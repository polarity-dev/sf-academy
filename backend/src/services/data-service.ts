import fs from 'fs';
import { UploadedFile } from "express-fileupload";
import { MalformedDataFileError } from '@shared/errors';
import { DataQueue } from '@models/data_queue-model';

async function parseUploadedFile(file: UploadedFile): Promise<DataQueue[]>
{
    const lines = file.data.toString("utf8").split(/\r?\n/);
    // const lines = fs.readFileSync(file.tempFilePath, 'utf8').split(/\r?\n/);
    const {from, to} = parseFirstLine(lines[0]);
    // throw error if lines are less then required lines
    if (lines.length < to) {
        throw new MalformedDataFileError();
    }
    const data = [];
    for (let i = from; i <= to; i++) {
        const messageParts = lines[i].split(" ");
        const priority = messageParts.shift() || "";
        const item = await DataQueue.create({
            priority: parseInt(priority, 10),
            message: messageParts.join(" ")
        });
        data.push(item);
    }
    return data;
}

function parseFirstLine(line: string)
{
    const regex = new RegExp(/^(\d+) (\d+)$/);
    const result = regex.exec(line);
    // return result;
    if (result === null) {
        throw new MalformedDataFileError();
    }
    return {
        from: parseInt(result[1], 10),
        to: parseInt(result[2], 10)
    };
}

export default {
    parseUploadedFile
} as const;