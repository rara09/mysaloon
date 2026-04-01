import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ServiceType, PaymentMethod } from '../../entities/enums';

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

  @IsOptional()
  @IsInt()
  // Duration of the service in minutes (used to compute appointment end time).
  duration?: number;

  @IsOptional()
  @IsInt()
  stylistId: number;

  @IsOptional()
  @IsInt()
  clientId?: number;

  @IsString()
  @IsOptional()
  guestName: string;
}
