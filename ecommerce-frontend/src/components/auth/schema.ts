import {z} from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5,"Password must be at least 5 characters")
})

export const SignUpSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(5)
})