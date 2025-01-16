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


import { factories } from '@strapi/strapi';

// Define the interface for the user data
interface AvatarFormats {
    small?: { url: string, ext: string, name: string, size: number, width: number, height: number };
    medium?: { url: string, ext: string, name: string, size: number, width: number, height: number };
    thumbnail?: { url: string, ext: string, name: string, size: number, width: number, height: number };
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
        name: string;
        alternativeText: string;
        caption: string;
        width: string;
        height: string;
        url: string;
        formats: AvatarFormats;
    };
}

export default factories.createCoreController('api::tsh-user.tsh-user', ({ strapi }) => ({
    // GET
    async find(ctx) {
        // Load API key from .env
        const expectedApiKey = process.env.API_KEY;

        // Get API key from request header
        const headers = ctx.request.header;
        const apiKey = headers['x-api-key'];

        // Validate the API key
        if (!apiKey || apiKey !== expectedApiKey) {
            return ctx.unauthorized('Invalid or missing API key');
        }
        // some logic here
        const { data, meta } = await super.find(ctx);
        // some more logic
        console.log('GET ALL');
        return { data, meta };
    },
    async findOne(ctx) {
        try {
            // Load API key from .env
            const expectedApiKey = process.env.API_KEY;

            // Get API key from request header
            const headers = ctx.request.header;
            const apiKey = headers['x-api-key'];

            // Validate the API key
            if (!apiKey || apiKey !== expectedApiKey) {
                return ctx.unauthorized('Invalid or missing API key');
            }
            // Optional: Log headers for debugging (avoid logging sensitive data in production)
            console.log('Request Headers:', headers);
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
            // const avatarFormats = sanitizedUser.avatar?.formats || {};
            // const avatar = {
            //     small: avatarFormats.small?.url || null,
            //     medium: avatarFormats.medium?.url || null,
            //     thumbnail: avatarFormats.thumbnail?.url || null,
            // };
            // Customize the response
            const avatar = sanitizedUser.avatar
                ? {
                    id: sanitizedUser.avatar.id,
                    documentId: sanitizedUser.avatar.documentId,
                    name: sanitizedUser.avatar.name,
                    alternativeText: sanitizedUser.avatar.alternativeText,
                    caption: sanitizedUser.avatar.caption,
                    width: sanitizedUser.avatar.width,
                    height: sanitizedUser.avatar.height,
                    url: sanitizedUser.avatar.url,
                    formats: sanitizedUser.avatar.formats || null,
                }
                : null;
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
                // metadata: {
                //     createdAt: sanitizedUser.createdAt,
                //     updatedAt: sanitizedUser.updatedAt,
                //     publishedAt: sanitizedUser.publishedAt,
                // },
            };
            console.log('get:::');
            return ctx.send({ status: 'success', data: customResponse });
        } catch (error) {
            console.error('Error in findOne controller:', error);
            ctx.throw(500, 'An error occurred while processing the request');
        }
    },

    // POST
    async create(ctx) {
        // Load API key from .env
        const expectedApiKey = process.env.API_KEY;

        // Get API key from request header
        const headers = ctx.request.header;
        const apiKey = headers['x-api-key'];

        // Validate the API key
        if (!apiKey || apiKey !== expectedApiKey) {
            return ctx.unauthorized('Invalid or missing API key');
        }
        // some logic here
        const response = await super.create(ctx);
        // some more logic
        console.log('create::::::');
        return response;
    },
    // PUT
    async update(ctx) {
        // Load API key from .env
        const expectedApiKey = process.env.API_KEY;

        // Get API key from request header
        const headers = ctx.request.header;
        const apiKey = headers['x-api-key'];

        // Validate the API key
        if (!apiKey || apiKey !== expectedApiKey) {
            return ctx.unauthorized('Invalid or missing API key');
        }
        // some logic here
        const response = await super.update(ctx);
        // some more logic
        console.log('UPDATE.....');
        return response;
    }
}));
