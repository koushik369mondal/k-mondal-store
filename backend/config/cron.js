import cron from 'cron';
import https from 'https';

// /**
//  * Cron job to keep the server awake by pinging the API URL
//  * Runs every 14 minutes
//  * Cron schedule: */14 * * * * (every 14 minutes)
//  */
const keepAliveJob = new cron.CronJob(
    '*/14 * * * *', // Every 14 minutes
    async function () {
        const apiUrl = process.env.API_URL;

        if (!apiUrl) {
            console.error('[Cron] API_URL environment variable is not set');
            return;
        }

        console.log(`[Cron] Sending keep-alive request to ${apiUrl}`);

        https.get(apiUrl, (res) => {
            if (res.statusCode === 200) {
                console.log(`[Cron] ✓ Keep-alive request successful - Status: ${res.statusCode}`);
            } else {
                console.error(`[Cron] ✗ Keep-alive request failed - Status: ${res.statusCode}`);
            }

            // Consume response data to free up memory
            res.on('data', () => { });
            res.on('end', () => { });
        }).on('error', (err) => {
            console.error('[Cron] ✗ Keep-alive request error:', err.message);
        });
    },
    null, // onComplete callback (not used)
    false, // start automatically (we'll start it manually)
    'UTC' // timezone
);

export default keepAliveJob;
