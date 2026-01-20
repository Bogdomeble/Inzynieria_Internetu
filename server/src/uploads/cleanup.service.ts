import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly uploadDir = './uploads';

  constructor(private prisma: PrismaService) {}

  // Uruchamiaj codziennie o 4:00 rano
  // @Cron(CronExpression.EVERY_DAY_AT_4AM)
@Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.debug('Running orphan file cleanup...');

    try {
      // Pobierz wszystkie pliki z dysku
      const filesOnDisk = fs.readdirSync(this.uploadDir);

      if (filesOnDisk.length === 0) {
        this.logger.debug('No files to check.');
        return;
      }

      const posts = await this.prisma.post.findMany({
        where: {
          featuredImage: {
            not: null,
          },
        },
        select: {
          featuredImage: true,
        },
      });

      // Wyciągnij same nazwy plików z URL-i w bazie

      const activeFilenames = new Set(
        posts.map((post) => {
          if (!post.featuredImage) return '';
          return path.basename(post.featuredImage);
        }),
      );

      let deletedCount = 0;

      for (const file of filesOnDisk) {
        // Pomiń pliki systemowe
        if (file.startsWith('.')) continue;

        const filePath = path.join(this.uploadDir, file);

        // Jeśli plik jest w bazie, zostaw go
        if (activeFilenames.has(file)) {
          continue;
        }

        
        // Jeśli obraz jest młodszy niż 10 minut, NIE usuwamy go.
        const stats = fs.statSync(filePath);
        const now = new Date().getTime();
        const fileAgeInMs = now - stats.mtime.getTime();
        const gradePeriodInMs = 60 * 60 * 1000;

        if (fileAgeInMs < gradePeriodInMs) {
          continue;
        }

        fs.unlinkSync(filePath);
        this.logger.log(`Deleted orphan file: ${file}`);
        deletedCount++;
      }

      this.logger.debug(`Cleanup finished. Deleted ${deletedCount} files.`);
    } catch (error) {
      this.logger.error('Error during file cleanup', error);
    }
  }
}
