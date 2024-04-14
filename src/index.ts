import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { kross } from "./kross";
import { createWaGroup, initializeWa } from "./wa";
const { MongoStore } = require("wwebjs-mongo");

dotenv.config();
mongoose.set("strictQuery", false);

const corsOptions: cors.CorsOptions = {
  origin: process.env.WEB_APP_URL,
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

let store: any = undefined;
// const intervalIdList: NodeJS.Timeout[] = [];
const mongodbUri = process.env.MONGODB_URI;
let mongooseClient: typeof mongoose = undefined;

app.get("/sse-wa", (req, res) => {
  let intervalId: NodeJS.Timeout;

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const mongoDBConnectionStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized",
  };

  console.log(
    "mongodb connection state -> ",
    mongoDBConnectionStatus[mongoose.connection.readyState]
  );
  console.log("mongoose client exist? -> ", Boolean(mongooseClient));
  console.log("store client exist? -> ", Boolean(store));

  if (
    mongoose.connection.readyState === 1 &&
    Boolean(mongooseClient) &&
    Boolean(store)
  ) {
    initializeWa(store, res);
  } else if (mongoose.connection.readyState === 99) {
    // re-init the flow
  } else {
    intervalId = setInterval(() => {
      console.log("trying to initialize WhatsApp Client");
      if (mongoose.connection.readyState === 1 && mongooseClient && store) {
        clearInterval(intervalId);
        initializeWa(store, res);
      }
    }, 1000);
  }

  req.on("close", () => {
    clearInterval(intervalId);
    res.end("OK");
  });
});

app.get("/sse-kross", async (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  try {
    const dayToCheck = req.query.date;
    const userList = await kross(dayToCheck as string);

    res.write(`data: ${JSON.stringify(userList)}\n\n`);
  } catch (error) {
    console.log("error", error);
    res.status(500).json(error);
  }

  req.on("close", () => res.end("OK"));
});

app.post("/create-wa-group", createWaGroup);

app.listen(process.env.PORT, () => {
  return console.log(`Express is listening on ${process.env.PORT}`);
});

main().catch((err) => console.log("[mongoose] error", err));
async function main() {
  mongooseClient = await mongoose.connect(mongodbUri);
  console.log("mongodb connected");
  store = new MongoStore({ mongoose: mongooseClient });
}

process.on("SIGINT", () => {
  mongoose.connection.close().then(() => {
    console.log("Mongoose connection closed through app termination");
    process.exit(0);
  });
});
