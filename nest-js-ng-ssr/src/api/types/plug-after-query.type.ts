import { CRUD } from '../enums/crud.enum';
import { BasePath } from '../enums/base-path.enum';
import { Request, Response } from 'express';

export type CustomAfterQueryHandler = (req: Request, res: Response) => Promise<any>;

export type PlugAfterQuery = {
  [key in Partial<CRUD>]: Partial<{ [key in Partial<BasePath>]: CustomAfterQueryHandler }>;
};
