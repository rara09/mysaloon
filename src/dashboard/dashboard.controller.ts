import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService, Period } from './dashboard.service';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/enums';

@Controller('dashboard')
@Roles(UserRole.ADMIN, UserRole.STAFF)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Query('period') period?: Period) {
    return this.dashboardService.getDashboardStats(period || Period.DAY);
  }

  @Get('history')
  getHistory(@Query('period') period?: Period) {
    return this.dashboardService.getHistory(period || Period.WEEK);
  }
}

