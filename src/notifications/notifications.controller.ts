import { Controller, Get, Param, ParseIntPipe, Patch, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@Req() req) {
    return this.notificationsService.listForUser(Number(req.user.id));
  }

  @Patch(':id/read')
  markRead(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markRead(Number(req.user.id), id);
  }

  @Patch('read-all')
  markAllRead(@Req() req) {
    return this.notificationsService.markAllRead(Number(req.user.id));
  }
}

