// Modules
import { TFilteredMember } from 'models';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { Member } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * MemberRepository
 *
 * Repositório para tabela de membros
 */
export class MemberRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Member;
    }

    /**
     * insert
     *
     * Adiciona um novo membro
     *
     * @param member - Dados do membro
     *
     * @returns Membro adicionado
     */
    public insert(member: DeepPartial<Member>): Promise<Member> {
        const userRepository: Repository<Member> = this.getConnection().getRepository(Member);
        return userRepository.save(userRepository.create(member));
    }

    /**
     * insert
     *
     * Altera um membro
     *
     * @param member - Dados do membro
     *
     * @returns Membro alterado
     */
    public update(member: Member): Promise<Member> {
        return this.getConnection().getRepository(Member).save(member);
    }

    /**
     * delete
     *
     * Remove um membro pelo ID
     *
     * @param id - ID do membro
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Member).delete(id);
    }

    /**
     * findByParentId
     *
     * Retorna uma lista com todos os membros de um parente
     *
     * @param parentId - Id do parente
     *
     * @returns Lista com todos os membros
     */
    public findByParentId(parentId: string): Promise<TFilteredMember[]> {
        return this.getConnection()
            .getRepository(Member)
            .find({ where: { parentId }, select: ['allowance', 'birthdate', 'id', 'photo', 'name'] });
    }
}
