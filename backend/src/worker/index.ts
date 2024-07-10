import { PriorityQueue, MaxPriorityQueue, IGetCompareValue } from "@datastructures-js/priority-queue";
import db from "../db";
import FileData from "../models/FileData";

const comparePriority: IGetCompareValue<FileData> = (el) => el.priority;

export default class Worker {
    private pq: MaxPriorityQueue<FileData>;
    private batch_limit = 15;
    private processing_interval_seconds = 10;
    private isProcessing = false;

    public constructor() {
        this.pq = new MaxPriorityQueue(comparePriority);
        setInterval(() => this.processData(), this.processing_interval_seconds * 1000);
    }

    public enqueueNewData(fd: FileData[]) {
        fd.forEach((data) => this.pq.push(data));
    };

    public getQueue = () => this.pq.toArray();

    private async processData() {
        if (this.pq.isEmpty() || this.isProcessing) return;
        this.isProcessing = true;
        const timestamp = new Date(Date.now());
        try {
            let query: string = "INSERT INTO DATA(timestamp, message) VALUES \n";
            let queryBuilder: string[] = [];
            let params: any[] = [timestamp];
            for (let i = 2; i <= this.batch_limit + 1 && !this.pq.isEmpty(); i++) {
                const { message } = this.pq.pop();
                params.push(message);
                queryBuilder.push(`($1, $${i})`);
            }
            query += queryBuilder.join(',\n');
            db.query(query, params).catch((err) => console.error("Error when adding data to db:", err));
        } catch (err: any) { console.error("Error while processing:", err); }
        finally { this.isProcessing = false; }
    }


} 