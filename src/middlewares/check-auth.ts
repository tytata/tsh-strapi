import jwt, { JwtPayload } from "jsonwebtoken";
import { Context, Next } from "koa";

const checkAuthMiddleware = async (ctx: Context, next: Next) => {
  // Lấy API key từ header
  const expectedApiKey = process.env.API_KEY;
  const apiKey = ctx.request.header["x-api-key"];

  // Kiểm tra API key
  if (!apiKey || apiKey !== expectedApiKey) {
    return ctx.unauthorized("Invalid or missing API key");
  }

  // Kiểm tra JWT token
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ctx.unauthorized("Thiếu token");
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || ctx.strapi.config.get("plugin.users-permissions.jwtSecret");

  if (!jwtSecret) {
    return ctx.internalServerError("Thiếu JWT_SECRET");
  }

  // Giải mã JWT để lấy thông tin người dùng
  let decoded: JwtPayload | undefined;
  try {
    decoded = jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (error) {
    return ctx.unauthorized("Token không hợp lệ");
  }

  if (!decoded || typeof decoded !== "object" || !decoded.phoneNumber) {
    return ctx.unauthorized("Token không hợp lệ");
  }

  // Lưu thông tin người dùng vào ctx để sử dụng trong controller
  ctx.state.user = decoded;

  // Tiến hành tiếp với controller
  await next(); // Phải trả về Promise
};

export default checkAuthMiddleware;
