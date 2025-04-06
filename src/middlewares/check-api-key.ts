// ./src/middlewares/check-api-key.ts

import { Context, Next } from "koa";

const checkApiKeyMiddleware = async (ctx: Context, next: Next) => {
  const expectedApiKey = process.env.API_KEY;

  const apiKey = ctx.request.header["x-api-key"];
console.log(`sadf`);
  if (!apiKey || apiKey !== expectedApiKey) {
    return ctx.unauthorized("Invalid or missing API key");
  }
  console.log(`sadf---`);
  // Tiến hành tiếp với controller
  await next();
};

export default checkApiKeyMiddleware;
