import { Hono } from "hono";
import { cors } from "hono/cors";

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

export default app;
