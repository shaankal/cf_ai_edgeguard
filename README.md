# cf_ai_edgeguard

AI-powered request-log analysis assistant built on Cloudflare.

This project uses the Cloudflare Agents SDK, Workers AI, and Durable Object-backed state to analyze web traffic, detect suspicious activity, and recommend performance and security actions in real time.

---

## 🚀 Overview

cf_ai_edgeguard is designed to simulate how developers and platform engineers can use AI directly at the edge to interpret request traffic and take action faster.

The agent:
- analyzes structured request logs
- detects suspicious patterns (e.g., repeated failed logins)
- identifies performance issues (e.g., high-latency endpoints)
- remembers flagged IPs across a session
- recommends actionable fixes like rate limiting, firewall rules, and caching strategies

---

## 🧠 Why this project

Cloudflare operates at Internet scale, handling massive volumes of traffic globally.

This project explores how AI can:
- turn raw request data into insights instantly
- reduce time-to-diagnosis for issues
- assist developers in making real-time decisions at the edge

---

## ⚙️ Architecture

- **Frontend/UI**: React chat interface (Kumo components)
- **Agent runtime**: Cloudflare Agents SDK
- **State/memory**: Durable Object-backed agent state
- **LLM**: Workers AI (no API key required)
- **Deployment**: Cloudflare global network

---

## ✨ Features

- 💬 Chat-based traffic analysis
- 🧠 Session memory for flagged IPs and incidents
- 🔍 Detection of suspicious login activity
- ⚡ Identification of slow endpoints
- 🛠️ Actionable recommendations:
  - rate limiting
  - firewall rules
  - caching improvements
  - monitoring strategies

---

## 🧪 Example prompts

Try these in the UI:

- Analyze the current request logs  
- Which IPs look suspicious?  
- Why is latency high?  
- What should I block or rate limit?  

---

## 📊 Example output behavior

The agent will:

- flag `192.0.2.10` for repeated failed login attempts  
- identify `/api/search` as a high-latency endpoint  
- recommend:
  - rate limiting login endpoints  
  - investigating backend latency  
  - applying caching/CDN improvements  

---

## 🧩 Project structure
