import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { DebtStatus } from '../../entities/enums';

export class CreateDebtDto {
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsInt()
  clientId: number;

  @IsOptional()
  @IsInt()
  serviceId?: number;

  @IsOptional()
  @IsInt()
  saleId?: number;

  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}

