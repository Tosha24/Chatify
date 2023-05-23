import { PrismaClient } from '@prisma/client'

declare global{
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()         // If the 'globalThis.prisma' is equal to undefined, then the new PrismaClient() is assigned to client variable

if(process.env.NODE_ENV !== 'production') globalThis.prisma = client    // In a development environment, the prisma instance is stored in the globalThis.prisma variable. This ensures that there is a single instance of PrismaClient throughout the application, preventing multiple connections to the database.

export default client