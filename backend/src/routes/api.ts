import { Data } from '@models/data-model';
import { DataQueue } from '@models/data_queue-model';
import dataService from '@services/data-service';
import { UploadFileMissingError } from '@shared/errors';
import { Request, Response, Router } from 'express';
import { UploadedFile } from 'express-fileupload';
import { StatusCodes } from 'http-status-codes';
import { FindOptions, Op } from 'sequelize';

// Export the base-router
const router = Router();
const { OK } = StatusCodes;

router.post("/importDataFromFile", async (req: Request, res: Response) => {
    const file = req.files?.file as UploadedFile | undefined;
    if (!file) {
        throw new UploadFileMissingError();
    }
    // Parse file
    const data = await dataService.parseUploadedFile(file);
    res.status(OK).json({
        count: data.length
    });
});

router.get("/pendingData", async (req: Request, res: Response) => {
    const pendingData = await DataQueue.findAll();
    res.status(OK).json(pendingData);
});

router.get("/data", async (req: Request, res: Response) => {
    const {limit, from} = req.query;
    const options: FindOptions<Data> = {};
    // limit results
    if (limit) {
        options.limit = Number(limit)
    }
    // Add from filter
    if (from) {
        const fromDate = (new Date(Number(from))).toISOString();
        options.where = {
            processed_at: {
                [Op.gte]: fromDate
            }
        };
    }
    options.order = [["processed_at", "desc"]];
    const data = await Data.findAll(options);
    res.status(OK).json(data);
});

// Export default.
export default router;
