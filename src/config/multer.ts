import multer from 'multer';
import fs from 'fs';
import { Request } from 'express';

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
    destination(_req: Request, _file: Express.Multer.File, cb: (error: Error | null, str: string) => void): void {
        const path: string = process.env.IMAGES_PATH || '/uploads/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        cb(null, path);
    },
    filename(_req: Request, file: Express.Multer.File, cb: (error: Error | null, str: string) => void): void {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExtension = file.originalname.split('.').pop() as string;
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
    }
});

// Configuração de tratamento de arquivos do multer
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    // Separa quais rotas o multer deve tratar e dentro das rotas especificadas quais arquivos são aceitos
    switch (req.path) {
        case '/v1/user/members':
            console.log(file.mimetype);
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
                // Sucesso
                cb(null, true);
            } else {
                // Formato de arquivo não aceito nessa rota
                cb(new Error('Invalid file type'));
            }
            break;
        default:
            // A rota especificada não aceita upload de arquivos
            cb(new Error("The requested url doesn't accept file uploads"));
            break;
    }
};

const maxImageSize = process.env.MAX_IMAGE_SIZE as string;
// Tamanho padrão de 10 MB caso não seja informado nenhum valor
const maxFileSize: number = +maxImageSize || 10000000;

const test = multer.memoryStorage();
// , limits: { fileSize: maxFileSize }, fileFilter
export const upload = multer({ storage: test, fileFilter, limits: { fileSize: maxFileSize } });
