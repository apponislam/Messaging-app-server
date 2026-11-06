# 💬 Messaging App — Backend Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8+-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust, scalable real-time messaging, WebRTC audio/video signaling, and notification backend built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Socket.io**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Documentation](#-api-documentation)
  - [Authentication](#authentication-apiv1auth)
  - [Users](#users-apiv1user)
  - [Messages](#messages-apiv1message)
  - [Calls](#calls-apiv1call)
  - [Notifications](#notifications-apiv1notification)
- [WebSocket & WebRTC Signaling](#-websocket--webrtc-signaling)
  - [Socket Connection & Authentication](#socket-connection--authentication)
  - [Messaging Events](#messaging-events)
  - [Call & WebRTC Signaling Events](#call--webrtc-signaling-events)
  - [Notification Events](#notification-events)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

### 💬 Real-Time Direct Messaging
- Instant one-on-one message exchange powered by **Socket.io**.
- Message persistence in **MongoDB** with sender and receiver relations.
- Real-time message broadcasting to dedicated user rooms (`user_<userId>`).
- Chronologically ordered chat history retrieval between any two users.

### 📹 Real-Time Audio & Video Calling (WebRTC Signaling)
- Real-time peer-to-peer WebRTC signaling exchange (offers, answers, ICE candidates).
- Full call lifecycle state management: `ringing`, `ongoing`, `completed`, `missed`, `rejected`, and `cancelled`.
- Support for both **audio** and **video** call modes.
- Call history logging with start time, end time, and duration metrics.

### 🔔 Live Notifications
- Real-time in-app notification dispatch on incoming messages and events.
- Notification feed retrieval with unread status tracking.
- Read status updates (`PATCH /api/v1/notification/:id/read`).

### 🔐 Authentication & Security
- Secure token-based authentication using **JWT** (Access and Refresh token flow).
- Automatic generation of unique usernames for newly registered users.
- Strong password hashing with **Bcrypt**.
- Protected REST endpoints with custom authorization middleware.
- Socket connection authentication verifying JWT credentials during handshake.
- Secure, HTTP-only cookie support.
- Request payload validation using **Zod**.

### 🛠️ Developer Experience & Architecture
- Modular MVC-like folder structure (Routes, Controllers, Services, Models, Interfaces, Validations).
- Global error handling middleware with custom `ApiError`.
- Standardized API response format (`sendResponse`).
- Strict TypeScript configuration for full type safety.

---

## 🛠 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend Framework:** [Express 5](https://expressjs.com/)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Real-Time Engine:** [Socket.io](https://socket.io/) (WebSockets with polling fallback)
- **Validation:** [Zod](https://zod.dev/)
- **Authentication:** [JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Deployment Platform:** [Vercel](https://vercel.com/) / Any Node.js server container

---

## 📁 Project Architecture

```
Messaging-app-server/
├── src/
│   ├── app/
│   │   ├── config/              # Environment and app configuration
│   │   ├── middlewares/         # Auth, validation, and error middlewares
│   │   ├── modules/             # Business logic split into modular features
│   │   │   ├── auth/            # Registration, login, token refresh
│   │   │   ├── call/            # Call logs, CRUD, call statuses
│   │   │   ├── messages/        # Messaging services and controllers
│   │   │   ├── notifications/   # In-app notifications
│   │   │   └── users/           # User profiles and user queries
│   │   └── routes/              # Centralized route aggregator
│   ├── errors/                  # Custom API errors & global error handler
│   ├── lib/
│   │   └── sockets/             # WebRTC signaling and call socket handlers
│   ├── socket/                  # Socket.io initialization & middleware
│   ├── types/                   # Global TypeScript type declarations
│   ├── utils/                   # Helper utilities (response, async handler, etc.)
│   ├── app.ts                   # Express application setup
│   └── server.ts                # Server bootstrap and database connection
├── .env.example                 # Environment configuration template
├── .gitignore                   # Files and directories ignored by Git
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel deployment configuration
└── LICENSE                      # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- A running [MongoDB](https://www.mongodb.com/) database instance (locally or on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/Messaging-app-server.git
   cd Messaging-app-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your variables:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/messaging_app?retryWrites=true&w=majority

# Hashing
BCRYPT_SALT_ROUNDS=12

# JWT Authentication
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_ACCESS_EXPIRE=1d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# Client URL (for CORS & WebSockets)
CLIENT_URL=http://localhost:3000
```

### Running the Server

#### Development Mode (with hot-reloading):
```bash
npm run dev
```

#### Production Build:
```bash
npm run build
npm run prod
# or
npm start
```

The server will start listening at: `http://localhost:5000` (or your configured `PORT`).

---

## 📖 API Documentation

**Base URL:** `/api/v1`

All protected endpoints require an `Authorization` header with a Bearer token:
```http
Authorization: <JWT_ACCESS_TOKEN>
```

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/auth/register` | Register a new user account (auto-generates unique username) | No |
| `POST` | `/auth/login` | Login with email and password | No |
| `POST` | `/auth/refresh-token` | Generate a new access token using refresh token cookie | No |

#### Register Payload Example:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPassword123!",
  "avatarUrl": "https://example.com/avatar.png"
}
```

---

### Users (`/api/v1/user`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/user/me` | Fetch authenticated user's profile | Yes |
| `GET` | `/user` | Get all registered users | Yes |
| `GET` | `/user/:id` | Get user details by user ID | Yes |

---

### Messages (`/api/v1/message`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/message` | Send a new message to a user | Yes |
| `GET` | `/message/:userId` | Get full conversation history with a user | Yes |

#### Send Message Payload:
```json
{
  "receiver": "651a2b3c4d5e6f7a8b9c0d1e",
  "content": "Hello! How are you?"
}
```

---

### Calls (`/api/v1/call`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/call` | Create a new call record | Yes |
| `GET` | `/call` | Get all calls for the authenticated user | Yes |
| `GET` | `/call/:callId` | Get call details by Call ID | Yes |
| `PATCH` | `/call/:callId` | Update call status, duration, or end time | Yes |
| `DELETE` | `/call/:callId` | Delete a call log record | Yes |

---

### Notifications (`/api/v1/notification`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/notification` | Retrieve notifications for logged-in user | Yes |
| `PATCH` | `/notification/:id/read` | Mark a notification as read | Yes |

---

## ⚡ WebSocket & WebRTC Signaling

Socket connection endpoint: `ws://localhost:5000` (or your deployment domain)

### Socket Connection & Authentication

Clients authenticate via the `auth` payload during the handshake:

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "<YOUR_JWT_ACCESS_TOKEN>"
  },
  transports: ["websocket", "polling"],
});
```

Upon connection, users automatically join personal rooms:
- `user_<userId>` — For private messages and incoming call alerts.
- `notifications_<userId>` — For real-time notifications.

---

### Messaging Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `newMessage` | Server ➔ Client | `IMessage` object | Broadcasted in real-time to both receiver and sender rooms. |

---

### Call & WebRTC Signaling Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `call:start` | Client ➔ Server | `{ recipientId, type }` | Initiates an audio/video call to a recipient. |
| `call:incoming` | Server ➔ Client | `{ callId, from, type, status }` | Emitted to recipient notifying of an incoming call. |
| `call:signal` | Bidirectional | `{ callId, targetUserId, signal }` | Exchanges WebRTC offer, answer, or ICE candidate signals between peers. |
| `call:reject` | Client ➔ Server | `{ callId, targetUserId }` | Rejects the incoming call. |
| `call:rejected` | Server ➔ Client | `{ callId, from, status }` | Informs the caller that the call was rejected. |
| `call:hangup` | Client ➔ Server | `{ callId, targetUserId }` | Terminates an active call. |
| `call:ended` | Server ➔ Client | `{ callId, from, status }` | Informs the peer that the call has ended. |
| `call:missed` | Bidirectional | `{ callId, targetUserId }` | Marks a call as missed when unanswered. |

---

### Notification Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `newNotification` | Server ➔ Client | `INotification` object | Emitted to recipient on incoming messages/system events. |

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `ts-node-dev ...` | Starts development server with hot-reload |
| `npm run build` | `tsc` | Compiles TypeScript source to `./dist` |
| `npm run start` | `node ./dist/server.js` | Runs compiled code in production mode |
| `npm run prod` | `NODE_ENV=production node ./dist/server.js` | Runs in production mode with explicit env flag |

---

## 🌐 Deployment

### Vercel
The repository includes a ready-to-use [`vercel.json`](vercel.json) configuration:
1. Push your code to GitHub.
2. Import your repository into [Vercel](https://vercel.com/).
3. Set your environment variables in the Vercel Project Settings.
4. Deploy!

*(Note: Persistent WebSockets on serverless platforms such as Vercel have connection duration limits. For production environments requiring long-lived WebRTC signaling and active WebSocket rooms, deploying on a containerized service such as Railway, Render, Fly.io, or an AWS EC2 instance is recommended).*

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Appon Islam**
- **Website / Portfolio:** [apponislam.com](https://apponislam.com)
- **Email:** [apponislamdev@gmail.com](mailto:apponislamdev@gmail.com)

