const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  // Đăng ký
  async register(ctx) {
    const { fullName, phoneNumber, password, address, city, country, email, birthDate } = ctx.request.body;

    // Kiểm tra dữ liệu đầu vào
    if (!fullName || !phoneNumber || !password || !email) {
      return ctx.badRequest("Vui lòng nhập đầy đủ thông tin.");
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email }
    });

    if (existingUser) {
      return ctx.badRequest("Email đã tồn tại.");
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản mới
    const newUser = await strapi.db.query("plugin::users-permissions.user").create({
      data: {
        fullName,
        phoneNumber,
        password: hashedPassword,
        address,
        city,
        country,
        email,
        birthDate
      }
    });

    // Tạo JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || strapi.config.get("plugin.users-permissions.jwtSecret"),
      { expiresIn: "7d" }
    );

    // Trả về token và thông tin người dùng
    return ctx.send({
      jwt: token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        city: newUser.city,
        country: newUser.country,
        email: newUser.email,
        birthDate: newUser.birthDate,
      }
    });
  },

  // Đăng nhập
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest("Vui lòng nhập email hoặc số điện thoại và mật khẩu.");
    }

    // Tìm người dùng
    const user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { $or: [{ email: identifier }, { phoneNumber: identifier }] }
    });

    if (!user) {
      return ctx.unauthorized("Tài khoản không tồn tại.");
    }

    // So sánh mật khẩu
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return ctx.unauthorized("Mật khẩu không chính xác.");
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || strapi.config.get("plugin.users-permissions.jwtSecret"),
      { expiresIn: "7d" }
    );

    // Trả về token và thông tin người dùng
    return ctx.send({
      jwt: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        country: user.country,
        email: user.email,
        birthDate: user.birthDate,
      }
    });
  },

  // Đăng xuất (Xóa token trên UI)
  async logout(ctx) {
    // Chỉ cần xóa token ở phía client
    ctx.send({ message: "Đăng xuất thành công." });
  }
};
