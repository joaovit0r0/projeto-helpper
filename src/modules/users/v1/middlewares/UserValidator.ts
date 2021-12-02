// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { key } from '../../../../models/EnumCrypto';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { User } from '../../../../library/database/entity';

/**
 * UserValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class UserValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: 'Usuário não encontrado'
        },
        email: {
            ...BaseValidator.validators.emailBase,
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.email) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByEmail(req.body.email);

                        req.body.userRef = user;

                        check = !!user;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        duplicate: {
            errorMessage: 'Usuário já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.email) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByEmail(req.body.email);

                        check = user ? req.body.id === user.id.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        password: {
            errorMessage: 'Senha incorreta',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.userRef) {
                        const [iv, encryptedData] = req.body.userRef.password.split(':');
                        const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
                        const encrypted = Buffer.concat([cipher.update(Buffer.from(req.body.password)), cipher.final()]);
                        req.body.password = encrypted.toString('hex');

                        check = encryptedData === req.body.password;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        token: {
            errorMessage: 'É necessário estar logado para executar está ação!',
            custom: {
                options: async (_: string, { req }) => {
                    const authorization = req?.headers?.authorization;

                    if (!authorization) {
                        return Promise.reject();
                    }

                    const token = authorization.replace('Bearer', '').trim();

                    try {
                        const secret: string = process.env.SECRET || '';
                        const data = jwt.verify(token, secret);
                        req.body.userId = data;
                    } catch {
                        return Promise.reject();
                    }

                    return Promise.resolve();
                }
            }
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return UserValidator.validationList({
            email: UserValidator.model.email,
            password: UserValidator.model.password
        });
    }

    public static signUp(): RequestHandler[] {
        return UserValidator.validationList({
            email: UserValidator.validators.emailBase
        });
    }

    public static login(): RequestHandler[] {
        return UserValidator.validationList({
            token: UserValidator.model.token
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return UserValidator.validationList({
            id: UserValidator.model.id,
            ...UserValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: UserValidator.model.id
        });
    }
}
