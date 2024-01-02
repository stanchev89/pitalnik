import { CRUD } from '../enums/crud.enum';
import { Request } from 'express';
import { BasePath } from '../enums/base-path.enum';

export type CustomBeforeQueryHandler = (req: Request) => Promise<any>;

export type PlugBeforeQuery = {
  [key in Partial<CRUD>]: Partial<{ [key in Partial<BasePath>]: CustomBeforeQueryHandler }>;
};
