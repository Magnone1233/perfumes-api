import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const fragranceImageUploadOptions = {
  storage: diskStorage({
    destination: (_request, _file, callback) => {
      const uploadPath = join(process.cwd(), 'uploads', 'fragrances');
      mkdirSync(uploadPath, { recursive: true });
      callback(null, uploadPath);
    },
    filename: (_request, file, callback) => {
      callback(
        null,
        `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
      );
    },
  }),
  fileFilter: (
    _request: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new BadRequestException(
          'Only JPG, PNG and WebP images are allowed.',
        ) as unknown as Error,
        false,
      );
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};