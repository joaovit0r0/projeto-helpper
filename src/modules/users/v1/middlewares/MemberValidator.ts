// Libraries
import { RequestHandler } from 'express';
import { Meta, Schema } from 'express-validator';

// Repositories
import { MemberRepository } from '../../../../library/database/repository/MemberRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

/**
 * MemberValidator
 *
 * Classe de validadores para o endpoint de membros
 */
export class MemberValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de membros
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new MemberRepository()),
            errorMessage: 'Membro não encontrado'
        },
        name: {
            errorMessage: 'Nome inválido',
            in: 'body',
            isLength: {
                options: {
                    min: 3
                }
            },
            custom: {
                options: (_: string, { req }: Meta): Promise<void> => {
                    return req.body.name.match(/[^a-z\s]/gim) ? Promise.reject() : Promise.resolve();
                }
            }
        },
        photo: {
            errorMessage: 'Foto inválida',
            custom: {
                options: (_: string, { req }: Meta): Promise<void> => {
                    return req.file ? Promise.resolve() : Promise.reject();
                }
            }
        },
        belongsToParent: {
            errorMessage: 'Membro não pertence ao usuário',
            custom: {
                options: async (_: string, { req }: Meta): Promise<void> => {
                    const { memberRef, userRef } = req.body;
                    return memberRef.parentId.toString() === userRef.id.toString() ? Promise.resolve() : Promise.reject();
                }
            }
        },
        birthdate: {
            errorMessage: 'Data de nascimento inválida',
            in: 'body',
            isDate: {
                errorMessage: 'Formato de data inválida. Formato correto: DD/MM/YYYY',
                options: {
                    format: 'DD/MM/YYYY',
                    strictMode: true,
                    delimiters: ['/']
                }
            },
            custom: {
                errorMessage: 'Idade inválida',
                options: (_: string, { req }: Meta): Promise<void> => {
                    const today: Date = new Date(Date.now());
                    const formattedDate: string = req.body.birthdate.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/g, '$2/$1/$3');
                    const informedDate: number = Date.parse(formattedDate);
                    // Caso a data informada tenha menos de um dia de diferença da data atual
                    const check: boolean = today.getTime() - 86400000 > informedDate;
                    if (check) {
                        const dateDiff: number = today.getTime() - informedDate;
                        // Checa para ver se a diferença das 2 datas é menor que 18 anos
                        return dateDiff < 567648000000 ? Promise.resolve() : Promise.reject();
                    }
                    return Promise.reject();
                }
            }
        },
        allowance: {
            errorMessage: 'Valor de mesada inválido',
            in: 'body',
            isNumeric: true,
            customSanitizer: {
                options: (value: string) => {
                    const allowance = +parseFloat(value).toFixed(2);
                    return Math.max(0, allowance);
                }
            }
        },
        minOneProperty: {
            errorMessage: 'É necessário informar no mínimo uma propriedade',
            custom: {
                options: (_: string, { req }: Meta) => {
                    const { name, birthdate, allowance } = req.body;
                    const { file } = req;
                    return !!name || !!birthdate || !!allowance || !!file;
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
        return MemberValidator.validationList({
            token: BaseValidator.validators.token,
            name: MemberValidator.model.name,
            photo: MemberValidator.model.photo,
            birthdate: MemberValidator.model.birthdate,
            allowance: MemberValidator.model.allowance
        });
    }

    /**
     * get
     *
     * @returns Lista de validadores
     */
    public static get(): RequestHandler[] {
        return MemberValidator.validationList({
            token: BaseValidator.validators.token
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return MemberValidator.validationList({
            token: BaseValidator.validators.token,
            id: MemberValidator.model.id,
            belongsToParent: MemberValidator.model.belongsToParent,
            photo: MemberValidator.model.photo,
            name: MemberValidator.model.name,
            birthdate: MemberValidator.model.birthdate,
            allowance: MemberValidator.model.allowance
        });
    }

    /**
     * delete
     *
     * @returns Lista de validadores
     */
    public static delete(): RequestHandler[] {
        return MemberValidator.validationList({
            token: BaseValidator.validators.token,
            parentId: MemberValidator.model.parentId
        });
    }
}
