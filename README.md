# 🏟️ AuraFlow — Smart Stadium Operations Intelligence Platform

> **PromptWars Submission — Hack2Skill**
>
> AuraFlow is a mobile-first intelligent stadium coordination prototype designed to improve crowd movement, reduce queue congestion, and simulate real-time venue operations inside large-scale sporting arenas (50,000+ attendees).

**[Live Demo](https://aura-flow-ten.vercel.app/)**

## 🧪 Quick Demo Instructions (For Evaluators)

1. Open the Live Demo.
2. Navigate to the **Map** tab.
3. Click different stadium zones to observe density updates.
4. Go to **Concessions** to see predictive queue adjustments.
5. Open **Alerts Hub** and click **Simulate Sector Surge**.
6. Observe:
   - Map congestion changes
   - Queue wait-time increases
   - Critical alerts triggered
   - Routing recommendations updated

This demonstrates cross-module telemetry synchronization in real time.

Built using **Next.js (App Router)** and **Tailwind CSS**, the application demonstrates how shared telemetry simulation can power routing decisions, predictive wait-time estimation, and automated venue alerts.

---

## 🛑 Problem Statement

Large stadium venues experience operational friction during peak event moments:
* Entry congestion
* Concourse crowd bottlenecks
* Long concession queues
* Poor real-time coordination visibility

Traditional venue management relies heavily on manual observation and static signage. AuraFlow demonstrates how simulation-driven intelligence systems can assist venue operators with predictive coordination insights.

---

## 🚀 Solution Overview

AuraFlow simulates a real-time stadium coordination platform using a shared telemetry engine that powers:
* Live crowd density visualization
* Predictive concession wait-time modeling
* Automated congestion alert generation
* Cross-zone routing recommendations

The system behaves like a lightweight smart-venue operating layer, eliminating friction before it occurs.

---

## ✨ Core Features

### 1. Live Crowd Flow Intelligence Panel
An interactive stadium heatmap showing:
* Zone-level congestion states.
* Routing recommendations.
* Density-driven decision indicators.

### 2. Predictive Smart Queue Engine
Simulated wait-time forecasting using a shared telemetry context: `dynamicWaitTime = baseWaitTime + (zoneDensity × 0.2)`
* Fastest stand recommendations.
* Congestion severity labels.
* Virtual queue workflow simulation.

### 3. Venue Alert Coordination Hub
An automated alert lifecycle engine handling:
* Congestion detection.
* Surge detection.
* Recovery notifications.

---

## 🧠 Simulation Architecture

AuraFlow uses a shared frontend telemetry engine (`SimulationContext`) which synchronizes:
* Heatmap density
* Queue prediction logic
* Alert generation engine
* Routing recommendations

All modules react instantly to congestion state changes. This demonstrates real-time venue intelligence behavior without requiring backend infrastructure.
This shared telemetry simulation mirrors how real-world stadium coordination platforms integrate crowd sensing, service prediction, and operational alerting pipelines.

---

## 📸 Screenshots

<table>
<tr>
<td align="center">
<img src="https://github.com/user-attachments/assets/741f0ae0-e2c0-4fbf-a121-c62e55f73d98" width="100%">
<br><b>Live Crowd Flow Panel</b>
</td>

<td align="center">
<img src="https://github.com/user-attachments/assets/5de03d88-48f4-44d1-87f6-73defd4c232a" width="100%">
<br><b>Smart Queue Engine</b>
</td>

<td align="center">
<img src="https://github.com/user-attachments/assets/05a95c12-dd1e-44fc-b074-b463b07e9efa" width="100%">
<br><b>Alerts Coordination Hub</b>
</td>
</tr>
</table>

---

## 💻 Technology Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **State Architecture:** React Context API
* **Simulation Engine:** Custom density fluctuation hook
* **Prediction Engine:** Dynamic queue modeling hook
* **Alert Engine:** Threshold-based venue coordination hook
* **Deployment:** Vercel

---

## 🛠️ Running Locally

Install dependencies:
```
npm install
```

Start the development server:
```
npm run dev
```

Create a production build:
```
npm run build
npm run start
```

## 🔮 Future Improvements

Possible production upgrades include:

* Real IoT sensor ingestion.

* Live camera-based crowd detection.

* Streaming telemetry pipelines.

* Edge inference integration.

* Multi-venue coordination dashboards.

## 👨‍💻 Author

**Bhavesh Vadnere**

PromptWars Submission — Hack2Skill 

GitHub Profile: https://github.com/BhaveshV23

LinkedIn Profile: https://linkedin.com/in/bhavesh-vadnere
