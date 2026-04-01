import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from '../../entities/enums';

export class CreateCatalogServiceDto {
  @IsString()
  name: string;

  @IsEnum(ServiceType)
  type: ServiceType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
