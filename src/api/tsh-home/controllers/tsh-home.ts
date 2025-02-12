/**
 * tsh-home controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::tsh-home.tsh-home');

import { factories } from '@strapi/strapi';
import { url } from 'inspector';

// Define the interface for the home data
interface imagesFormats {
    small?: { url: string, ext: string, name: string, size: number, width: number, height: number };
    medium?: { url: string, ext: string, name: string, size: number, width: number, height: number };
    thumbnail?: { url: string, ext: string, name: string, size: number, width: number, height: number };
}

interface TSHHome {
    id: string;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    images?: {
        id: number;
        documentId: string;
        name: string;
        alternativeText: string;
        caption: string;
        width: string;
        height: string;
        url: string;
        formats: imagesFormats;
    };
}
export default factories.createCoreController('api::tsh-home.tsh-home', ({ strapi }) => ({
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

            // Fetch the home by ID and include relationships
            const home = await strapi
                .service('api::tsh-home.tsh-home')
                .findOne(id, queryParams);

            if (!home) {
                return ctx.notFound('home not found');
            }

            // Sanitize the fetched data
            const sanitizedHome = (await this.sanitizeOutput(home, ctx)) as TSHHome;

            // Format the images
            const imagesFormats = sanitizedHome.images?.formats || {};
            const imagesFormat = {
                small: imagesFormats.small ? { url: imagesFormats.small.url, ext: imagesFormats.small.ext, name: imagesFormats.small?.name, size: imagesFormats.small.size, width: imagesFormats.small.width, height: imagesFormats.small.height } : null,
                medium: imagesFormats.medium ? { url: imagesFormats.medium.url, ext: imagesFormats.medium.ext, name: imagesFormats.medium?.name, size: imagesFormats.medium.size, width: imagesFormats.medium.width, height: imagesFormats.medium.height } : null,
                thumbnail: imagesFormats.thumbnail ? { url: imagesFormats.thumbnail.url, ext: imagesFormats.thumbnail.ext, name: imagesFormats.thumbnail?.name, size: imagesFormats.thumbnail.size, width: imagesFormats.thumbnail.width, height: imagesFormats.thumbnail.height } : null,
            };
            // console.log('get:::' + JSON.stringify(sanitizedHome.images?.formats));
            // Customize the response
            const images = sanitizedHome.images
                ? {
                    id: sanitizedHome.images.id,
                    documentId: sanitizedHome.images.documentId,
                    name: sanitizedHome.images.name,
                    alternativeText: sanitizedHome.images.alternativeText,
                    caption: sanitizedHome.images.caption,
                    width: sanitizedHome.images.width,
                    height: sanitizedHome.images.height,
                    url: sanitizedHome.images.url,
                    formats: imagesFormat || null,
                }
                : null;
            // Customize the response
            const customResponse = {
                id: sanitizedHome.id,
                documentId: sanitizedHome.documentId,
                images,
                // metadata: {
                //     createdAt: sanitizedhome.createdAt,
                //     updatedAt: sanitizedhome.updatedAt,
                //     publishedAt: sanitizedhome.publishedAt,
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
