import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationType, UserRole } from '../entities/enums';
import { User } from '../entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationsRepo: Repository<NotificationEntity>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  listForUser(userId: number) {
    return this.notificationsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markRead(userId: number, id: number) {
    const row = await this.notificationsRepo.findOne({ where: { id, userId } });
    if (!row) throw new NotFoundException('Notification not found');
    if (!row.readAt) row.readAt = new Date();
    return this.notificationsRepo.save(row);
  }

  async markAllRead(userId: number) {
    await this.notificationsRepo.update(
      { userId, readAt: IsNull() },
      { readAt: new Date() },
    );
    return { ok: true };
  }

  async createForRoles(params: {
    roles: UserRole[];
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
  }) {
    const users = await this.usersRepo.find({
      where: { isActive: true, role: In(params.roles) },
      select: ['id', 'email', 'role'],
    });
    if (!users.length) return [];

    const rows = users.map((u) =>
      this.notificationsRepo.create({
        userId: u.id,
        type: params.type,
        title: params.title,
        body: params.body,
        data: params.data ?? null,
        readAt: null,
      }),
    );
    return this.notificationsRepo.save(rows);
  }
}
