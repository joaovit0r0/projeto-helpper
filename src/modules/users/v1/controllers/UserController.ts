// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController, TaskRepository } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Task } from '../../../../library/database/entity/Task';

// Repositories
// import { UserRepository } from '../../../../library/database/repository';

// Validators
import { UserValidator } from '../middlewares/UserValidator';

@Controller(EnumEndpoints.USER_V1)
export class UserController extends BaseController {
    /**
     * @swagger
     * /v1/user/tasks:
     *   get:
     *     summary: Lista os usuários
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - parentId:
     *           name: parentId
     *           in: query
     *           description: Id do parente que criou as tasks
     *           schema:
     *             type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/tasks')
    @PublicRoute()
    @Middlewares()
    public async get(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/tasks/{taskId}:
     *   get:
     *     summary: Retorna informações de uma task
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: taskId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/tasks/:id')
    @PublicRoute()
    @Middlewares(UserValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.TaskRef }, res);
    }

    /**
     * @swagger
     * /v1/user:
     *   post:
     *     summary: Cadastra um usuário
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               name: userName
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post('/tasks')
    @PublicRoute()
    @Middlewares(UserValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newTask: DeepPartial<Task> = {
            description: req.body.description,
            parentId: req.body.parentId
        };

        await new TaskRepository().insert(newTask);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/user:
     *   put:
     *     summary: Altera um usuário
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               id: userId
     *               name: userName
     *             required:
     *               - id
     *               - name
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put('/tasks')
    @PublicRoute()
    @Middlewares(UserValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const task: Task = req.body.taskRef;

        task.description = req.body.description;

        await new TaskRepository().update(task);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/{userId}:
     *   delete:
     *     summary: Apaga um usuário definitivamente
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/tasks/:id')
    @PublicRoute()
    @Middlewares(UserValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new TaskRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
