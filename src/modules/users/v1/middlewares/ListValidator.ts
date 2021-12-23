// Libraries
import { RequestHandler } from 'express';
import { Meta, Schema } from 'express-validator';

import { EnumListStatus } from '../../../../models';
import { List, ListRepository, MemberRepository } from '../../../../library';
import { BaseValidator } from '../../../../library/BaseValidator';

/**
 * ListValidator
 *
 * classe de validadores para o endpoint de listas
 */
export class ListValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de listas
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new ListRepository()),
            errorMessage: 'Lista não encontrada'
        },
        checkMemberId: {
            isEmpty: true,
            custom: {
                options: (_: string, { req }: Meta) => {
                    req.body.memberId = req.params?.id;
                    return Promise.resolve();
                }
            }
        },
        memberExists: {
            errorMessage: 'Membro não encontrado',
            isEmpty: true,
            custom: {
                options: async (_: string, { req }: Meta): Promise<void> => {
                    const memberRepository = new MemberRepository();
                    const data = await memberRepository.findOne(req.body.memberId);

                    req.body.memberRef = data;

                    return data ? Promise.resolve() : Promise.reject();
                }
            }
        },
        memberBelongsToParent: {
            errorMessage: 'Membro não pertence ao usuário',
            isEmpty: true,
            custom: {
                options: async (_: string, { req }: Meta): Promise<void> => {
                    const { memberRef, userRef } = req.body;
                    return memberRef.parentId.toString() === userRef.id.toString() ? Promise.resolve() : Promise.reject();
                }
            }
        },
        name: {
            in: 'body',
            errorMessage: 'Nome de lista inválido',
            isLength: {
                options: {
                    min: 3
                }
            },
            isString: true
        },
        status: {
            in: 'body',
            errorMessage: 'Status de lista inválido',
            isString: true,
            isLength: {
                options: {
                    max: 1
                }
            }
        },
        memberId: {
            in: 'body',
            isMongoId: true,
            errorMessage: 'Id do membro inválida',
            isString: true
        },
        startDate: {
            errorMessage: 'Data de início inválida',
            in: 'body',
            isDate: {
                errorMessage: 'Formato de data de início inválida',
                options: {
                    format: 'DD/MM/YYYY',
                    strictMode: true,
                    delimiters: ['/']
                }
            },
            custom: {
                options: (_: string, { req }: Meta): Promise<void> => {
                    const today: Date = new Date(Date.now());
                    const { startDate } = req.body;
                    const formattedDate: string = startDate.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/g, '$2/$1/$3');
                    const informedDate: number = Date.parse(formattedDate);
                    // Caso a data informada tenha menos de um dia de diferença da data atual
                    const check: boolean = today.getTime() >= informedDate;
                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        tasks: {
            errorMessage: 'Lista de tarefas inválida',
            in: 'body',
            isArray: {
                options: {
                    min: 1
                }
            }
        },
        hasActiveList: {
            isEmpty: true,
            custom: {
                errorMessage: 'Membro já possui uma lista ativa',
                options: async (_: string, { req }: Meta): Promise<void> => {
                    const list: List | undefined = await new ListRepository().getMemberActiveList(req.body.memberId);
                    return list ? Promise.reject() : Promise.resolve();
                }
            }
        },
        listIsActive: {
            isEmpty: true,
            errorMessage: 'Lista não pode ser excluída',
            custom: {
                options: async (_: string, { req }: Meta): Promise<void> => {
                    return req.body.listRef.status === EnumListStatus.FINISHED ? Promise.reject() : Promise.resolve();
                }
            }
        },
        findList: {
            isEmpty: true,
            errorMessage: 'Não foi possível encontrar a lista com o id informado',
            custom: {
                options: async (_: string, { req }: Meta): Promise<void> => {
                    const list: List | undefined = await new ListRepository().findOne(req.params?.id);

                    if (list) {
                        req.body.listRef = list;
                        req.body.memberId = list.memberId;
                        return Promise.resolve();
                    }
                    return Promise.reject();
                }
            }
        }
    };

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token,
            id: ListValidator.model.id
        });
    }

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token,
            memberId: ListValidator.model.memberId,
            memberExists: ListValidator.model.memberExists,
            memberBelongsToParent: ListValidator.model.memberBelongsToParent,
            hasActiveList: ListValidator.model.hasActiveList,
            name: ListValidator.model.name,
            startDate: ListValidator.model.startDate,
            tasks: ListValidator.model.tasks
        });
    }

    /**
     * delete
     *
     * @returns Lista de validadores
     */
    public static delete(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token,
            findList: ListValidator.model.findList,
            memberExists: ListValidator.model.memberExists,
            memberBelongsToParent: ListValidator.model.memberBelongsToParent,
            listIsActive: ListValidator.model.listIsActive
        });
    }

    /**
     * patch
     *
     * @returns Lista de validadores
     */
    public static patch(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token
        });
    }

    /**
     * get
     *
     * @returns Lista de validadores
     */
    public static get(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token,
            checkMemberId: ListValidator.model.checkMemberId,
            memberExists: ListValidator.model.memberExists,
            memberBelongsToParent: ListValidator.model.memberBelongsToParent
        });
    }
}
