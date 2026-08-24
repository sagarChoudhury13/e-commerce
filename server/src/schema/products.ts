import {z} from 'zod';

export const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    tags: z.union([z.string(), z.array(z.string())]),
    price: z.coerce.number().positive(),

}) 