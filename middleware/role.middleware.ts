import { IUserRole } from "../models";
import express from "express";

export function RoleMiddleware(role: IUserRole) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(req.user && req.user.role === role) {
            next();
            return;
        }
        res.status(403).end();
    }
}