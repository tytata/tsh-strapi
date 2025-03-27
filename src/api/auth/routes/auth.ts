import { jwtCheck } from "../../../middlewares/jwt-check";

export default {
  routes: [
    {
      method: "POST",
      path: "/auth/register",
      handler: "auth.register",
      config: { auth: false },
    },
    {
      method: "POST",
      path: "/auth/login",
      handler: "auth.login",
      config: { auth: false },
    },
    {
      method: "POST",
      path: "/auth/logout",
      handler: "auth.logout",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/protected",
      handler: "auth.protected",
      config: {
        middlewares: [jwtCheck],
      },
    },
    {
      method: "PUT",
      path: "/auth/update-profile",
      handler: "auth.updateProfile",
      config: {
        auth: false, // Nếu muốn bắt buộc đăng nhập thì đặt `auth: true`
      },
    },
    {
      method: "GET",
      path: "/auth/info",
      handler: "auth.getUserInfo",
      config: {
        auth: false, // Nếu yêu cầu xác thực, đổi thành `auth: true`
        policies: [],
      },
    },
  ],
};
