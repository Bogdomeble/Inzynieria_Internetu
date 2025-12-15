import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  postId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string; // Dla zagnieżdżonych komentarzy (opcjonalne)
}
