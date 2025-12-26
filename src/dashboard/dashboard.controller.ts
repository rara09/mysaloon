import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService, Period } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
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

