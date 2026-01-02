import cron from "cron";
import https from "https";

const job = new cron.CronJob(
    "*/14 * * * *", // Run every 14 minutes
    function () {
        https
            .get(process.env.API_URL, (res) => {
                if (res.statusCode === 200) console.log("GET request sent successfully");
                else console.log("GET request failed", res.statusCode);
            })
            .on("error", (e) => console.error("Error while sending request", e));
    },
    null, // onComplete
    false, // start (false = don't start immediately, will be started manually in server.js)
    "America/New_York" // timeZone
);

export default job;
