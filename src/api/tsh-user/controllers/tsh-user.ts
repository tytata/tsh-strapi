// /**
//  * tsh-user controller
//  */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::tsh-user.tsh-user');

// export default {
//     async index(ctx, next) { // called by GET /hello
//       ctx.body = 'Hello World!'; // we could also send a JSON
//     },
//   };


// import { factories } from '@strapi/strapi';

// export default factories.createCoreController('api::tsh-user.tsh-user', ({ strapi }) =>  ({
//   async find(ctx) {
//     const sanitizedQueryParams = await this.sanitizeQuery(ctx);
//     const { results, pagination } = await strapi.service('api::tsh-user.tsh-user').find(sanitizedQueryParams);
//     const sanitizedResults = await this.sanitizeOutput(results, ctx);
//      // Convert the sanitized results to JSON format
//      const jsonResults = JSON.parse(JSON.stringify(sanitizedQueryParams));

// console.log('jsonResults: '+jsonResults);
// console.log('result:'+sanitizedResults);
//     return this.transformResponse(sanitizedResults, { pagination });
    
//   }
// }));

// import { factories } from '@strapi/strapi';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   additionalInfo?: string;
// }

// export default factories.createCoreController('api::tsh-user.tsh-user', ({ strapi }) => ({
//   async find(ctx) {
//     try {
//       // Sanitize query parameters
//       const sanitizedQueryParams = await this.sanitizeQuery(ctx);

//       // Fetch data from the service
//       const { results, pagination } = await strapi
//         .service('api::tsh-user.tsh-user')
//         .find(sanitizedQueryParams);

//       // Type assertion to explicitly define sanitizedResults as an array of User objects
//       const sanitizedResults = (await this.sanitizeOutput(results, ctx)) as User[];

//       // Customize the response data
//       const customResults = sanitizedResults.map((user) => ({
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         customField: `Welcome, ${user.name}!`,
//         additionalInfo: user.additionalInfo || 'No additional info provided',
//       }));

//       // Build the custom response structure
//       const customResponse = {
//         status: 'success',
//         message: 'Users fetched successfully',
//         data: customResults,
//         meta: {
//           pagination: {
//             total: pagination.total,
//             page: pagination.page,
//             pageSize: pagination.pageSize,
//           },
//         },
//       };

//       // Return the custom response
//       return ctx.send(customResponse);
//     } catch (error) {
//       // Log errors and return a 500 status code
//       console.error('Error in custom response:', error);
//       ctx.throw(500, 'An error occurred while processing your request.');
//     }
//   },
// }));

// import { factories } from '@strapi/strapi';

// export default factories.createCoreController('api::tsh-user.tsh-user', ({ strapi }) => ({
//   async findOne(ctx) {
//     try {
//       const { id } = ctx.params; // Extract the user ID from the request
//       const queryParams = ctx.query; // Extract query parameters (e.g., `populate=*`)

//       // Fetch the user by ID, including all relations as specified in the query
//       const user = await strapi.service('api::tsh-user.tsh-user').findOne(id, queryParams);

//       if (!user) {
//         return ctx.notFound('User not found');
//       }

//       // Sanitize the user data
//       const sanitizedUser = await this.sanitizeOutput(user, ctx);

//       // Customize the response if needed
//       const customResponse = {
//         status: 'success',
//         message: `Fetched user with ID ${id} successfully`,
//         data: sanitizedUser,
//       };

//       return ctx.send(customResponse);
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       ctx.throw(500, 'An error occurred while fetching the user');
//     }
//   },
// }));


import { factories } from '@strapi/strapi';

// Define the interface for the user data
interface AvatarFormats {
  small?: { url: string };
  medium?: { url: string };
  thumbnail?: { url: string };
}

interface TSHUser {
  id: string;
  documentId: string;
  fullname: string;
  phone: string;
  address: string;
  email: string;
  birthday: string;
  UID: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  avatar?: {
    id: number;
    documentId: string;
    formats: AvatarFormats;
  };
}

export default factories.createCoreController('api::tsh-user.tsh-user', ({ strapi }) => ({
  async findOne(ctx) {
    try {
      const { id } = ctx.params; // Extract ID from the request parameters
      const queryParams = ctx.query; // Extract query parameters (e.g., populate)

      // Fetch the user by ID and include relationships
      const user = await strapi
        .service('api::tsh-user.tsh-user')
        .findOne(id, queryParams);

      if (!user) {
        return ctx.notFound('User not found');
      }

      // Sanitize the fetched data
      const sanitizedUser = (await this.sanitizeOutput(user, ctx)) as TSHUser;

      // Format the avatar
      const avatarFormats = sanitizedUser.avatar?.formats || {};
      const avatar = {
        small: avatarFormats.small?.url || null,
        medium: avatarFormats.medium?.url || null,
        thumbnail: avatarFormats.thumbnail?.url || null,
      };

      // Customize the response
      const customResponse = {
        id: sanitizedUser.id,
        documentId: sanitizedUser.documentId,
        fullname: sanitizedUser.fullname,
        phone: sanitizedUser.phone,
        address: sanitizedUser.address,
        email: sanitizedUser.email,
        birthday: sanitizedUser.birthday,
        UID: sanitizedUser.UID,
        city: sanitizedUser.city,
        country: sanitizedUser.country,
        avatar,
        metadata: {
          createdAt: sanitizedUser.createdAt,
          updatedAt: sanitizedUser.updatedAt,
          publishedAt: sanitizedUser.publishedAt,
        },
      };

      return ctx.send({ status: 'success', data: customResponse });
    } catch (error) {
      console.error('Error in findOne controller:', error);
      ctx.throw(500, 'An error occurred while processing the request');
    }
  },
}));
