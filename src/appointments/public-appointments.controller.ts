import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { AppointmentsService } from './appointments.service';
import { CreatePublicAppointmentDto } from './dto/create-public-appointment.dto';

@Controller('public/appointments')
export class PublicAppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Public()
  create(@Body() dto: CreatePublicAppointmentDto) {
    return this.appointmentsService.createPublic(dto);
  }
}

