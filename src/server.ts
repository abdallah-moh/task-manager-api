import 'dotenv/config';
import app from './app.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
    console.error('Invalid PORT environment variable');
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});