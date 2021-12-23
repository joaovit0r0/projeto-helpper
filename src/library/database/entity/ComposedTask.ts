import { Entity, ObjectID, ObjectIdColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity } from 'typeorm';

@Entity()
export class ComposedTask extends BaseEntity {
    @ObjectIdColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: ObjectID;

    @Column()
    public listId: string;

    @Column()
    public taskId: string;

    @Column()
    public value: number;

    @Column()
    public missed: boolean;

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

    @BeforeInsert()
    @BeforeUpdate()
    public checkValue(): void {
        this.value = Math.max(0, this.value);
    }
}
