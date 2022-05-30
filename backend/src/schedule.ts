import { schedule } from "node-cron";
import logger from "jet-logger";
import { DataQueue } from "@models/data_queue-model";
import { Data } from "@models/data-model";

export function init(): void {
    // Parse queue each 10 seconds
    schedule("*/10 * * * * *", () => { parseQueue() });
}

async function parseQueue() {
    logger.info("Started processing data queue...");
    const dataQueue = await DataQueue.findAll({
        order: [["priority", "DESC"]],
        limit: 15
    });
    if (!dataQueue.length) {
        logger.info("Nothing to process.");
        return;
    }
    logger.info(`Processing ${dataQueue.length} messages.`);
    const now = new Date();
    for (const dq of dataQueue) {
        const messageParts = dq.message.split(" ");
        const value = messageParts.shift() || "";
        await Data.create({
            value: parseInt(value, 10),
            message: messageParts.join(" "),
            processed_at: now
        });
        await dq.destroy();
    }
    logger.info(`Processing done.`);
}