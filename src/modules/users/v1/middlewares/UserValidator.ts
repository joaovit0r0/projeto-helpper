// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
            errorMessage: 'Senha inválida',
            in: 'body',
            isStrongPassword: {
                options: {
                    minSymbols: 0
                }
            }
        },
        loginPassword: {
            errorMessage: 'Senha incorreta',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.userRef) {
                        check = await bcrypt.compare(req.body.password, req.body.userRef.password);
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        token: {
            errorMessage: 'É necessário estar logado para executar está ação!',
            in: 'headers',
            custom: {
                options: async (_: string, { req }) => {
                    const authorization: string = req.headers?.authorization;

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
     * login
     *
     * @returns Lista de validadores
     */
    public static login(): RequestHandler[] {
        return UserValidator.validationList({
            email: UserValidator.model.email,
            password: UserValidator.model.loginPassword
        });
    }

    /**
     * validateToken
     *
     * @returns Lista de validadores
     */
    public static validateToken(): RequestHandler[] {
        return UserValidator.validationList({
            token: UserValidator.model.token
        });
    }

    /**
     * signUp
     *
     * @returns Lista de validadores
     */
    public static signUp(): RequestHandler[] {
        return UserValidator.validationList({
            email: BaseValidator.validators.emailBase,
            password: UserValidator.model.password
        });
    }
}
