import { Router, type Request, type Response } from 'express';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const apiRouter = Router();

function crudRoutes(path: string, model: typeof User) {
  apiRouter.get(`/${path}`, async (_request: Request, response: Response, next) => {
    try {
      response.json(await model.find().sort({ createdAt: -1 }));
    } catch (error) {
      next(error);
    }
  });

  apiRouter.post(`/${path}`, async (request: Request, response: Response, next) => {
    try {
      const document = await model.create(request.body);
      response.status(201).json(document);
    } catch (error) {
      next(error);
    }
  });
}

crudRoutes('users', User);
crudRoutes('teams', Team);
crudRoutes('activities', Activity);
crudRoutes('leaderboard', Leaderboard);
crudRoutes('workouts', Workout);

export default apiRouter;