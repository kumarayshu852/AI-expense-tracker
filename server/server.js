require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { startCronJobs } = require('./services/cronService');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // DB connect hone ke baad cron job start karo
    startCronJobs();
  });
});