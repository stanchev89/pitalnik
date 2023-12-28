import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { IAllowedQueryFields } from '../interfaces/allowed-query-fields';
import { CustomBeforeQueryHandler, PlugBeforeQuery } from '../types/plug-before-query.type';
import { CustomAfterQueryHandler, PlugAfterQuery } from '../types/plug-after-query.type';
import { AllowedControllerQueries } from '../types/allowed-controller-queries.type';
import { CRUD } from '../enums/crud.enum';
import { BasePath } from '../enums/base-path.enum';
import { Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, Res } from '@nestjs/common';
import { ERROR_CODE } from '../enums/error-code.enum';
import { IBaseEntity } from '../interfaces/entity/base-entity.interface';
import { Request, Response } from 'express';
import { enrichReqWithQueryParams } from '../shared/helpers/enrich-req-with-query-params';
import { PAGINATION, QueryClause } from '../enums/query-clause.enum';

export abstract class BaseController<T extends IBaseEntity> {
  protected abstract readonly repository: Repository<T>;
  protected abstract readonly availablePaths: Partial<AllowedControllerQueries>;
  protected abstract readonly allowedQueryFields: IAllowedQueryFields<T>;

  protected plugBeforeQuery: Partial<PlugBeforeQuery> = {} as PlugBeforeQuery;
  protected plugAfterQuery: Partial<PlugAfterQuery> = {} as PlugAfterQuery;

  constructor() {}

  @Delete(BasePath.ENTITY)
  deleteEntity(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!this.isAvailablePath(CRUD.DELETE, BasePath.ENTITY)) {
    }
    return this.handleRequest(req, res, BasePath.ENTITY, () => this.repository.delete(req[QueryClause.WHERE]));
  }

  @Put(BasePath.ENTITY)
  putEntity(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Param('id', ParseIntPipe) id: number) {
    if (!this.isAvailablePath(CRUD.PUT, BasePath.ENTITY)) {
      this.throwNotFoundException();
    }

    return this.handleRequest(req, res, BasePath.ENTITY, () =>
      this.repository.update({ id } as FindOptionsWhere<any>, req.body)
    );
  }

  @Post(BasePath.SLASH)
  post(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!this.isAvailablePath(CRUD.POST, BasePath.SLASH)) {
      this.throwNotFoundException();
    }
    return this.handleRequest(req, res, BasePath.SLASH, () => {
      const entity = this.repository.create(req.body);
      return this.repository.save(entity);
    });
  }

  @Post(BasePath.ENTITY)
  postEntity(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Param('id', ParseIntPipe) id: number) {
    if (!this.isAvailablePath(CRUD.POST, BasePath.ENTITY)) {
      this.throwNotFoundException();
    }

    return this.handleRequest(req, res, BasePath.ENTITY, () =>
      this.repository.update({ id } as FindOptionsWhere<any>, req.body)
    );
  }

  @Get(BasePath.ENTITY)
  getEntity(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Param('id', ParseIntPipe) id: number) {
    if (!this.isAvailablePath(CRUD.GET, BasePath.ENTITY)) {
      this.throwNotFoundException();
    }
    console.log('GET ENTITY');
    return this.handleRequest(req, res, BasePath.ENTITY, () =>
      this.repository.findOne(this.getFindOneClauses(req, id)).then((result) => {
        if (!result) {
          throw new HttpException(ERROR_CODE.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return result;
      })
    );
  }

  @Get(BasePath.SLASH)
  getAll(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!this.isAvailablePath(CRUD.GET, BasePath.SLASH)) {
      this.throwNotFoundException();
    }

    return this.handleRequest(req, res, BasePath.SLASH, () => this.repository.find(this.getFindManyClauses(req)));
  }

  private isAvailablePath(method: CRUD, path: BasePath): boolean {
    return this.availablePaths[method]?.includes(path);
  }

  private throwNotFoundException(): void {
    throw new HttpException(ERROR_CODE.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  private handleRequest(
    req: Request,
    res: Response,
    path: BasePath,
    repMethod: () => Promise<T | T[] | DeleteResult>
  ): Promise<any> {
    enrichReqWithQueryParams(this.allowedQueryFields, req);
    return this.handlePlugBeforeQuery(req, path)
      .then(() => repMethod())
      .then((response) => {
        this.handlePlugAfterQuery(req, res, path);
        return response;
      });
  }

  private handlePlugBeforeQuery(req: Request, path: BasePath): Promise<any> {
    const plugBefore: CustomBeforeQueryHandler | undefined = this.plugBeforeQuery[req.method]?.[path];
    if (plugBefore) {
      return plugBefore(req);
    }
    return Promise.resolve();
  }

  private handlePlugAfterQuery(req: Request, res: Response, path: BasePath): Promise<any> {
    const plugAfter: CustomAfterQueryHandler | undefined = this.plugAfterQuery[req.method]?.[path];
    if (plugAfter) {
      return plugAfter(req, res);
    }
    return Promise.resolve();
  }

  private getFindOneClauses(req: Request, id?: number): FindOneOptions {
    const where = id ? { ...req[QueryClause.WHERE], id } : req[QueryClause.WHERE];
    return {
      relations: req[QueryClause.RELATIONS],
      where
    };
  }

  private getFindManyClauses(req: Request): FindManyOptions {
    return {
      ...this.getFindOneClauses(req),
      order: req[QueryClause.ORDER],
      take: req[PAGINATION][QueryClause.TAKE],
      skip: req[PAGINATION][QueryClause.SKIP]
    };
  }
}
