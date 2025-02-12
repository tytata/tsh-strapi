module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/register",
      handler: "auth.register",
      config: {
        auth: false, // Không yêu cầu xác thực
      },
    },
    {
      method: "POST",
      path: "/auth/login",
      handler: "auth.login",
      config: {
        auth: false, // Không yêu cầu xác thực
      },
    },
    {
      method: "POST",
      path: "/auth/logout",
      handler: "auth.logout",
      config: {
        auth: false, // Không yêu cầu xác thực
      },
    },
  ],
};
