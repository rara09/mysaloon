import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../entities/appointment.entity';
import { Service } from '../entities/service.entity';
import { AppointmentsGateway } from './appointments.gateway';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Service]),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsGateway],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

