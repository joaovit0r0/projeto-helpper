// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

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
                    min: 1
                }
            }
        }
    };

    public static put(): RequestHandler[] {
        return TaskValidator.validationList({
            id: TaskValidator.model.id,
            description: TaskValidator.model.description
        });
    }

    public static post(): RequestHandler[] {
        return TaskValidator.validationList({
            description: TaskValidator.model.description
        });
    }

    public static delete(): RequestHandler[] {
        return TaskValidator.validationList({
            id: TaskValidator.model.id
        });
    }
}
