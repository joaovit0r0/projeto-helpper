import { Entity, ObjectID, ObjectIdColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity } from 'typeorm';

import crypto from 'crypto';

import { EnumCrypto } from '../../../models/EnumCrypto';

@Entity()
export class User extends BaseEntity {
    @ObjectIdColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: ObjectID;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @Column()
    public initializationVector: Buffer;

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
        const iv = Buffer.from(crypto.randomBytes(16));
        console.log(iv);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(EnumCrypto.KEY), iv);
        let encrypted = cipher.update(this.password);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        this.password = encrypted.toString('hex');
        this.initializationVector = iv;
    }
}
