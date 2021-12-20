import bcrypt from 'bcrypt';

/**
 * StringUtils
 *
 * Classe de utils para tratamento de strings
 */
export class StringUtils {
    /**
     * firstUpperCase
     *
     * Deixa a primeira letra de uma string em maiúsculo
     *
     * @param text - Texto a ser manipulado
     *
     * @returns Texto tratado
     */
    public static firstUpperCase(text: string): string {
        if (text) {
            const strings: string[] = text.split(' ');

            strings.forEach((value: string, index: number) => {
                strings[index] = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            });

            return strings.join(' ').trim();
        }

        return text;
    }

    /**
     * firstLowerCase
     *
     * Deixa a primeira letra de uma string em minúsculo
     *
     * @param text - Texto a ser manipulado
     *
     * @returns Texto tratado
     */
    public static firstLowerCase(text: string): string {
        if (text) {
            const strings: string[] = text.split(' ');

            strings.forEach((value: string, index: number) => {
                strings[index] = value.charAt(0).toLowerCase() + value.slice(1);
            });

            return strings.join(' ').trim();
        }

        return text;
    }

    /**
     * hashString
     *
     * Recebe uma string e retorna uma hash dessa string
     *
     * @param text Texto para ser transformado em hash
     * @returns String contendo a hash
     */
    public static async hashString(text: string): Promise<string> {
        const saltRounds: string = process.env.BCRYPT_SALT_ROUNDS || '10';
        const salt: string = await bcrypt.genSalt(+saltRounds);
        return bcrypt.hash(text, salt);
    }

    /**
     * generateRandomSuffix
     *
     * Gera uma string aleatória e a retorna
     *
     * @returns String aleatória
     */
    public static generateRandomSuffix(): string {
        return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    }
}
