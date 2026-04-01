import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { AppointmentStatus } from '../entities/enums';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';
import { AppointmentsGateway } from './appointments.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, UserRole } from '../entities/enums';

@Injectable()
export class AppointmentsService {
  // Fixed salon working hours
  private static readonly WORKING_START_MINUTES = 8 * 60; // 08:00
  private static readonly WORKING_END_MINUTES = 20 * 60; // 20:00

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly appointmentsGateway: AppointmentsGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const client = await this.userRepository.findOne({
      where: { id: dto.clientId, role: UserRole.CLIENT },
    });
    if (!client) {
      throw new NotFoundException(
        `Client with ID ${dto.clientId} not found (user role CLIENT)`,
      );
    }

    const service = await this.serviceRepository.findOne({
      where: { id: dto.serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${dto.serviceId} not found`);
    }

    const durationMinutes = service.duration ?? 60;
    if (!durationMinutes || durationMinutes <= 0) {
      throw new BadRequestException(
        'Service duration must be a positive number of minutes',
      );
    }

    const startMinutes = this.parseHHmmToMinutes(dto.startTime);
    const endMinutes = startMinutes + durationMinutes;

    if (startMinutes >= endMinutes) {
      throw new BadRequestException('Invalid appointment time range');
    }

    // Working hours rule
    if (
      startMinutes < AppointmentsService.WORKING_START_MINUTES ||
      endMinutes > AppointmentsService.WORKING_END_MINUTES
    ) {
      throw new BadRequestException(
        'Appointment is outside salon working hours (08:00 - 20:00)',
      );
    }

    const endTime = this.minutesToHHmm(endMinutes);

    // Prevent double booking (overlap check) for the same date and non-cancelled statuses
    const overlap = await this.appointmentRepository
      .createQueryBuilder('a')
      .select('a.id')
      .where('a.date = :date', { date: dto.date })
      .andWhere('a.status != :cancelled', {
        cancelled: AppointmentStatus.CANCELLED,
      })
      // overlap if existing.start < newEnd AND existing.end > newStart
      .andWhere('a.startTime < :newEnd', { newEnd: endTime })
      .andWhere('a.endTime > :newStart', { newStart: dto.startTime })
      .limit(1)
      .getRawOne();

    if (overlap) {
      throw new BadRequestException('Double booking: slot already taken');
    }

    const appointment = this.appointmentRepository.create({
      clientId: dto.clientId,
      serviceId: dto.serviceId,
      date: dto.date,
      startTime: dto.startTime,
      endTime,
      status: AppointmentStatus.PENDING,
      notes: dto.notes,
    });

    const saved = await this.appointmentRepository.save(appointment);
    const withRelations = await this.appointmentRepository.findOne({
      where: { id: saved.id },
      relations: ['client', 'service'],
    });
    if (withRelations) {
      this.appointmentsGateway.emitAppointmentCreated(withRelations);
      const title = 'Nouveau RDV';
      const body = `${withRelations.client?.firstName ?? ''} ${withRelations.client?.lastName ?? ''}`.trim()
        ? `${withRelations.client.firstName} ${withRelations.client.lastName} — ${withRelations.service?.name ?? 'Prestation'}`
        : `Nouveau rendez-vous — ${withRelations.service?.name ?? 'Prestation'}`;

      const notifs = await this.notificationsService.createForRoles({
        roles: [UserRole.ADMIN, UserRole.STAFF],
        type: NotificationType.APPOINTMENT_CREATED,
        title,
        body,
        data: { appointmentId: withRelations.id },
      });
      notifs.forEach((n) =>
        this.appointmentsGateway.emitNotificationCreatedToUser(n.userId, n),
      );
      return withRelations;
    }
    this.appointmentsGateway.emitAppointmentCreated(saved as Appointment);
    return saved;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['client', 'service'],
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'service'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async updateStatus(
    id: number,
    dto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'service'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const current = appointment.status;
    const next = dto.status;

    const canCancelAnytime = next === AppointmentStatus.CANCELLED;
    const canConfirm =
      current === AppointmentStatus.PENDING &&
      next === AppointmentStatus.CONFIRMED;
    const canComplete =
      current === AppointmentStatus.CONFIRMED &&
      next === AppointmentStatus.COMPLETED;

    if (!canCancelAnytime && !canConfirm && !canComplete) {
      throw new BadRequestException(
        `Invalid status transition: ${current} -> ${next}`,
      );
    }

    appointment.status = next;
    return this.appointmentRepository.save(appointment);
  }

  private parseHHmmToMinutes(hhmm: string): number {
    const [hh, mm] = hhmm.split(':').map((v) => parseInt(v, 10));
    return hh * 60 + mm;
  }

  private minutesToHHmm(totalMinutes: number): string {
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
}

