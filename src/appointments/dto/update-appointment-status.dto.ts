import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../entities/enums';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}

