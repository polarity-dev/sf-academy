import {PriorityQueue} from "./priorityQueue";
import {db} from "../database";

const tag: string = "PROCESSOR"

export class Processor {

    // Naturally min must be < than max
    // Not tested with a lower priority than 1
    min_priority: number
    max_priority: number
    priority_queue: PriorityQueue

    batch_size: number = 15
    throttling_interval: number = 10000

    constructor(min_priority:number, max_priority:number) {
        this.min_priority = min_priority
        this.max_priority = max_priority

        this.priority_queue = new PriorityQueue(this.min_priority, this.max_priority)

        setInterval(async () => {await this.processQueue()}, this.throttling_interval)
    }

    addToQueue(data: string) {
        let split: string[] = data.trimEnd().split("\n")
        console.debug(`[${tag}]: Split data is: ${split}\n\n`)
        for (let line of split) {
            // We separate the priority from the data to process

            // I used this approach in case the priority number gets higher than 9
            let index: number = line.indexOf(" ");
            let split_line: [string, string] = [line.slice(0, index), line.slice(index + 1)];
            console.debug(`[${tag}]: Split line is: ${split_line}`)

            if (!this.priority_queue.insert(split_line[0], split_line[1])) {
                console.warn(`[${tag}]: Data priority levels exceeds boundaries. Data has been discarded`)
                console.warn(`[${tag}]: Data: ${line}`)
            }
        }
        console.debug(`\n\n[${tag}]: priority queue is:`)
        console.dir(this.priority_queue.queue)
    }

    async processQueue() {
        // If no database connection, we skip
        try {
            const c =await db.connect()
            c.done()
        } catch (err: any) {
            console.error(`[${tag}]: Error while connecting to the database: ${err}`)
            return
        }

        let to_process: [string[], number] = this.priority_queue.getNDataByPriority(this.batch_size)

        // There is nothing to process
        if (to_process[0].length == 0) {
            console.debug(`\n\n[${tag}]: Nothing to process`)
            return
        }

        let values: { val: string }[] = []
        for (let i of to_process[0]) {
            values.push({val: i})
        }

        try {
            const result = await db.data.add_multiple(values)
            console.debug(`\n\n[${tag}]: Query result is:`)
            console.dir(result)
        } catch (err: any) {
            console.error(`[${tag}]: Error while adding data: ${err}`)
            // If we fail to add data for any reason, we put it back into the queue to process it at a later time
            for (let i of to_process[0]) {
                this.priority_queue.insert(String(to_process[1]), i)
            }
        }
    }

    getPendingDataArray(): [string, string[]][] {
        // Should be thread safe since we only read data
        // Update: https://stackoverflow.com/questions/24783882/how-to-write-thread-safe-code-in-node-js
        // This makes things simpler huh
        return Array.from(this.priority_queue.getQueueMap())
    }


}