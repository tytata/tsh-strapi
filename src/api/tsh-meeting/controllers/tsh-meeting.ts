// ./src/api/tsh-meeting/controllers/tsh-meeting.ts
import { Context } from "koa";
import { factories } from "@strapi/strapi";
import checkApiKeyMiddleware from "../../../middlewares/check-api-key"; // Đường dẫn đến middleware

export default factories.createCoreController(
  "api::tsh-meeting.tsh-meeting",
  ({ strapi }) => ({
    async find(ctx: Context) {
      // Áp dụng middleware kiểm tra API key

      await checkApiKeyMiddleware(ctx, async () => { }); // ✅

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
    // create
    async create(ctx: Context) {
      console.log(`erssdât:1111 `);
      await checkApiKeyMiddleware(ctx, async () => { });
      console.log(`erssdât: `, JSON.stringify(ctx));
      try {
        const body = ctx.request.body;
        console.log(`erssdât: `, body);
        if (!body || typeof body !== "object") {
          return ctx.badRequest("Invalid request body");
        }

        const entity = await strapi
          .service("api::tsh-meeting.tsh-meeting")
          .create({
            data: {
              title: body.title,
              meeting_link: body.meeting_link,
              meeting_id: body.meeting_id,
              meeting_passcode: body.meeting_passcode,
              meeting_desc: body.meeting_desc,
              meditationtype: body.meditationtype,
              active: body.active,
              time_start: body.time_start,
              time_end: body.time_end,
              day: body.day,
            },
          });
        console.error("successful creating tsh-meeting:", { data: entity });
        return ctx.send({ data: entity }, 201);
      } catch (error) {
        console.error("Error creating tsh-meeting:", error);
        return ctx.internalServerError("Unable to create tsh-meeting");
      }
    }
  }),

);
