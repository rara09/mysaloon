import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ServiceType, PaymentMethod } from '../../entities/service.entity';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsEnum(ServiceType)
  type: ServiceType;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsDateString()
  serviceDate: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsInt()
  stylistId: number;

  @IsOptional()
  @IsInt()
  clientId?: number;
}

