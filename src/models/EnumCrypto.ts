import crypto from 'crypto';

export const key: string = crypto.createHash('sha256').update('x12hdfu34pasb3uyga23bsdf3g44aske').digest('base64').substr(0, 32);
