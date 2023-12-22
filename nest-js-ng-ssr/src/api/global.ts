import { IUser } from './interfaces/entity/user.interface';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
export default global;
