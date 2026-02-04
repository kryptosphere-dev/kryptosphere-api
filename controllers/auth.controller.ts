import express from 'express';
import { MongooseService } from '../services/mongoose';
import mongoose from 'mongoose';
import { SessionMiddleware } from '../middleware';

export class AuthController {

    private static instance?: AuthController;

    static getInstance(): AuthController {
        if(!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    async login(req: express.Request, res: express.Response) {
        if(!req.body || typeof req.body.login !== 'string' || typeof req.body.password !== 'string') {
            res.status(400).end();
            return; // not implemented
        }
        const mongooseService = await MongooseService.getInstance();
        const userServices = mongooseService.userServices;
        const validUser = await userServices.findValidUser(req.body.login, req.body.password);
        if(!validUser) {
            res.status(401).end();
            return;
        }
        const sessionServices = mongooseService.sessionServices;
        const session = await sessionServices.createSession({user: validUser});
        res.json({session: session._id});
    }

    async me(req: express.Request, res: express.Response) {
        res.json(req.user);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/login', express.json(), this.login.bind(this));
        router.get('/me', SessionMiddleware(), this.me.bind(this));
        return router;
    }
}