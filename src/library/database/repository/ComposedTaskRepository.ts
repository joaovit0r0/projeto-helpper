import { DeepPartial, DeleteResult, InsertResult, Repository } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { ComposedTask } from '../entity/ComposedTask';
/**
 * ComposedTaskRepository
 *
 * Repositório para tabela de tarefas iniciadas
 */
export class ComposedTaskRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = ComposedTask;
    }

    /**
     * insert
     *
     * Adiciona uma nova tarefa
     *
     * @param task - Tarefa
     *
     * @returns Tarefa adicionada
     */
    public insert(task: DeepPartial<ComposedTask>): Promise<ComposedTask> {
        const composedTaskRepository: Repository<ComposedTask> = this.getConnection().getRepository(ComposedTask);
        return composedTaskRepository.save(composedTaskRepository.create(task));
    }

    /**
     * update
     *
     * Altera uma tarefa
     *
     * @param task - Tarefa
     *
     * @returns Tarefa alterada
     */
    public update(task: ComposedTask): Promise<ComposedTask> {
        return this.getConnection().getRepository(ComposedTask).save(task);
    }

    /**
     * getTasksByListId
     *
     * Retorna todas as tarefas com o id da lista informada
     *
     * @param listId - Id da lista
     *
     * @returns Array com todas as tarefas
     */
    public getTasksByListId(listId: string): Promise<ComposedTask[]> {
        return this.getConnection().getRepository(ComposedTask).find({ where: { listId } });
    }

    /**
     * delete
     *
     * Remove uma tarefa pelo ID
     *
     * @param id - Id da tarefa
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(ComposedTask).delete(id);
    }

    /**
     * removeByListId
     *
     * Remove todas as tasks que contenham o id da lista informado
     *
     * @param listId - Id da lista
     * @returns Resultado da remoção
     */
    public removeByListId(listId: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(ComposedTask).delete({ listId });
    }

    /**
     * insertMany
     *
     * Adiciona todas as tarefas contidas no array
     *
     * @param array - Array contendo todas as tarefas
     *
     * @returns Resultado da adição
     */
    public insertMany(array: ComposedTask[]): Promise<InsertResult> {
        return this.getConnection().getRepository(ComposedTask).insert(array);
    }
}
