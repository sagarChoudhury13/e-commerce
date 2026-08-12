import {z} from "zod";

export const signUpSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(5)
})


export const addressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    city: z.string(),
    pincode: z.string().length(6),
    country: z.string(),
})

export const updateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddress: z.number().optional(),
    defaultBillingAddress: z.number().optional()
})

export const changeRoleSchema = z.object({
    role : z.string()
})