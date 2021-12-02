// Modules
import { Request, Response } from 'express';
import { DeepPartial } from 'typeorm/common/DeepPartial';

// Library
import jwt from 'jsonwebtoken';
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { User } from '../../../../library/database/entity';

// Repositories
import { UserRepository } from '../../../../library/database/repository';

// Validators
import { UserValidator } from '../middlewares/UserValidator';

@Controller(EnumEndpoints.USER_V1)
export class UserController extends BaseController {
    /**
     * @swagger
     * /v1/user:
     *   get:
     *     summary: Lista os usuários
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '#/components/parameters/listPageRef'
     *       - $ref: '#/components/parameters/listSizeRef'
     *       - $ref: '#/components/parameters/listOrderRef'
     *       - $ref: '#/components/parameters/listOrderByRef'
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get()
    @PublicRoute()
    public async get(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new UserRepository().list<User>(UserController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/user/{userId}:
     *   get:
     *     summary: Retorna informações de um usuário
     *     tags: [Users]
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
    // @Get('/:id')
    // @PublicRoute()
    // @Middlewares(UserValidator.onlyId())
    // public async getOne(req: Request, res: Response): Promise<void> {
    //     RouteResponse.success({ ...req.body.userRef }, res);
    // }

    /**
     * @swagger
     * /v1/user:
     *   post:
     *     summary: Fazer login
     *     tags: [Users, login]
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
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post('/login')
    @PublicRoute()
    @Middlewares(UserValidator.post())
    public async login(req: Request, res: Response): Promise<void> {
        const token = jwt.sign({ id: req.body.userRef.id }, process.env.SECRET as string, { expiresIn: '1d' });

        RouteResponse.success(token, res);
    }

    @Get('/teste')
    @PublicRoute()
    @Middlewares(UserValidator.login())
    public async teste(req: Request, res: Response): Promise<void> {
        const userRepository: UserRepository = new UserRepository();
        const user: User | undefined = await userRepository.findOne(req.body.userId.id);
        if (user) {
            RouteResponse.success('', res);
        } else {
            RouteResponse.unauthorizedError(res, '');
        }
    }

    /**
     * @swagger
     * /v1/user:
     *   post:
     *     summary: Cadastrar um usuario
     *     tags: [Users]
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
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post() // rota para teste
    @Middlewares(UserValidator.signUp())
    @PublicRoute()
    public async add(req: Request, res: Response): Promise<void> {
        const newUser: DeepPartial<User> = {
            email: req.body.email,
            password: req.body.password
        };

        await new UserRepository().insert(newUser);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/user:
     *   put:
     *     summary: Altera um usuário
     *     tags: [Users]
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
    @Put()
    @PublicRoute()
    @Middlewares(UserValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const user: User = req.body.userRef;

        user.email = req.body.email;

        await new UserRepository().update(user);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/{userId}:
     *   delete:
     *     summary: Apaga um usuário definitivamente
     *     tags: [Users]
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
    @Delete('/:id')
    @PublicRoute()
    @Middlewares(UserValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new UserRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
