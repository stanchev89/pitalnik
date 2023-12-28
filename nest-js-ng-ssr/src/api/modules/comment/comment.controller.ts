import { IComment } from '../../interfaces/entity/comment.interface';

const allowedWhereQueryFields: (keyof IComment)[] = ['text'];

// @Controller()
// export class CommentController extends BaseController<IComment> {
//   allowedQueryFields = { where: allowedWhereQueryFields };
//
//   constructor() {
//     super();
//   }
// }
