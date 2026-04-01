import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ProductCategory } from '../../entities/enums';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sellingPrice: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockLevel: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  lowStockAlert?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;
}
