import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { CleanupService } from './cleanup.service'; // czyszczenie
import { PrismaService } from '../prisma.service'; // baza danych

@Module({
  controllers: [UploadsController],
  providers: [CleanupService, PrismaService],
})
export class UploadsModule {}
