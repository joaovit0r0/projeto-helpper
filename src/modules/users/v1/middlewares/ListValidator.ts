// Libraries
import { RequestHandler } from 'express';
import { Meta, Schema } from 'express-validator';

// Entities
// TODO: Add list entity
// Repositories
// TODO: Add list repository
// Validators
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
        // id: {
        //     ...BaseValidator.validators.id(),
        //     errorMessage: 'Lista não encontrada'
        // },
        parentId: {
            errorMessage: 'Lista não pertence ao usuário',
            custom: {
                options: (_: string, { req }: Meta) => {
                    const { listRef, userRef } = req.body;
                    return listRef.parentId.toString() === userRef.id.toString() ? Promise.resolve() : Promise.reject();
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
            token: BaseValidator.validators.token
        });
    }

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token
        });
    }

    /**
     * delete
     *
     * @returns Lista de validadores
     */
    public static delete(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token
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
            token: BaseValidator.validators.token
        });
    }

    /**
     * getAllLists
     *
     * @returns Lista de validadores
     */
    public static getAllLists(): RequestHandler[] {
        return ListValidator.validationList({
            token: BaseValidator.validators.token
        });
    }
}
