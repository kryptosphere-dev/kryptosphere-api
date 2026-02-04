import express from 'express';
import { RoleMiddleware, SessionMiddleware } from '../middleware';
import { IUserRole } from '../models';
import exp from 'constants';
import { MongooseService } from '../services/mongoose';

export class BoardController {

    private static instance?: BoardController;

    static getInstance(): BoardController {
        if(!BoardController.instance) {
            BoardController.instance = new BoardController();
        }
        return BoardController.instance;
    }

    async createBoard(req: express.Request, res: express.Response) {
        if(!req.body || typeof req.body.name !== 'string') {
            res.status(400).end();
            return;
        }
        const mongooseService = await MongooseService.getInstance();
        const boardServices = mongooseService.boardServices;
        const board = await boardServices.createBoard(req.body);
        res.json(board);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', 
            SessionMiddleware(), 
            RoleMiddleware(IUserRole.SuperAdmin),
            express.json(),
            this.createBoard.bind(this)
        )
        return router;
    }
}