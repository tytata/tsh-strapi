export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*', // Cho phép tất cả headers
      origin: ['http://localhost:3000','http://localhost:1337'], // Cho phép React gọi API
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true, // Nếu cần gửi cookie
      exposeHeaders: ['x-api-key'], // Cho phép header này từ response
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Cho phép dùng 'x-api-key'
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
