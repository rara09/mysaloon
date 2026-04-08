import { IsBoolean, IsEnum, IsOptional, IsString, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { GalleryMediaKind } from '../../entities/enums';

export class CreateGalleryMediaDto {
  @IsEnum(GalleryMediaKind)
  kind: GalleryMediaKind;

  @IsString()
  title: string;

  /** URL externe optionnelle. Si absent, on utilise le fichier uploadé. */
  @IsOptional()
  @IsString()
  src?: string;

  /** Poster/preview optionnel (URL ou fichier uploadé). */
  @IsOptional()
  @IsString()
  poster?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

