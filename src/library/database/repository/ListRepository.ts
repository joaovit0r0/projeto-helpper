import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { EnumListStatus } from '../../../models';
import { BaseRepository } from './BaseRepository';
import { List } from '../entity/List';
/**
 * ListRepository
 *
 * Repositório para tabela de Listas
 */
export class ListRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = List;
    }

    /**
     * insert
     *
     * Adiciona uma nova lista
     *
     * @param list - Lista
     *
     * @returns Lista adicionada
     */
    public insert(list: DeepPartial<List>): Promise<List> {
        const listRepository: Repository<List> = this.getConnection().getRepository(List);
        return listRepository.save(listRepository.create(list));
    }

    /**
     * update
     *
     * Altera uma lista
     *
     * @param list - Lista
     *
     * @returns Lista alterada
     */
    public update(list: List): Promise<List> {
        return this.getConnection().getRepository(List).save(list);
    }

    /**
     * getMemberActiveList
     *
     * Retorna a lista ativa de um membro
     *
     * @param memberId - Id do membro
     * @returns Lista com o status de ativa ou undefined caso não exista nenhuma
     */
    public getMemberActiveList(memberId: string): Promise<List | undefined> {
        return this.getConnection()
            .getRepository(List)
            .findOne({
                where: { memberId, $or: [{ status: EnumListStatus.STARTED }, { status: EnumListStatus.AWAITING }] },
                select: ['id', 'name', 'status', 'memberId', 'startDate', 'completionDate']
            });
    }

    /**
     * getMemberFinishedLists
     *
     * Retorna todas as listas finalizadas de um membro
     *
     * @param memberId - Id do membro
     * @returns Array com as listas finalizadas
     */
    public getMemberFinishedLists(memberId: string): Promise<List[]> {
        return this.getConnection()
            .getRepository(List)
            .find({ where: { memberId, status: EnumListStatus.FINISHED } });
    }

    /**
     * delete
     *
     * Remove uma lista pelo ID
     *
     * @param id - Id da lista
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(List).delete(id);
    }
}
