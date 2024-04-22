import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { PORT } from "./config";
import expressApp from "./express-app";

// dotenv.config();

// const app: Express = express();
// const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });

const StartServer = async (): Promise<void> => {
  const app = express();
  await expressApp(app);
  const port = process.env.PORT ? parseInt(process.env.PORT) : PORT;
  app
    .listen(port, () => {
      console.log(`listening to port ${port}`);
    })
    .on("error", (err: any) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
