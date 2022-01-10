// Modules
import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeepPartial } from 'typeorm';

// Library
import { BaseController, ComposedTask, ComposedTaskRepository, List, ListRepository, TaskRepository } from '../../../../library';
import { Task } from '../../../../library/database/entity/Task';
// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from '../../../../decorators';

// Models
import { EnumEndpoints, EnumListStatus, TInputTask } from '../../../../models';

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
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: Tarefas de abril
     *               memberId:
     *                 type: string
     *                 example: 61b016a680817a00379f1e4c
     *               tasks:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     taskId:
     *                       type: string
     *                       example: 61b016a680817a00379f1e4c
     *                     value:
     *                       type: number
     *                       example: 10
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(ListValidator.post())
    public async create(req: Request, res: Response): Promise<void> {
        const newList: DeepPartial<List> = {
            name: req.body.name,
            status: 'A',
            memberId: req.body.memberId
        };

        const { id } = await new ListRepository().insert(newList);

        const newTasks: ComposedTask[] = req.body.tasks.map((task: TInputTask) => {
            const newTask: DeepPartial<ComposedTask> = {
                listId: `${id}`,
                taskId: task.taskId,
                value: task.value,
                missed: false
            };

            return newTask;
        });

        await new ComposedTaskRepository().insertMany(newTasks);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/user/lists/{memberId}/active:
     *   get:
     *     summary: Retorna a lista ativa de um membro
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: memberId
     *         schema:
     *           type: string
     *         required: true
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/listGetActive'
     */
    @Get('/:id/active')
    @Middlewares(ListValidator.get())
    public async getActiveList(req: Request, res: Response): Promise<void> {
        const list: List | undefined = await new ListRepository().getMemberActiveList(req.params.id);
        const tasks: ComposedTask[] = await new ComposedTaskRepository().getTasksByListId(`${list?.id}`);
        const tasksBodys = await Promise.all(
            tasks.map(async (item: ComposedTask) => {
                const foundTask: Task | undefined = await new TaskRepository().findOne(item.taskId);
                if (!foundTask) {
                    return Promise.reject();
                }
                const { id, missed, value } = item;
                const { description } = foundTask;
                return { id, missed, value, description };
            })
        );

        if (!!list && !!tasksBodys.length) {
            RouteResponse.success({ ...list, tasks: tasksBodys }, res);
        } else {
            RouteResponse.error("Couldn't complete the request", res);
        }
    }

    /**
     * @swagger
     * /v1/user/lists/{memberId}:
     *   get:
     *     summary: Retorna as listas finalizadas de um membro
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: memberId
     *         schema:
     *           type: string
     *         required: true
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/listGetFinished'
     */
    @Get('/:id')
    @Middlewares(ListValidator.get())
    public async getFinishedLists(req: Request, res: Response): Promise<void> {
        const lists: List[] = await new ListRepository().getMemberFinishedLists(req.params.id);
        const formattedLists = await Promise.all(
            lists.map(
                async (list: List): Promise<any> => {
                    const tasks: ComposedTask[] = await new ComposedTaskRepository().getTasksByListId(`${list.id}`);
                    const tasksBodys = await Promise.all(
                        tasks.map(async (item: ComposedTask) => {
                            const foundTask: Task | undefined = await new TaskRepository().findOne(item.taskId);
                            if (!foundTask) {
                                return Promise.reject();
                            }
                            const { id, missed, value } = item;
                            const { description } = foundTask;
                            return { id, missed, value, description };
                        })
                    );
                    return { ...list, tasks: tasksBodys };
                }
            )
        );
        RouteResponse.success(formattedLists, res);
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
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *                 example: 61b016a680817a00379f1e4c
     *               name:
     *                 type: string
     *                 example: Tarefas de abril
     *               status:
     *                 type: string
     *                 example: 'A'
     *               startDate:
     *                 type: string
     *                 format: date
     *                 example: 01/04/2021
     *               tasks:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     taskId:
     *                       type: string
     *                       example: 61b016a680817a00379f1e4c
     *                     value:
     *                       type: number
     *                       example: 10
     *               completionDate:
     *                 type: string
     *                 format: date
     *                 example: 30/04/2021
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @Middlewares(ListValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        let newList: any = {};
        if (req.body.listRef.status === EnumListStatus.AWAITING && req.body.status !== EnumListStatus.FINISHED) {
            const name = req.body.name ?? req.body.listRef.name;
            const status = req.body.status ?? req.body.listRef.status;
            const startDate = req.body.startDate ?? req.body.listRef.startDate;
            const tasks = req.body.tasks ?? req.body.listRef.tasks;
            newList = { ...req.body.listRef, name, status, startDate, tasks };
        } else if (req.body.listRef.status === EnumListStatus.STARTED && req.body.status !== EnumListStatus.AWAITING) {
            const status = req.body.status ?? req.body.listRef.status;
            const completionDate = req.body.completionDate ?? req.body.listRef.completionDate;
            const tasks = req.body.tasks ?? req.body.listRef.tasks;
            newList = { ...req.body.listRef, status, completionDate, tasks };
        } else if (req.body.listRef.status === EnumListStatus.FINISHED) {
            RouteResponse.error('Não é possível alterar uma lista finalizada', res);
            return;
        }

        if (Object.keys(newList).length !== 0) {
            await new ListRepository().update(newList);
            RouteResponse.successEmpty(res);
        } else {
            RouteResponse.error('Não foi possível completar a requisição', res);
        }
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
    @Middlewares(ListValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        await new ListRepository().delete(req.params.id);
        await new ComposedTaskRepository().removeByListId(req.params.id);
        RouteResponse.successEmpty(res);
    }
}
