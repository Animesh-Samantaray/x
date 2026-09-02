# Collaborative Knowledge Marketplace

A full-stack, real-time interactive platform for knowledge sharing, course discussions, mentorship sessions, and collaborative learning.

---

## 🚀 Key Features

### 🔐 1. Authentication & User Management
- **Local Authentication**: Register & Login with JWT token storage (supported via HTTP-only cookies and Authorization headers).
- **Google OAuth 2.0 Integration**: Single-sign-on using Passport Google OAuth 2.0 with dynamic role selection (`learner`, `creator`, `expert`).
- **Role-Based Access Control**: Granular permissions for `learner`, `creator`, `expert`, and `admin`.

### 💬 2. Real-Time Messaging & Discussion Workspaces
- **Course & Mentorship Discussion Rooms**: Dedicated workspaces tied to specific courses or mentorship sessions.
- **Singleton Socket.IO Lifecycle**: Persistent, auto-reconnecting WebSocket client with queued room joins and state restoration on disconnect.
- **Message Features**:
  - Send text messages and file attachments (images, documents, PDFs).
  - Real-time read receipts (`message_read`).
  - Emoji reactions (`message_reaction`).
  - Single message deletion (`message_deleted`).
  - Full discussion workspace deletion (`conversation_deleted`).

### 🛡️ 3. Conversation Deletion & Access Controls
- **Course Workspace Deletion**: Platform admins and course creators can delete course discussion workspaces.
- **Session Workspace Deletion**: Platform admins, session experts, and session learners/initiators can delete mentorship session workspaces.
- **Real-Time Cascade**: Deleting a workspace removes all associated messages and instantly updates all active participant screens via WebSocket events.

### 🔔 4. Unified Notification System
- **In-App Toast Alerts**: Built with `react-hot-toast` for real-time notification alerts.
- **Native Browser Desktop Notifications**: Optional desktop browser push notifications for background messaging alerts.
- **Personalized User Rooms**: Isolated `user:${userId}` Socket.IO rooms for secure personal event delivery.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Real-time Client**: Socket.IO Client (`socket.io-client`)
- **Toasts**: React Hot Toast (`react-hot-toast`)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ORM
- **Real-time Server**: Socket.IO (`socket.io`)
- **Authentication**: JWT (`jsonwebtoken`) + Passport.js (Google OAuth 2.0)
- **File Uploads**: Cloudinary + Multer
- **Payments Integration**: Razorpay API

---

## 📡 Socket.IO Real-Time Architecture

### Event Flow Architecture

```
User A (Sender)
   │
   ├─► 1. POST /api/message/:conversationId  (HTTP REST Request)
   │
Backend (Server)
   │
   ├─► 2. Save Message to MongoDB
   │
   ├─► 3. req.app.get("io").to(`conversation:${conversationId}`).emit("new_message", message)
   │
User B (Recipient in Room)
   │
   └─► 4. socket.on("new_message") receives payload & updates UI instantly (No reload needed)
```

### Supported Socket Events

| Event Name | Direction | Payload | Description |
| --- | --- | --- | --- |
| `join_conversation` | Client ➔ Server | `conversationId` | Joins room `conversation:${conversationId}` |
| `leave_conversation` | Client ➔ Server | `conversationId` | Leaves room `conversation:${conversationId}` |
| `new_message` | Server ➔ Client | `Message` object | Delivers new message in real time |
| `message_read` | Server ➔ Client | `{ messageId, userId }` | Updates read receipt state |
| `message_deleted` | Server ➔ Client | `{ messageId }` | Removes message from UI |
| `message_reaction` | Server ➔ Client | `UpdatedMessage` object | Updates emoji reactions |
| `conversation_deleted` | Server ➔ Client | `{ conversationId }` | Removes deleted workspace from sidebar |
| `new_notification` | Server ➔ Client | `Notification` object | Emits alert to `user:${userId}` room |

---

## ⚙️ Environment Configuration

### Backend `.env`
Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

SESSION_SECRET=your_session_secret
ADMIN_ACCESS_TOKEN=your_admin_token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend `.env`
Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚦 Getting Started

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Run Development Servers

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend Application
```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:5173`.
