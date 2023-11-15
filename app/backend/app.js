import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import PrimistoreController from "./controllers/primistore/primistore-controller.js";
import {
  PRIMISTORE_DIR,
  createDirectoriesIfNotExistSync,
} from "./utils/path-utils.js";

const CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/primistore";
console.log("CONNECTION_STRING ", CONNECTION_STRING);
mongoose.connect(CONNECTION_STRING);

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    status: "Hello world",
  });
});

PrimistoreController(app);

app.listen(process.env.PORT || 4000, process.env.HOST || "127.0.0.1", () => {
  createDirectoriesIfNotExistSync(PRIMISTORE_DIR);
});
