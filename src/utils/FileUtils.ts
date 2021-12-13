import { Request, Response } from 'express';
import { unlinkSync, writeFileSync } from 'fs';
import { StringUtils } from './StringUtils';

/**
 * FileUtils
 *
 * Classe de utils para manipulação de arquivos
 */
export class FileUtils {
    /**
     * saveMulterImage
     *
     * Salva a imagem contida no req.file para a pasta declarada na variável global IMAGES_PATH ou, caso essa variavél não exista, para a pasta /uploads/
     *
     * @param req Request
     * @param res Response
     * @returns String com o nome do arquivo em caso de sucesso ou Null em caso de alguma falha
     */
    public static saveMulterImage(req: Request, res: Response): string | null {
        const fileBuffer = req.file?.buffer as Buffer;
        const path: string = process.env.IMAGES_PATH || '/uploads/';
        const uniqueSuffix: string = StringUtils.generateRandomSuffix();
        const fileExtension = req.file?.originalname.split('.').pop() as string;
        const filename = `${req.file?.fieldname}-${uniqueSuffix}.${fileExtension}`;
        const fullFilePath = `${path}${filename}`;

        try {
            writeFileSync(fullFilePath, fileBuffer, { encoding: 'base64', flag: 'wx' });
            return filename;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(500);
            res.json({
                status: false,
                date: new Date().toISOString(),
                error: "Couldn't save image"
            });
            return null;
        }
    }

    /**
     * deleteMulterImage
     *
     * Apaga um arquivo da pasta declarada na variável global IMAGES_PATH ou, caso essa variável não exista, da pasta /uploads/
     *
     * @param filename Nome do arquivo para ser excluído
     */
    public static deleteMulterImage(filename: string): void {
        const path: string = process.env.IMAGES_PATH || '/uploads/';
        // Apaga a foto do membro do armazenamento
        unlinkSync(path + filename);
    }
}
