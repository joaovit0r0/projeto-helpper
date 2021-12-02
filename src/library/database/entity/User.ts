import { Entity, ObjectID, ObjectIdColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity } from 'typeorm';

import crypto from 'crypto';

import { EncryptionUtils } from '../../../utils/EncryptionUtils';

@Entity()
export class User extends BaseEntity {
    @ObjectIdColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: ObjectID;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

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
    public encrypt(): void {
        const iv: Buffer = Buffer.from(crypto.randomBytes(16));
        const encryptedData: string = EncryptionUtils.encrypt(iv, Buffer.from(this.password));
        this.password = `${iv.toString('hex')}:${encryptedData}`;
    }
}
