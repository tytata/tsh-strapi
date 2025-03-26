import { Context } from "koa";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export default {
    async register(ctx) {
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
            const hashedPhoneNumber = await bcrypt.hash(phoneNumber, 10);
            console.log(`password: ${password}`);
            console.log(`password hashed:${hashedPassword}`);
            console.log(`PhoneNumber hashed:${hashedPhoneNumber}`);
            // Tạo người dùng mới
            const newUser = await strapi.entityService.create("plugin::users-permissions.user", {
                data: {
                    fullName,
                    phoneNumber,
                    password: hashedPassword,
                    password_restore: hashedPhoneNumber,
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

    async login(ctx) {
        try {
            const { phoneNumber, password } = ctx.request.body;

            if (!phoneNumber || !password) {
                return ctx.badRequest("Số điện thoại và mật khẩu là bắt buộc");
            }

            // Kiểm tra user có tồn tại không
            const user = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { phoneNumber },
            });

            if (!user) {
                return ctx.unauthorized("Số điện thoại không tồn tại");
            }

            // Kiểm tra mật khẩu
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log(`passwordMatch: ${passwordMatch}`);
            console.log(`password input: ${password}\n password in db:${user.password}`);
            // Mã hóa mật khẩu
            // const hashedPassword = await bcrypt.hash(password, 10);
            // console.log(`password hashed: ${hashedPassword}`);

            if (!passwordMatch) {
                return ctx.unauthorized("Mật khẩu không đúng");
            }

            // Kiểm tra `JWT_SECRET`
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
            return ctx.internalServerError(`Lỗi đăng nhập: ${error.message}`);
        }
    },


    async logout(ctx: Context) {
        return ctx.send({ message: "Đăng xuất thành công" });
    },
    async protected(ctx: Context) {
        return ctx.send({ message: "Dữ liệu bảo vệ đã được truy cập!", user: ctx.state.user });
    },
    
    async updateProfile(ctx:Context) {
        try {
            const phoneNumber = ctx.state.user?.phoneNumber; // Lấy phoneNumber từ token JWT
            console.log(`Lấy phoneNumber từ token JWT: ${ctx.state.user?.phoneNumber}`);
            if (!phoneNumber) {
                return ctx.unauthorized("Bạn cần đăng nhập để thực hiện hành động này.");
            }
    
            const { fullName, email, address, provinceCity, country, password, newPassword } = ctx.request.body;
    
            // Lấy thông tin user từ database
            const user = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { phoneNumber }
            });
    
            if (!user) {
                return ctx.notFound("User không tồn tại");
            }
    
            // Nếu có `newPassword`, kiểm tra mật khẩu cũ
            if (newPassword) {
                if (!password) {
                    return ctx.badRequest("Cần nhập mật khẩu hiện tại để thay đổi mật khẩu");
                }
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return ctx.unauthorized("Mật khẩu hiện tại không đúng");
                }
            }
    
            // Nếu đổi mật khẩu thì hash mật khẩu mới
            const updatedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : user.password;
    
            // Cập nhật thông tin user (KHÔNG thay đổi `password_restore`)
            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", phoneNumber, {
                data: {
                    fullName: fullName || user.fullName,
                    email: email || user.email,
                    address: address || user.address,
                    provinceCity: provinceCity || user.provinceCity,
                    country: country || user.country,
                    password: updatedPassword, // Chỉ thay đổi nếu có `newPassword`
                },
            });
    
            return ctx.send({
                message: "Cập nhật thông tin thành công",
                user: {
                    id: updatedUser.id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    address: updatedUser.address,
                    provinceCity: updatedUser.provinceCity,
                    country: updatedUser.country,
                    phoneNumber: updatedUser.phoneNumber,
                },
            });
        } catch (error) {
            console.error("Lỗi cập nhật thông tin:", error);
            return ctx.internalServerError(`Lỗi cập nhật thông tin: ${error.message}`);
        }
    }
    
};
