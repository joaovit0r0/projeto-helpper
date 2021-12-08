// Libraries
import { RequestHandler } from 'express';
import { Meta, Schema } from 'express-validator';

// Repositories
import { TaskRepository } from '../../../../library/database/repository/TaskRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

export class TaskValidator extends BaseValidator {
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new TaskRepository()),
            errorMessage: 'Tarefa não encontrada'
        },
        description: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 4
                }
            }
        },
        parentId: {
            errorMessage: 'Tarefa não pertence ao usuário',
            custom: {
                options: (_: string, { req }: Meta) => {
                    const { taskRef, userRef } = req.body;
                    return taskRef.parentId.toString() === userRef.id.toString() ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    public static put(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token,
            id: TaskValidator.model.id,
            parentId: TaskValidator.model.parentId,
            description: TaskValidator.model.description
        });
    }

    public static post(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token,
            description: TaskValidator.model.description
        });
    }

    public static delete(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token,
            id: TaskValidator.model.id,
            parentId: TaskValidator.model.parentId
        });
    }

    public static get(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token
        });
    }
}
