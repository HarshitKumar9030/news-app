/** @type {import('next').NextConfig} */
const nextConfig = {
};

// const setupCronJob = async () => {
//   try {
//     const { fetchAndStoreNews } = await import('./src/utils/fetchNews');
//     const cron = (await import('node-cron')).default;
    
//     // Schedule the cron job to run every 6 hours
//     cron.schedule('0 */6 * * *', () => {
//       console.log('Fetching news...');
//       fetchAndStoreNews();
//     });
//   } catch (error) {
//     console.error('Failed to setup cron job:', error);
//   }
// };

// // Setup the cron job
// setupCronJob();

export default nextConfig;