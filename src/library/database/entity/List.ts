import { Entity, ObjectID, ObjectIdColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity } from 'typeorm';

@Entity()
export class List extends BaseEntity {
    @ObjectIdColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: ObjectID;

    @Column()
    public name: string;

    @Column()
    public status: string;

    @Column()
    public memberId: string;

    @Column()
    public startDate: Date;

    @Column()
    public completionDate: Date;

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;

    @BeforeInsert()
    public setCreateDate(): void {
        this.createdAt = new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    public setUpdateDate(): void {
        this.updatedAt = new Date();
    }
}
