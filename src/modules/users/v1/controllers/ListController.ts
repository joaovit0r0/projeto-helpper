// Modules
import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeepPartial } from 'typeorm';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Patch, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities

// Validators
import { ListValidator } from '../middlewares/ListValidator';

@Controller(EnumEndpoints.LISTS_V1)
export class ListController extends BaseController {
    /**
     * @swagger
     * /v1/user/lists:
     *   post:
     *     summary: Cria uma lista
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(ListValidator.post())
    public async create(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/lists:
     *   get:
     *     summary: Retorna todas as listas de um usuário
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/taskGet'
     */
    @Get()
    @PublicRoute()
    @Middlewares(ListValidator.get())
    public async get(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/lists/{listId}:
     *   get:
     *     summary: Retorna todas as listas de um usuário
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: listId
     *         schema:
     *           type: string
     *         required: true
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/taskGet'
     */
    @Get()
    @PublicRoute()
    @Middlewares(ListValidator.getAllLists())
    public async getAll(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/lists:
     *   put:
     *     summary: Altera a lista com o id informado
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/taskPut'
     */
    @Put()
    @PublicRoute()
    @Middlewares(ListValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/lists:
     *   patch:
     *     summary: Altera a task com o id informado
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/taskPut'
     */
    @Patch()
    @PublicRoute()
    @Middlewares(ListValidator.patch())
    public async updateOneProperty(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/lists/{listId}:
     *   delete:
     *     summary: Apaga uma lista definitivamente
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: listId
     *         schema:
     *           type: string
     *         required: true
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Delete('/:id')
    @PublicRoute()
    @Middlewares(ListValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }
}
