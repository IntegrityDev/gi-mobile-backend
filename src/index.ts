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
  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err: any) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
