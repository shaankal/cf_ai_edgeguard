export type LogEntry = {
    ip: string;
    path: string;
    method: string;
    status: number;
    latency: number;
    timestamp: string;
    userAgent: string;
  };
  
  export type SlowEndpoint = {
    path: string;
    avgLatency: number;
  };
  
  export type AnalysisResult = {
    suspiciousIps: string[];
    slowEndpoints: SlowEndpoint[];
    totalRequests: number;
    repeatedFailedLoginIps: string[];
  };
  
  export type EdgeGuardState = {
    flaggedIps: string[];
    lastSummary: string;
    incidentCount: number;
  };