import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userrout from "./routes/userrout";
import friendsrrout from "./routes/friendsrrout";
import chatrrout from "./routes/chatrrout";




dotenv.config();

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Failed to connect!", err));



app.use("/user",userrout)
app.use("/friends",friendsrrout)
app.use("/chat",chatrrout)

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
