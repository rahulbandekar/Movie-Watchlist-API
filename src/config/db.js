import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database via prisma successfully.");
    } catch (error) {
        console.error(`Error connecting to the database via prisma: ${error.message}`);
        process.exit(1); // Exit the process with an error code
    }
};

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("Disconnected from the database via prisma successfully.");
    } catch (error) {
        console.error(`Error disconnecting from the database via prisma: ${error.message}`);
    }
};

export { connectDB, disconnectDB, prisma };