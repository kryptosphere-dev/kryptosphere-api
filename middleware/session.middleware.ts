import express from "express";
import { MongooseService } from "../services/mongoose";
import { IUser } from "../models";

declare module "express" {
    interface Request {
        user?: IUser;
    }
}

export function SessionMiddleware(): express.RequestHandler {
    return async(req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authorization = req.headers.authorization;
        if(!authorization) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }

        const token = parts[1];
        const mongooseService = await MongooseService.getInstance();
        const sessionServices = mongooseService.sessionServices;
        const session = await sessionServices.findActiveSession(token);

        if(!session) {
            res.status(401).end();
            return;
        }
        req.user = session.user as IUser;
        next(); // permet d'aller executer la route suivante d'dxpress
    };
}