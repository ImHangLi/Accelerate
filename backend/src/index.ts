import * as dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";

// 加载 .env 文件中的环境变量
dotenv.config();

const app = new Hono();

app.use(
  "*",
  cors({
    origin:
      process.env.HONO_CORS_ORIGIN ??
      (() => {
        throw new Error("HONO_CORS_ORIGIN is required");
      })(),
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("There is nothing here.");
});

app.get("/api", (c) => {
  return c.json({ message: "Welcome to Accelrate api!" });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
console.log(`Server is running on http://localhost:${port}`);

Bun.serve({
  port: port,
  fetch: app.fetch,
});

export default app;
