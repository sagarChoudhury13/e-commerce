import {z}from 'zod';

export const ProductSchema = z.object({
    id : z.string(),
    name : z.string(),
    image_url: z.string().optional(),
    description: z.string(),
    price: z.number(),
    tags : z.array || z.string()
})

