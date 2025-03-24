export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*', // Cho phép tất cả headers
      origin: ['http://localhost:3000'], // Hoặc '*' nếu muốn mở rộng cho tất cả
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true, // Nếu cần gửi cookie hoặc thông tin xác thực
      exposeHeaders: ['x-api-key'], // Cho phép header này từ response
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Cho phép sử dụng các headers này
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
