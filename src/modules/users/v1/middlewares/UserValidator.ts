// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';
import crypto from 'crypto';
import { EnumCrypto } from '../../../../models/EnumCrypto';

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
                        const iv = req.body.userRef.initializationVector;
                        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(EnumCrypto.KEY), iv.b);
                        let encrypted = cipher.update(req.body.password);
                        encrypted = Buffer.concat([encrypted, cipher.final()]);
                        req.body.password = encrypted;

                        check = req.body.password === req.body.userRef.password;
                    }

                    return check ? Promise.resolve() : Promise.reject();
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
            email: UserValidator.validators.emailBase
            // password: UserValidator.model.password
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
