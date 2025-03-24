export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: '*', // Chấp nhận tất cả domain
      headers: '*', // Cho phép tất cả headers
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true, // Hỗ trợ gửi cookie & xác thực
      exposeHeaders: ['x-api-key'], // Header có thể đọc từ response
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Headers cho phép từ request
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
