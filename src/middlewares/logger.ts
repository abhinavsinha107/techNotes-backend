import express from "express";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import fs, { promises as fsPromises } from 'fs';
import path from "path";

export const logEvents = async (message: string, logFileName: string) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

export const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}
