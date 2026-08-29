import express from "express";
import type {Express, Request, Response} from "express";
import {PORT, DATABASE_URL} from "./secrets.ts";
import rootRouter from "./routes/index.ts";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../generated/prisma/client.ts";
import { errorMiddleware } from "./middleware/error.ts";
import cors from 'cors';
import {Pool} from 'pg'

const app : Express = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'], // Next.js dev server URL
    credentials: true,                 // Allows cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use('/api', rootRouter);  

const adapter = new PrismaPg(new Pool ({ connectionString: DATABASE_URL }));
export const prismaClient = new PrismaClient({ adapter }).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true,
        },
      
        compute(address) {
          const parts = [
            address.lineOne,
            address.lineTwo,
            address.city,
            address.country,
            address.pincode,
          ].filter(Boolean); 

          return parts.join(', ');
        },
      },
    },
  },
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});   