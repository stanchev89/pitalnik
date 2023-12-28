import { CRUD } from '../enums/crud.enum';
import { BasePath } from '../enums/base-path.enum';

export type AllowedControllerQueries = { [key in Partial<CRUD>]: BasePath[] };
