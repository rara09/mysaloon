import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePublicAppointmentDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  serviceId: number;

  /** YYYY-MM-DD */
  @IsString()
  @IsNotEmpty()
  date: string;

  /** HH:mm */
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  /** Email facultatif. Si absent, un email technique est généré. */
  @IsOptional()
  @IsString()
  email?: string;

  /** Numéro WhatsApp / téléphone (recommandé pour recontact). */
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

