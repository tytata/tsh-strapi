import { Context } from "koa";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
    async register(ctx: Context) {
        try {
            const { fullName, phoneNumber, password, address, provinceCity, country, email, dob } = ctx.request.body;

            if (!phoneNumber || !password) {
                return ctx.badRequest("Số điện thoại và mật khẩu là bắt buộc");
            }

            // Kiểm tra xem số điện thoại đã tồn tại chưa
            const existingUser = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { phoneNumber },
            });

            if (existingUser) {
                return ctx.badRequest("Số điện thoại đã được sử dụng");
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser = await strapi.entityService.create("plugin::users-permissions.user", {
                data: {
                    fullName,
                    phoneNumber,
                    password: hashedPassword,
                    address,
                    provinceCity,
                    country,
                    email,
                    dob,
                    username: phoneNumber,
                    confirmed: true,
                    provider: "local",
                },
            });

            return ctx.created({ message: "Đăng ký thành công", user: newUser });
        } catch (error) {
            return ctx.internalServerError("Lỗi đăng ký" + { error });
        }
    },

    async login(ctx: Context) {
        try {
            const { phoneNumber, password } = ctx.request.body;

            if (!phoneNumber || !password) {
                return ctx.badRequest("Số điện thoại và mật khẩu là bắt buộc");
            }

            // Kiểm tra user
            const user = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { phoneNumber },
            });

            if (!user) {
                return ctx.unauthorized("Số điện thoại không tồn tại");
            }

            // Kiểm tra mật khẩu
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return ctx.unauthorized("Mật khẩu không đúng");
            }

            // Tạo token JWT
            const token = jwt.sign(
                { id: user.id, phoneNumber: user.phoneNumber },
                process.env.JWT_SECRET || strapi.config.get("plugin.users-permissions.jwtSecret"),
                { expiresIn: "7d" }
            );

            return ctx.send({
                message: "Đăng nhập thành công",
                jwt: token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                },
            });
        } catch (error) {
            return ctx.internalServerError("Lỗi đăng nhập" + { error });
        }
    },

    async logout(ctx: Context) {
        return ctx.send({ message: "Đăng xuất thành công" });
    },
};
