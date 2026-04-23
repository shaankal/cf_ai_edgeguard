import { routeAgentRequest } from "agents";
import { AIChatAgent } from "@cloudflare/ai-chat";
import { createWorkersAI } from "workers-ai-provider";
import { streamText, convertToModelMessages } from "ai";
import { sampleLogs } from "./sampleLogs";
import type { AnalysisResult, EdgeGuardState, LogEntry } from "./types";

export interface Env {
  AI: Ai;
  ChatAgent: DurableObjectNamespace<ChatAgent>;
}

function analyzeLogs(logs: LogEntry[]): AnalysisResult {
  const failedLoginsByIp: Record<string, number> = {};
  const latenciesByPath: Record<string, number[]> = {};

  for (const log of logs) {
    if (!latenciesByPath[log.path]) {
      latenciesByPath[log.path] = [];
    }
    latenciesByPath[log.path].push(log.latency);

    if (log.path.includes("login") && log.status === 401) {
      failedLoginsByIp[log.ip] = (failedLoginsByIp[log.ip] || 0) + 1;
    }
  }

  const repeatedFailedLoginIps = Object.entries(failedLoginsByIp)
    .filter(([, count]) => count >= 3)
    .map(([ip]) => ip);

  const suspiciousIps = [...repeatedFailedLoginIps];

  const slowEndpoints = Object.entries(latenciesByPath)
    .map(([path, latencies]) => {
      const avgLatency =
        latencies.reduce((sum, value) => sum + value, 0) / latencies.length;
      return {
        path,
        avgLatency: Math.round(avgLatency),
      };
    })
    .filter((entry) => entry.avgLatency > 1000);

  return {
    suspiciousIps,
    slowEndpoints,
    totalRequests: logs.length,
    repeatedFailedLoginIps,
  };
}

function shouldAnalyzeTraffic(messageText: string): boolean {
  const text = messageText.toLowerCase();

  return [
    "analyze",
    "traffic",
    "logs",
    "suspicious",
    "latency",
    "slow",
    "performance",
    "security",
    "ip",
    "rate limit",
    "firewall",
    "cache",
  ].some((keyword) => text.includes(keyword));
}

export class ChatAgent extends AIChatAgent<Env> {
  initialState: EdgeGuardState = {
    flaggedIps: [],
    lastSummary: "",
    incidentCount: 0,
  };

  async onChatMessage() {
    const workersai = createWorkersAI({ binding: this.env.AI });

    const latestMessage = this.messages[this.messages.length - 1];

    const latestUserMessage =

      latestMessage?.parts

        ?.filter((part): part is { type: "text"; text: string } => part.type === "text")

        .map((part) => part.text)

        .join(" ")

        .trim() ?? "";

    const runTrafficAnalysis = shouldAnalyzeTraffic(latestUserMessage);

    let analysis: AnalysisResult | null = null;
    let nextFlaggedIps = (this.state as EdgeGuardState).flaggedIps;

    if (runTrafficAnalysis) {
      analysis = analyzeLogs(sampleLogs);

      nextFlaggedIps = Array.from(
        new Set([...(this.state as EdgeGuardState).flaggedIps, ...analysis.suspiciousIps])
      );

      this.setState({
        flaggedIps: nextFlaggedIps,
        lastSummary: JSON.stringify(analysis),
        incidentCount:
          analysis.suspiciousIps.length + analysis.slowEndpoints.length,
      });
    }

    const systemPrompt = `
You are EdgeGuard, an AI assistant for request-log security and performance analysis
for modern web applications.

You help users interpret traffic patterns clearly and recommend practical next steps.
Be concise, technical, and useful.

If structured traffic analysis is provided, prioritize it heavily over generic advice.
If no structured analysis is provided, answer normally but stay focused on web traffic,
security, and performance.

Remembered flagged IPs:
${JSON.stringify(nextFlaggedIps, null, 2)}

Latest structured analysis:
${analysis ? JSON.stringify(analysis, null, 2) : "No fresh traffic analysis was run for this message."}

If analysis is present, your response should:
1. Summarize suspicious activity.
2. Summarize latency/performance issues.
3. Mention remembered flagged IPs if relevant.
4. Recommend concrete next steps such as:
   - firewall rules
   - rate limiting
   - caching/CDN changes
   - endpoint monitoring
5. Keep it actionable and not vague.
`;

    const result = streamText({
      model: workersai("@cf/zai-org/glm-4.7-flash"),
      messages: [
        { role: "system", content: systemPrompt },
        ...(await convertToModelMessages(this.messages)),
      ],
    });

    return result.toUIMessageStreamResponse();
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;