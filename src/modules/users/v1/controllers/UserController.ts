// Modules
import { Request, Response } from 'express';
import { DeepPartial } from 'typeorm';

// Library
import jwt from 'jsonwebtoken';
import { BaseController, User, UserRepository, TaskRepository } from '../../../../library';

// Decorators
import { Controller, Get, Middlewares, Post, PublicRoute } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Task } from '../../../../library/database/entity/Task';

// Validators
import { UserValidator } from '../middlewares/UserValidator';

@Controller(EnumEndpoints.USER_V1)
export class UserController extends BaseController {
    /**
     * @swagger
     * /v1/user/login:
     *   post:
     *     summary: Fazer login
     *     tags: [Users, Login]
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
     *               email: exemplo@email.com
     *               password: senha123
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                  type: string
     *     responses:
     *       $ref: '#/components/responses/baseLogin'
     */
    @Post('/login')
    @PublicRoute()
    @Middlewares(UserValidator.login())
    public async login(req: Request, res: Response): Promise<void> {
        const token: string = jwt.sign({ id: req.body.userRef.id }, process.env.SECRET as string, { expiresIn: '1d' });

        RouteResponse.success(token, res);
    }

    /**
     * @swagger
     * /v1/user/login/validate:
     *   get:
     *     summary: Valida o token do usuário
     *     tags: [Users, Protected routes]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/login/validate')
    @PublicRoute()
    @Middlewares(UserValidator.validateToken())
    public async teste(req: Request, res: Response): Promise<void> {
        RouteResponse.success('', res);
    }

    /**
     * @swagger
     * /v1/user:
     *   post:
     *     summary: Criar um usuário
     *     tags: [Users,Test Routes]
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
     *               email: exemplo@email.com
     *               password: senha123
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                  type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Post('/tasks')
    @PublicRoute()
    @Middlewares(UserValidator.signUp())
    public async add(req: Request, res: Response): Promise<void> {
        const newUser: DeepPartial<User> = {
            email: req.body.email,
            password: req.body.password
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
