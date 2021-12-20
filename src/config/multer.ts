import multer from 'multer';
import { Request } from 'express';

// Configuração de armazenamento do multer
const storage = multer.memoryStorage();

// Configuração de tratamento de arquivos do multer
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    // Separa quais rotas o multer deve tratar e dentro das rotas especificadas quais tipos de arquivos são aceitos
    if (req.path === '/v1/user/members') {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            // Sucesso
            cb(null, true);
        } else {
            // Formato de arquivo não aceito nessa rota
            cb(new Error('Invalid file type'));
        }
    } else {
        // A rota especificada não aceita upload de arquivos
        cb(new Error("The requested url doesn't accept file uploads"));
    }
};

const maxImageSize = process.env.MAX_IMAGE_SIZE as string;
// Tamanho padrão de 10 MB caso não seja informado nenhum valor
const maxFileSize: number = +maxImageSize || 10000000;

export const upload = multer({ storage, limits: { fileSize: maxFileSize }, fileFilter });
