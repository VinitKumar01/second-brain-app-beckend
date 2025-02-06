import { GoogleGenerativeAI }  from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export default async function gemini(message: string) {
    const prompt = message;
    const result = await model.generateContent(prompt);
    return result.response.text();
}