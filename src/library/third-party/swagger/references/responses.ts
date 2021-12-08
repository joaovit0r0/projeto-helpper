/**
 * @swagger
 * components:
 *   schemas:
 *     task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61b016a680817a00379f1e4c
 *         description:
 *           type: string
 *           example: some description
 *         parentId:
 *           type: string
 *           example: 61b016a680817a00379f1e4c
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     '200':
 *       description: 'Requisição executada com sucesso'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date-time
 *               data:
 *                 type: object
 *                 description: 'Objeto json de retorno'
 *     '201':
 *       description: 'Criado com sucesso'
 *     '204':
 *       description: 'Requisição completa, resposta sem conteúdo'
 *     '400':
 *       description: 'Erro na requisição'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: object
 *                 description: 'Objeto ou string com informações sobre o erro'
 *     '401':
 *       description: 'Autenticação não autorizada'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: object
 *                 description: 'Acesso não autorizado'
 *     '404':
 *       description: 'Não encontrado'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: object
 *                 description: 'Conteúdo não encontrado'
 *     '500':
 *       description: 'Erro interno no servidor'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               date:
 *                 type: string
 *                 format: date-time
 *               error:
 *                 type: string
 *                 description: 'Mensagem de erro'
 *     baseResponse:
 *       '200':
 *         $ref: '#/components/responses/200'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 *     baseCreate:
 *       '201':
 *         $ref: '#/components/responses/201'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 *     baseEmpty:
 *       '204':
 *         $ref: '#/components/responses/204'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 *     baseLogin:
 *       '200':
 *         description: 'Requisição executada com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                   example:
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                   description: 'Objeto json de retorno contendo um token JWT'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 *     taskGet:
 *       '200':
 *         description: 'Requisição executada com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/task'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 *     taskPut:
 *       '200':
 *         description: 'Task atualizada com sucesso'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   $ref: '#/components/schemas/task'
 *       '400':
 *         $ref: '#/components/responses/400'
 *       '401':
 *         $ref: '#/components/responses/401'
 *       '500':
 *         $ref: '#/components/responses/500'
 */
