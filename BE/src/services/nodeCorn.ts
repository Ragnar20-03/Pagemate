import cron from "node-cron";
import { Club } from "../db/schema";


// Runs every hour to check expired clubs
cron.schedule("0 * * * *", async () => {
    console.log("Checking for expired clubs...");

    const result = await Club.updateMany(
        { validTill: { $lt: new Date() }, isOpen: true }, // Find clubs where validTill < now & isOpen is true
        { $set: { isOpen: false } } // Close them
    );

    console.log(`${result.modifiedCount} clubs closed.`);
});
