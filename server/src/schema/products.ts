import {z} from 'zod';

export const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    tags: z.array(z.string({ message: "Each tag must be a string" })),
    price: z
    .number({ message: "Price must be a number" })
    .positive("Price must be greater than 0")
    .max(999999.99, "Price exceeds maximum limit")
    // Ensures max 2 decimal places
    .multipleOf(0.01, "Price cannot have more than 2 decimal places")

}) 