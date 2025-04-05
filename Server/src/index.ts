import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { app } from './app';
import verifyEnvVariables from './utills/checkURI';
import connectdb from "./db/index";

dotenv.config({ path: './env' });

const requiredEnvVars = ["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "PORT", "MONGODB_URL"];
verifyEnvVariables(requiredEnvVars);

const PORT = process.env.PORT || 8000;

// Kill any process using the port before starting the server
try {
    console.log(`Checking and killing process on port ${PORT}...`);
    execSync(`npx kill-port ${PORT}`);
    console.log(`Port ${PORT} is now free.`);
} catch (err) {
    console.log(`Failed to kill process on port ${PORT} or no process found.`);
}

connectdb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at port: ${PORT}`);
            app.on("error", (error) => {
                console.log("❌ Error:", error);
                throw error;
            });
        });
    })
    .catch((error) => {
        console.log("❌ MongoDB connection failed: " + error);
    });
