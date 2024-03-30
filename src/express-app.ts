import express, { Express } from "express";
import cors from "cors";
import { setupAuthRoutes, setupClientRoutes, setupEmployeeRoutes, setupProfileRoutes, setupUserRoutes, setupVisitRoutes } from "./api";

export default async function configureApp(app: Express): Promise<void> {
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true, limit: "1mb" }));

    app.use(cors());
    app.use(express.static(__dirname + "/public"));

    setupAuthRoutes(app);
    setupUserRoutes(app);
    setupProfileRoutes(app);
    setupClientRoutes(app);
    setupEmployeeRoutes(app);
    setupVisitRoutes(app);
}