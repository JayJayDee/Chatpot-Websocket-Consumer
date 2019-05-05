import { injectable } from 'smart-factory';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

injectable(EndpointModules.Utils.WrapAync,
  [],
  async (): Promise<EndpointTypes.Utils.WrapAsync> =>
    (endpoint: RequestHandler) =>
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await endpoint(req, res, next);
        } catch (err) {
          return next(err);
        }
      });