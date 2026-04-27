# cf_ai_edgeguard

AI-powered edge security analyst built on Cloudflare.

This project uses the Cloudflare Agents SDK, Workers AI, and Durable Object-backed state to transform raw request logs into real-time threat detection, performance insights, and actionable mitigation strategies.

---

## 🚀 Overview

cf_ai_edgeguard simulates how developers can use AI directly at the edge to monitor, analyze, and respond to web traffic in real time.

Instead of acting like a generic chatbot, EdgeGuard behaves like an AI security analyst that:

- analyzes structured request logs at the edge
- detects anomalous traffic patterns and suspicious behavior
- identifies performance bottlenecks across endpoints
- maintains session-level memory of flagged IPs and incidents
- generates actionable mitigation strategies (rate limiting, firewall rules, caching)

---

## 🧠 Why this project

Modern applications generate massive volumes of request telemetry, but developers often lack tools to quickly interpret this data and take action.

EdgeGuard explores a practical use case for AI at the edge:
→ turning raw traffic logs into fast, explainable security and performance decisions

This project demonstrates how AI can:
- reduce time-to-diagnosis for production issues
- surface meaningful patterns in noisy traffic data
- assist developers in making real-time infrastructure decisions

This aligns directly with Cloudflare’s mission to build a faster, more secure Internet.

---

## ⚙️ Architecture

EdgeGuard is structured as a lightweight edge-native system:

### 1. Request Log Layer
- Simulated structured logs with:
  - IP address
  - endpoint
  - status codes
  - latency
  - request metadata

### 2. Detection Layer
- Flags repeated failed authentication attempts
- Identifies high-latency endpoints
- Surfaces suspicious traffic patterns across sessions

### 3. Stateful Agent Layer
- Built with Cloudflare Agents SDK
- Uses Durable Object-backed memory to:
  - persist flagged IPs
  - track recurring incidents
  - maintain conversational context

### 4. Recommendation Layer
- Generates concrete actions:
  - rate limiting rules
  - firewall configurations
  - caching/CDN optimizations
  - backend investigation guidance

### Stack

- **Frontend/UI**: React (chat interface with Kumo components)
- **Agent runtime**: Cloudflare Agents SDK
- **State/memory**: Durable Objects
- **LLM**: Workers AI (no external API key required)
- **Deployment**: Cloudflare global edge network

---

## ✨ Features

- 💬 Chat-based traffic analysis interface  
- 🧠 Stateful memory for tracking suspicious IPs and incidents  
- 🔍 Detection of repeated failed login attempts  
- ⚡ Identification of high-latency endpoints  
- 🛠️ Actionable infrastructure recommendations:
  - rate limiting
  - firewall rules
  - caching/CDN strategies
  - performance diagnostics  

---

## 🧪 Example prompts

Try these in the UI:

- Analyze the current request logs  
- Which IPs look suspicious?  
- Why is latency high?  
- What should I block or rate limit?  

---

## 📊 Example behavior

The agent will:

- flag `192.0.2.10` for repeated failed login attempts  
- identify `/api/search` as a high-latency endpoint  
- track suspicious activity across the session  
- recommend:
  - rate limiting authentication endpoints  
  - blocking or monitoring suspicious IPs  
  - investigating backend latency  
  - applying caching/CDN optimizations  

---

## 🧩 Project structure

src/
server.ts # EdgeGuard AI agent (core logic)
sampleLogs.ts # Simulated request logs
types.ts # Type definitions
app.tsx # Chat UI
client.tsx # React entry
styles.css # Styling



---

## 🧪 How to test the application

Use the chat interface and try:

- Analyze the current request logs  
- Which IPs look suspicious?  
- Why is latency high?  
- What should I block or rate limit?  

### Expected behavior

The agent should:

- flag `192.0.2.10` due to repeated failed login attempts  
- identify `/api/search` as a high-latency endpoint  
- maintain memory of flagged entities across the session  
- recommend actionable mitigations such as:

  - rate limiting authentication endpoints  
  - applying firewall rules to suspicious IPs  
  - investigating caching or backend performance  
  - improving endpoint efficiency  

---

## 🏃 Running locally

### Prerequisites
- Node.js v20+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/cf_ai_edgeguard.git
cd cf_ai_edgeguard

Install dependencies
npm install

Start development server
npm run dev

Open in browser
http://localhost:5173

