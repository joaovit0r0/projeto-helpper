import crypto, { Cipher } from 'crypto';
import { key } from '../models/EnumCrypto';

export class EncryptionUtils {
    public static encrypt(iv: Buffer, payload: Buffer): string {
        const cipher: Cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encryptedData: Buffer = Buffer.concat([cipher.update(payload), cipher.final()]);
        return `${encryptedData.toString('hex')}`;
    }
}
