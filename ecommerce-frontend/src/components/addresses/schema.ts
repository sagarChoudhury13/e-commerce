import {z} from "zod";

export const addressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    city: z.string(),
    pincode: z.string().length(6),
    country: z.string(),
})