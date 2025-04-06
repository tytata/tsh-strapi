// /**
//  * tsh-meeting controller
//  */

// // import { factories } from '@strapi/strapi'
// import { factories } from '@strapi/strapi'

// // export default factories.createCoreController('api::tsh-meeting.tsh-meeting');
// export default factories.createCoreController('api::tsh-meeting.tsh-meeting', ({ strapi }) => ({
//     // GET
//     async find(ctx) {
//         // Load API key from .env
//         const expectedApiKey = process.env.API_KEY;

//         // Get API key from request header
//         const headers = ctx.request.header;
//         const apiKey = headers['x-api-key'];

//         // Validate the API key
//         if (!apiKey || apiKey !== expectedApiKey) {
//             return ctx.unauthorized('Invalid or missing API key');
//         }

//         // Lấy tham số `active` từ query string (vd: ?active=true)
//         const { active, meditationtype } = ctx.query;
//         if (active !== undefined) {
//             if (!ctx.query.filters || typeof ctx.query.filters !== "object") {
//                 ctx.query.filters = {};
//             }
//             (ctx.query.filters as { active?: boolean }).active = active === "true";
//         }
//         // Thêm điều kiện `meditationty = 2`
//         if (ctx.query.filters && typeof meditationtype === 'string') {
//             (ctx.query.filters as { meditationtype?: string }).meditationtype = meditationtype;
//             console.log(`ctx.query.filters:: ${JSON.stringify(ctx.query.filters)}`);
//         }

//         // Gọi API của Strapi để lấy dữ liệu
//         const { data } = await super.find(ctx);

//         console.log("GET ALL (active:", active, ", meditationtype:", meditationtype, ")");

//         // return last item
//         return data[data.length - 1];
//     }

// }));
// import { Context } from "koa";
// import { factories } from "@strapi/strapi";
// import checkAuthMiddleware from "../../../middlewares/check-auth"; // Đảm bảo đường dẫn đúng

// export default factories.createCoreController(
//   "api::tsh-meeting.tsh-meeting",
//   ({ strapi }) => ({
//     async find(ctx: Context) {
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
//         (ctx.query.filters as { meditationtype?: string }).meditationtype =
//           meditationtype;
//       }

//       const { data } = await super.find(ctx);

//       return data[data.length - 1]; // Trả về item cuối cùng
//     },
//   }),
// );

// ./src/api/tsh-meeting/controllers/tsh-meeting.ts
import { Context } from "koa";
import { factories } from "@strapi/strapi";
import checkApiKeyMiddleware from "../../../middlewares/check-api-key"; // Đường dẫn đến middleware

export default factories.createCoreController(
  "api::tsh-meeting.tsh-meeting",
  ({ strapi }) => ({
    async find(ctx :Context ) {
      // Áp dụng middleware kiểm tra API key

      await checkApiKeyMiddleware(ctx, async () => {}); // ✅

      // Logic tìm kiếm dữ liệu
      const { active, meditationtype } = ctx.query;
      console.log(`erssd:-- `, active, meditationtype);
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
      console.log(`erssdât: `, data);
      
      console.log(`erssdât: `, data[data.length - 1]);
      return data[data.length - 1]; // Trả về item cuối cùng
    },
  }),
);
