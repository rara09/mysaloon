import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { AppointmentStatus } from '../../entities/enums';

export class CreateAppointmentDto {
  @IsInt()
  @Min(1)
  clientId: number;

  @IsInt()
  @Min(1)
  serviceId: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

