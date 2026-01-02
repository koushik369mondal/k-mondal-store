import cron from "cron";
import https from "https";

const job = new cron.CronJob(
    "*/14 * * * *", // Run every 14 minutes
    function () {
        const apiUrl = process.env.API_URL;

        // Validate URL exists and is not empty
        if (!apiUrl || apiUrl.trim() === '') {
            console.error('[Cron] ERROR: API_URL environment variable is not set or empty. Skipping keep-alive ping.');
            return;
        }

        // Validate URL format
        try {
            new URL(apiUrl);
        } catch (error) {
            console.error('[Cron] ERROR: API_URL is not a valid URL:', apiUrl);
            return;
        }

        console.log(`[Cron] Sending keep-alive ping to: ${apiUrl}`);

        https
            .get(apiUrl, (res) => {
                if (res.statusCode === 200) {
                    console.log("[Cron] Keep-alive ping successful");
                } else {
                    console.log(`[Cron] Keep-alive ping failed with status: ${res.statusCode}`);
                }
            })
            .on("error", (e) => {
                console.error("[Cron] Error while sending keep-alive request:", e.message);
            });
    },
    null, // onComplete
    false, // start (false = don't start immediately, will be started manually in server.js)
    "America/New_York" // timeZone
);

export default job;
