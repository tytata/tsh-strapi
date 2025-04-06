// /**
//  * tsh-lophoc controller
//  */

// import bcrypt from "bcryptjs";
// import { Context } from "koa";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { factories } from "@strapi/strapi";

// // export default factories.createCoreController('api::tsh-lophoc.tsh-lophoc');
// export default factories.createCoreController(
//   "api::tsh-lophoc.tsh-lophoc",
//   ({ strapi }) => ({
//     // GET
//     async find(ctx: Context) {
//       // Load API key from .env
//       const expectedApiKey = process.env.API_KEY;

//       const authHeader = ctx.headers.authorization;
//       if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return ctx.unauthorized("Thiếu token");
//       }
//       const token = authHeader.split(" ")[1];
//       const jwtSecret =
//         process.env.JWT_SECRET ||
//         strapi.config.get("plugin.users-permissions.jwtSecret");
//       if (!jwtSecret) {
//         return ctx.internalServerError("Thiếu JWT_SECRET");
//       }
//       // Giải mã JWT để lấy số điện thoại của user
//       const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
//       if (!decoded || typeof decoded !== "object" || !decoded.phoneNumber) {
//         return ctx.unauthorized("Token không hợp lệ");
//       }

//       console.log("Decoded JWT:", decoded);
//       const phoneNumber = decoded.phoneNumber as string;
//       // console.log("Decoded JWT phoneNumber:", decoded.phoneNumber);

//       if (!phoneNumber) {
//         return ctx.unauthorized(
//           "Bạn cần đăng nhập để thực hiện hành động này.",
//         );
//       }

//       // Get API key from request header
//       const headers = ctx.request.header;
//       const apiKey = headers["x-api-key"];

//       // Validate the API key
//       if (!apiKey || apiKey !== expectedApiKey) {
//         return ctx.unauthorized("Invalid or missing API key");
//       }

//       // Lấy tham số `active` từ query string (vd: ?active=true)
//       const { active, meditationtype } = ctx.query;
//       if (active !== undefined) {
//         if (!ctx.query.filters || typeof ctx.query.filters !== "object") {
//           ctx.query.filters = {};
//         }
//         (ctx.query.filters as { active?: boolean }).active = active === "true";
//       }

//       if (ctx.query.filters && typeof meditationtype === "string") {
//         (ctx.query.filters as { meditationtype?: string }).meditationtype =
//           meditationtype;
//         console.log(`ctx.query.filters ${JSON.stringify(ctx.query.filters)}`);
//       }

//       // Gọi API của Strapi để lấy dữ liệu
//       const { data } = await super.find(ctx);

//       console.log(
//         "GET ALL (active:",
//         active,
//         ", meditationtype:",
//         meditationtype,
//         ")",
//       );

//       // return last item
//       return data[data.length - 1];
//     },
//   }),
// );

// ./src/api/tsh-lophoc/controllers/tsh-lophoc.ts

// import { factories } from "@strapi/strapi";

// export default factories.createCoreController(
//   "api::tsh-lophoc.tsh-lophoc",
//   ({ strapi }) => ({
//     async find(ctx) {
//       // Dữ liệu người dùng đã được thêm vào ctx.state.user bởi middleware
//       const user = ctx.state.user; // Thông tin người dùng từ JWT

//       // Lấy các tham số từ query string
//       const { active, meditationtype } = ctx.query;
//       if (active !== undefined) {
//         if (!ctx.query.filters || typeof ctx.query.filters !== "object") {
//           ctx.query.filters = {};
//         }
//         (ctx.query.filters as { active?: boolean }).active = active === "true";
//       }

//       if (ctx.query.filters && typeof meditationtype === "string") {
//         (ctx.query.filters as { meditationtype?: string }).meditationtype =
//           meditationtype;
//       }

//       // Gọi API Strapi để lấy dữ liệu
//       const { data } = await super.find(ctx);

//       // Trả về dữ liệu cuối cùng
//       return data[data.length - 1];
//     },
//   }),
// );

// ./src/api/tsh-lophoc/controllers/tsh-lophoc.ts

// import { factories } from "@strapi/strapi";
// import checkApiKeyMiddleware from "../../../middlewares/check-auth"; // Đường dẫn đến middleware

// export default factories.createCoreController(
//   "api::tsh-lophoc.tsh-lophoc",
//   ({ strapi }) => ({
//     async find(ctx) {
//       // Áp dụng middleware kiểm tra API key
//       await checkApiKeyMiddleware(ctx, () => {});

//       // Logic tìm kiếm dữ liệu
//       const { active, meditationtype } = ctx.query;
//       if (active !== undefined) {
//         if (!ctx.query.filters || typeof ctx.query.filters !== "object") {
//           ctx.query.filters = {};
//         }
//         (ctx.query.filters as { active?: boolean }).active = active === "true";
//       }

//       if (ctx.query.filters && typeof meditationtype === "string") {
//         (ctx.query.filters as { meditationtype?: string }).meditationtype = meditationtype;
//       }

//       const { data } = await super.find(ctx);

//       return data[data.length - 1]; // Trả về item cuối cùng
//     },
//   })
// );

// ./src/api/tsh-lophoc/controllers/tsh-lophoc.ts
// import { Context } from "koa";
// import { factories } from "@strapi/strapi";
// import checkAuthMiddleware from "../../../middlewares/check-auth"; // Đảm bảo đường dẫn đúng

// export default factories.createCoreController(
//   "api::tsh-lophoc.tsh-lophoc",
//   ({ strapi }) => ({
//     async find(ctx) {
//       // Áp dụng middleware kiểm tra API key và JWT token
//       await checkAuthMiddleware(ctx, async () => {}); // Cần gọi next() đúng cách

//       // Logic tìm kiếm dữ liệu
//       const { active, meditationtype } = ctx.query;
//       if (active !== undefined) {
//         if (!ctx.query.filters || typeof ctx.query.filters !== "object") {
//           ctx.query.filters = {};
//         }
//         (ctx.query.filters as { active?: boolean }).active = active === "true";
//       }

//       if (ctx.query.filters && typeof meditationtype === "string") {
//         (ctx.query.filters as { meditationtype?: string }).meditationtype = meditationtype;
//       }

//       const { data } = await super.find(ctx);

//       return data[data.length - 1]; // Trả về item cuối cùng
//     },
//   })
// );

// ./src/api/tsh-lophoc/controllers/tsh-lophoc.ts

import { factories } from "@strapi/strapi";
import checkApiKeyMiddleware from "../../../middlewares/check-api-key"; // Đường dẫn đến middleware

export default factories.createCoreController(
  "api::tsh-lophoc.tsh-lophoc",
  ({ strapi }) => ({
    async find(ctx) {
      // Áp dụng middleware kiểm tra API key
      await checkApiKeyMiddleware(ctx, async () => {}); // ✅

      // Logic tìm kiếm dữ liệu
      const { active, meditationtype } = ctx.query;
      if (active !== undefined) {
        if (!ctx.query.filters || typeof ctx.query.filters !== "object") {
          ctx.query.filters = {};
        }
        (ctx.query.filters as { active?: boolean }).active = active === "true";
      }

      if (ctx.query.filters && typeof meditationtype === "string") {
        (ctx.query.filters as { meditationtype?: string }).meditationtype =
          meditationtype;
      }

      const { data } = await super.find(ctx);

      return data[data.length - 1]; // Trả về item cuối cùng
    },
  }),
);
