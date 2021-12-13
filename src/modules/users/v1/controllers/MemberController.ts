// Modules
import { Request, Response } from 'express';
import { DeepPartial } from 'typeorm';
import { upload } from '../../../../config/multer';

// Library
import { BaseController, MemberRepository } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints, TFilteredMember } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Member } from '../../../../library/database/entity';

// Validators
import { MemberValidator } from '../middlewares/MemberValidator';

@Controller(EnumEndpoints.MEMBERS_V1)
export class MemberController extends BaseController {
    /**
     * @swagger
     * /v1/user/members:
     *   post:
     *     summary: Cria um membro
     *     tags: [Members]
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: Alex
     *               photo:
     *                 type: string
     *                 format: base64
     *               birthdate:
     *                 type: string
     *                 format: date
     *                 example: 12/05/2005
     *               allowance:
     *                 type: number
     *                 format: float
     *                 minimum: 0
     *                 example: 125.25
     *             required:
     *               - name
     *               - photo
     *               - birthdate
     *               - allowance
     *             encoding:
     *               photo:
     *                 contentType: image/png, image/jpeg
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares()
    public async create(req: Request, res: Response): Promise<void> {
        const a = req.file?.buffer as any;
        console.log(a);
        // const member: DeepPartial<Member> = {
        //     name: req.body.name,
        //     photo: req.file?.path,
        //     parentId: req.body.userRef.id,
        //     birthdate: req.body.birthdate,
        //     allowance: req.body.allowance
        // };
        // console.log('aa');
        // await new MemberRepository().insert(member);
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/members:
     *   get:
     *     summary: Retorna uma lista de membros de um usuário
     *     tags: [Members]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/userGetMembers'
     */
    @Get()
    @PublicRoute()
    @Middlewares(MemberValidator.get())
    public async get(req: Request, res: Response): Promise<void> {
        const memberRepository = new MemberRepository();
        const members: TFilteredMember[] = await memberRepository.findByParentId(req.body.userRef.id);
        RouteResponse.success(members, res);
    }

    /**
     * @swagger
     * /v1/user/members:
     *   put:
     *     summary: Altera o membro com o id informado
     *     tags: [Members]
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *                 example: 61b7268110ff150035028b33
     *               name:
     *                 type: string
     *                 example: Alex
     *               photo:
     *                 type: string
     *                 format: base64
     *               birthdate:
     *                 type: string
     *                 format: date
     *                 example: 12/05/2005
     *               allowance:
     *                 type: number
     *                 format: float
     *                 minimum: 0
     *                 example: 125.25
     *             required:
     *               - id
     *               - name
     *               - photo
     *               - birthdate
     *               - allowance
     *             encoding:
     *               photo:
     *                 contentType: image/png, image/jpeg
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(MemberValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const member: Member = req.body.memberRef;

        await new MemberRepository().update(member);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/members/{memberId}:
     *   delete:
     *     summary: Apaga um membro definitivamente
     *     tags: [Members]
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
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Delete('/:id')
    @PublicRoute()
    @Middlewares()
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new MemberRepository().delete(id);

        RouteResponse.successEmpty(res);
    }
}
