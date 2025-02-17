import express from "express";
import dotenv from "dotenv";
import { UserRouter } from "./routes/UserRouter";
import { ContentRouter } from "./routes/ContentRouter";
import { BrainRouter } from "./routes/BrainRouter";
import cors from "cors";
import { getEmbeddings } from "./utils/TextEmbeddings";

import { authMiddleware } from "./middleware/authMiddleware";
dotenv.config();

const PORT = process.env.PORT || 8787;

const app = express();

// app.use(cors({
//     origin: ['https://secondbrain-fe.vercel.app', 'http://localhost:5173']
// }))
app.use(cors());
app.use(express.json());
app.use("/v1/user", UserRouter);
app.use("/v1/content", ContentRouter);
app.use("/v1/brain", BrainRouter);

app.get("/", (req, res) => {
  // healthy
  res.status(200).json({
    message: "BigBrain backend - By Aman Verma",
  });
});
app.listen(PORT);
