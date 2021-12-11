// Modules
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { checkSchema, Result, Schema, ParamSchema, ValidationError, validationResult, Meta } from 'express-validator';

// Utils
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from 'library';
import { StringUtils } from '../utils';

// Routes
import { RouteResponse } from '../routes';

// Repositories
import { BaseRepository, UserRepository } from './database/repository';

/**
 * BaseValidator
 *
 * Classe para tratamentos relacionados aos middlewares de validação de parâmetros
 */
export class BaseValidator {
    /**
     * validators
     *
     * Schema base para validação no controller
     */
    protected static validators: Record<string, ParamSchema> | any = {
        id: (repository: BaseRepository): ParamSchema => {
            return {
                in: ['body', 'params'],
                isMongoId: true, // Não usar em caso de banco diferente do MongoDB
                custom: {
                    options: async (value: string, { req }: Meta) => {
                        const data = await repository.findOne(value);

                        // Usa o nome do repositório para criar o nome de referência. Ex: UserRepository => userRef
                        const refName: string = StringUtils.firstLowerCase(repository.constructor.name.replace('Repository', ''));

                        req.body[`${refName}Ref`] = data;

                        return data ? Promise.resolve() : Promise.reject();
                    }
                },
                errorMessage: 'ID não encontrado'
            };
        },
        name: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 3
                }
            },
            customSanitizer: {
                options: (value: string) => {
                    if (typeof value === 'string') {
                        return StringUtils.firstUpperCase(value);
                    }

                    return undefined;
                }
            },
            errorMessage: 'Nome inválido'
        },
        emailBase: {
            in: 'body',
            isEmail: true,
            errorMessage: 'Email inválido'
        },
        token: {
            errorMessage: 'É necessário estar logado para executar está ação!',
            in: 'headers',
            custom: {
                options: async (_: string, { req }: Meta) => {
                    const authorization: string = req.headers?.authorization;

                    if (!authorization) {
                        return Promise.reject();
                    }

                    const token: string = authorization.replace('Bearer', '').trim();

                    try {
                        const secret: string = process.env.SECRET || '';
                        const data: string | JwtPayload = jwt.verify(token, secret);
                        req.body.userData = data;
                    } catch {
                        return Promise.reject();
                    }

                    const userRepository: UserRepository = new UserRepository();
                    const user: User | undefined = await userRepository.findOne(req.body.userData.id);
                    if (user) {
                        req.body.userRef = user;
                        return Promise.resolve();
                    }
                    return Promise.reject();
                }
            }
        }
    };

    /**
     * validationList
     *
     * Retorna o middleware que valida os campos e o que retorna os erros
     *
     * @param schema - Schema com as opções de validação
     *
     * @returns Lista de validadores
     */
    protected static validationList(schema: Schema): RequestHandler[] {
        return [<any>checkSchema(schema), BaseValidator.checkError];
    }

    /**
     * checkError
     *
     * Verifica se existem erros nos parâmetros e da mensagem de erro
     *
     * @param req - Requisição
     * @param res - Resposta da requisição
     * @param next - Callback
     */
    private static checkError(req: Request, res: Response, next: NextFunction): void {
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            RouteResponse.error(errors.array(), res);
        } else {
            next();
        }
    }

    /**
     * onlyId
     *
     * Retorna o middleware que valida o ID
     *
     * @param repository - Repositório para manipulação da entidade
     *
     * @returns Lista de validadores
     */
    public static onlyId(repository: BaseRepository): RequestHandler[] {
        return BaseValidator.validationList({ id: BaseValidator.validators.id(repository) });
    }
}
