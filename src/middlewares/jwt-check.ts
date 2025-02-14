// src/middlewares/jwt-check.ts

import jwt from "jsonwebtoken";

export const jwtCheck = async (ctx, next) => {
  const token = ctx.request.headers.authorization?.split(" ")[1];

  if (!token) {
    return ctx.unauthorized("Token không tồn tại");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || global.strapi.config.get("plugin.users-permissions.jwtSecret"));
    ctx.state.user = decoded;
    return next();
  } catch (error) {
    return ctx.unauthorized("Token không hợp lệ");
  }
};
