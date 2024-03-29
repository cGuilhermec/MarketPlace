import express, { json } from "express";
import dotenv from 'dotenv';
import { router } from "./router";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use(router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});