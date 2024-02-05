import express from "express";
import { logEvents } from './logger';

const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 // server error 

    res.status(status).json({ message: err.message })
}

export default errorHandler;