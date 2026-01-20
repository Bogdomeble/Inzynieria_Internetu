import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; 
import { join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import sharp from 'sharp'; 
@Controller('upload')
export class UploadsController {
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Plik trafia do RAM
      limits: {
        fileSize: 5 * 1024 * 1024, // Przyjmujemy nawet 5MB na wejściu
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not provided');
    }

    // Generujemy nazwę pliku z rozszerzeniem .webp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `image-${uniqueSuffix}.webp`;
    
    // (ServeStaticModule szuka plików)
    const filePath = join(process.cwd(), 'uploads', filename);

    try {
      // SHARP do kompresji
      await sharp(file.buffer)
        .resize({ 
            width: 1200, //  max 1200px 
            withoutEnlargement: true // Nie powiększamy małych obrazków
        })
        .webp({ quality: 80 }) // Kompresja do WebP (80% jakości)
        .toFile(filePath); 

      //  URL statyczny 
      return {
        url: `http://localhost:3001/uploads/${filename}`,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error processing image');
    }
  }
}