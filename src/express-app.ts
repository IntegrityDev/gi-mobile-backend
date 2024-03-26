import express, { Express } from "express";
import cors from "cors";
import { setupUserRoutes } from "./api";

export default async function configureApp(app: Express): Promise<void> {
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true, limit: "1mb" }));

    //app.use(cors(corsOptions));
    app.use(express.static(__dirname + "/public"));

    setupUserRoutes(app);
}