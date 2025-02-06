import express from "express";
import { contentRouter, deleteContentRouter, signinRouter, signupRouter, contentPostRouter, shareLinkRouter, sharedLinkRouter, aiRouter } from "./routes/routes.js";
import mongoose from "mongoose";
import cors from "cors"
import * as dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT


app.use("/api/v1", signupRouter);

app.use("/api/v1", signinRouter);

app.use("/api/v1", contentRouter);

app.use("/api/v1", deleteContentRouter);

app.use("/api/v1", contentPostRouter);

app.use("/api/v1", shareLinkRouter);

app.use("/api/v1", sharedLinkRouter);

app.use("/api/v1", aiRouter);

app.listen(port, async ()=> {
    await mongoose.connect(process.env.MONGODB_KEY as string)
    console.log(`Listening to port ${port}`)
})