import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Service } from '../entities/service.entity';
import { Sale } from '../entities/sale.entity';
import { Expense } from '../entities/expense.entity';
import { Debt } from '../entities/debt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Sale, Expense, Debt])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

