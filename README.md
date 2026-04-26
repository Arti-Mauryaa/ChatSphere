# 💬 ChatSphere Chat Application

ChatSphere is a real-time chat application built using the MERN Stack (MongoDB, Express, React, Node.js) with Socket.io for instant messaging.

---

## 🚀 Features
- 🔐 User authentication (login/register)
- 💬 Real-time messaging using Socket.io
- 🟢 Online/offline user status
- 👤 User profiles & avatars
- ⚡ Fast and responsive UI
- 📱 Mobile responsive design

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- CSS / Styled Components

### Backend
- Node.js
- Express.js
- Socket.io

### Database
- MongoDB (Atlas / Local)

---

## 📁 Project Structure
code-sphere/
├── client/ # React frontend
├── server/ # Node/Express backend
├── images/ # Screenshots


---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/code-sphere.git
cd code-sphere
2. Install dependencies
Backend
cd server
npm install
Frontend
cd client
npm install

3. Setup Environment Variables

Create .env file inside server/ folder:

PORT=5000
MONGO_URL=your_mongodb_connection_string

👉 Example:

MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/chat4. Run the project

4. Run the project
Start Backend
cd server
npm start
Start Frontend
cd client
npm start

🌐 Deployment
Frontend → Vercel
Backend → Render / Railway
Database → MongoDB Atlas