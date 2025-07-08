

import 'dotenv/config';
import app from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await initMongoConnection();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};


startServer();
