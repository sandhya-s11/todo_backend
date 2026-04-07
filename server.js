const app = require('./api/index');

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in environment variables.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not set in environment variables.');
  process.exit(1);
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
