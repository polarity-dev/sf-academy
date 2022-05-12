
const e = module.exports
import { Request, Response } from "express"


e.importFromFile = async(req: Request, res: Response): Promise<void> => {}

e.processData = async(): Promise<void> => {}

e.getPendingData = async(req: Request, res: Response): Promise<void> => {}

e.getProcessedData = async(req: Request, res: Response): Promise<void> => {}