import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import userrout from "./routes/userrout";
import friendsrrout from "./routes/friendsrrout";
import chatrrout from "./routes/chatrrout";

// تحميل البيئة
dotenv.config();

const app = express();
const port = 5001;

// إنشاء سيرفر HTTP ليتم استخدامه مع WebSocket
const server = createServer(app);

// إعداد WebSocketServer على نفس السيرفر
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات MongoDB
mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Failed to connect!", err));

// تعريف المسارات
app.use("/user", userrout);
app.use("/friends", friendsrrout);
app.use("/chat", chatrrout);

// التعامل مع WebSocket
wss.on("connection", (ws: WebSocket) => {
  console.log("New WebSocket client connected!");

  // استقبال الرسائل من العميل عبر WebSocket
  ws.on("message", (data: string) => {
    try {
      const parsedData = JSON.parse(data);

      if (parsedData.type === "sendMessage") {
        console.log(`New message from ${parsedData.username}: ${parsedData.data}`);

        // إرسال الرسالة إلى جميع العملاء المتصلين
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "newMessage",
                message: {
                  msg: parsedData.data,
                  user: parsedData.username,
                  _id: new Date().getTime().toString(), // توليد _id مؤقت
                },
              })
            );
          }
        });
      }
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  });

  // عند إغلاق الاتصال
  ws.on("close", () => {
    console.log("A client disconnected.");
  });
});

// تشغيل السيرفر على المنفذ 5001
server.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
  console.log(`WebSocket server is running at: ws://localhost:${port}`);
});
