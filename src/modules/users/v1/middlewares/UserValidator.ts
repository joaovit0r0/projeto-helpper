// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EncryptionUtils } from '../../../../utils/EncryptionUtils';

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
        password: {
            errorMessage: 'Senha incorreta',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.userRef) {
                        const [iv, encryptedData] = req.body.userRef.password.split(':') as Array<string>;
                        req.body.password = EncryptionUtils.encrypt(Buffer.from(iv, 'hex'), Buffer.from(req.body.password));

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
                    const authorization: string = req?.headers?.authorization;

                    if (!authorization) {
                        return Promise.reject();
                    }

                    const token: string = authorization.replace('Bearer', '').trim();

                    try {
                        const secret: string = process.env.SECRET || '';
                        const data: string | JwtPayload = jwt.verify(token, secret);
                        req.body.userId = data;
                    } catch {
                        return Promise.reject();
                    }

                    const userRepository: UserRepository = new UserRepository();
                    const user: User | undefined = await userRepository.findOne(req.body.userId.id);
                    if (user) {
                        return Promise.resolve();
                    }
                    return Promise.reject();
                }
            }
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static login(): RequestHandler[] {
        return UserValidator.validationList({
            email: UserValidator.model.email,
            password: UserValidator.model.password
        });
    }

    public static validateToken(): RequestHandler[] {
        return UserValidator.validationList({
            token: UserValidator.model.token
        });
    }
}
