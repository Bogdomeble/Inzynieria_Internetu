import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TagConnectDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsUrl({ require_tld: false })
  @IsOptional()
  featuredImage?: string;

  @IsUUID()
  authorId: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagConnectDto)
  tags?: TagConnectDto[];
}
