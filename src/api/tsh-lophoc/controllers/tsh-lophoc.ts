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
