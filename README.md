# 🍽️ PROJECT-LAZARUS: Dining Philosophers Simulator

An interactive, visual, and educational simulator for the classic **Dining Philosophers Problem** in Operating Systems. Built with modern web technologies, this project demonstrates core concurrency and synchronization concepts including deadlocks, starvation, and livelock.

![Hero Image](./src/assets/hero.png)

## ✨ Features

- **Interactive Simulation**: Watch philosophers (threads) interact with forks (shared resources) in real-time.
- **Scenario-Based Engine**: Trigger specific concurrency scenarios:
  - 🚦 *Deadlock*: Everyone grabs the left fork simultaneously!
  - ⏳ *Starvation*: A philosopher is perpetually denied access to resources.
  - 🔄 *Livelock*: Philosophers continuously politely yield to each other but no one eats.
- **Smooth Animations**: Powered by Framer Motion to visualize state transitions organically.
- **Event Logging**: Detailed timeline logs of state changes to track exactly what happens under the hood step-by-step.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dtnotdt/PROJECT-LAZARUS.git
   cd PROJECT-LAZARUS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## 🧠 The Dining Philosophers Problem

Proposed by Edsger W. Dijkstra in 1965, the Dining Philosophers problem is a classic OS synchronization problem. Five philosophers sit around a circular table. Between each pair of adjacent philosophers is a single fork. A philosopher needs *two* forks to eat. Because there are only 5 forks for 5 philosophers, they must coordinate.

The problem illustrates how to design a concurrent algorithm to avoid deadlocks (where every philosopher holds one fork and waits forever) and starvation (where a philosopher never gets both forks).

## 📄 License
This project is open-source and intended for educational purposes.
