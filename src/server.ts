import 'dotenv/config';
import app from './app.js';
import { initDB, pool } from './config/db.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
    console.error('Invalid PORT environment variable');
    process.exit(1);
}

try {
    await pool.connect();
    console.log('✅ PostgreSQL connected');

    await initDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
catch (err) {
    console.log(err);
    process.exit(1);
}