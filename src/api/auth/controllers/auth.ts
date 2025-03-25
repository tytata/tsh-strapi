import { Context } from "koa";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { Context } from "koa";
import argon2 from "argon2";

export default {
    async register(ctx: Context) {
        try {
            const { fullName, phoneNumber, password, address, provinceCity, country, email, dob } = ctx.request.body;

            if (!phoneNumber || !password) {
                return ctx.badRequest("Số điện thoại và mật khẩu là bắt buộc");
            }

            // Kiểm tra số điện thoại đã tồn tại chưa
            const existingUser = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { phoneNumber },
            });

            if (existingUser) {
                return ctx.badRequest("Số điện thoại đã được sử dụng");
            }

            // Mã hóa mật khẩu bằng argon2
            const hashedPassword = await argon2.hash(password);

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
            return ctx.internalServerError("Lỗi đăng ký: " + error.message);
        }
    },
    async login(ctx: Context) {
        try {
            const { phoneNumber, password } = ctx.request.body;

            if (!phoneNumber || !password) {
                return ctx.badRequest("Số điện thoại và mật khẩu là bắt buộc");
            }

            // Tìm người dùng theo số điện thoại
            const user = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { phoneNumber },
            });

            if (!user) {
                return ctx.unauthorized("Số điện thoại không tồn tại");
            }

            // Kiểm tra mật khẩu bằng argon2
            const passwordMatch = await argon2.verify(user.password, password);

            if (!passwordMatch) {
                return ctx.unauthorized("Mật khẩu không đúng");
            }
            //   Kiểm tra `JWT_SECRET`
            const jwtSecret = process.env.JWT_SECRET || strapi.config.get("plugin.users-permissions.jwtSecret");
            if (!jwtSecret) {
                return ctx.internalServerError("Thiếu JWT_SECRET");
            }

            // Tạo token JWT
            const token = jwt.sign(
                { id: user.id, phoneNumber: user.phoneNumber },
                jwtSecret,
                { expiresIn: "7d" }
            );
            // // Tạo token JWT
            // const token = strapi.plugins["users-permissions"].services.jwt.issue({
            //     id: user.id,
            //     phoneNumber: user.phoneNumber,
            // });

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
            console.error("Lỗi đăng nhập:", error);
            return ctx.internalServerError("Lỗi đăng nhập: " + error.message);
        }
    },

};

// export default {
//     async register(ctx: Context) {
//         try {
//             const { fullName, phoneNumber, password, address, provinceCity, country, email, dob } = ctx.request.body;

//             if (!phoneNumber || !password) {
//                 return ctx.badRequest("Số điện thoại và mật khẩu là bắt buộc");
//             }

//             // Kiểm tra xem số điện thoại đã tồn tại chưa
//             const existingUser = await strapi.db.query("plugin::users-permissions.user").findOne({
//                 where: { phoneNumber },
//             });

//             if (existingUser) {
//                 return ctx.badRequest("Số điện thoại đã được sử dụng");
//             }

//             // Mã hóa mật khẩu
//             const hashedPassword = await bcrypt.hash(password, 10);
//             console.log(`password: ${password}`);
//             console.log(`password hashed:${hashedPassword}`);
//             // Tạo người dùng mới
//             const newUser = await strapi.entityService.create("plugin::users-permissions.user", {
//                 data: {
//                     fullName,
//                     phoneNumber,
//                     password: hashedPassword,
//                     address,
//                     provinceCity,
//                     country,
//                     email,
//                     dob,
//                     username: phoneNumber,
//                     confirmed: true,
//                     provider: "local",
//                 },
//             });

//             return ctx.created({ message: "Đăng ký thành công", user: newUser });
//         } catch (error) {
//             return ctx.internalServerError("Lỗi đăng ký" + { error });
//         }
//     },

//     async login(ctx: Context) {
//         try {
//             const { phoneNumber, password } = ctx.request.body;

//             if (!phoneNumber || !password) {
//                 return ctx.badRequest("Số điện thoại và mật khẩu là bắt buộc");
//             }

//             // Kiểm tra user có tồn tại không
//             const user = await strapi.db.query("plugin::users-permissions.user").findOne({
//                 where: { phoneNumber },
//             });

//             if (!user) {
//                 return ctx.unauthorized("Số điện thoại không tồn tại");
//             }

//             // Kiểm tra mật khẩu
//             const passwordMatch = await bcrypt.compare(password, user.password);
//             console.log(`passwordMatch: ${passwordMatch}`);
//             console.log(`password input: ${password}\n password in db:${user.password}`);
//             // Mã hóa mật khẩu
//             // const hashedPassword = await bcrypt.hash(password, 10);
//             // console.log(`password hashed: ${hashedPassword}`);

//             if (!passwordMatch) {
//                 return ctx.unauthorized("Mật khẩu không đúng");
//             }

//             // Kiểm tra `JWT_SECRET`
//             const jwtSecret = process.env.JWT_SECRET || strapi.config.get("plugin.users-permissions.jwtSecret");
//             if (!jwtSecret) {
//                 return ctx.internalServerError("Thiếu JWT_SECRET");
//             }

//             // Tạo token JWT
//             const token = jwt.sign(
//                 { id: user.id, phoneNumber: user.phoneNumber },
//                 jwtSecret,
//                 { expiresIn: "7d" }
//             );

//             return ctx.send({
//                 message: "Đăng nhập thành công",
//                 jwt: token,
//                 user: {
//                     id: user.id,
//                     fullName: user.fullName,
//                     phoneNumber: user.phoneNumber,
//                     email: user.email,
//                 },
//             });
//         } catch (error) {
//             console.error("Lỗi đăng nhập:", error);
//             return ctx.internalServerError(`Lỗi đăng nhập: ${error.message}`);
//         }
//     },


//     async logout(ctx: Context) {
//         return ctx.send({ message: "Đăng xuất thành công" });
//     },
//     async protected(ctx: Context) {
//         return ctx.send({ message: "Dữ liệu bảo vệ đã được truy cập!", user: ctx.state.user });
//     },
// };
