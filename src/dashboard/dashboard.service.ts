import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Service } from '../entities/service.entity';
import { Sale } from '../entities/sale.entity';
import { Expense } from '../entities/expense.entity';
import { Debt } from '../entities/debt.entity';
import { DebtStatus } from '../entities/enums';

export enum Period {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Debt)
    private debtRepository: Repository<Debt>,
  ) {}

  private getDateRange(period: Period): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case Period.DAY:
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case Period.WEEK:
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case Period.MONTH:
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case Period.YEAR:
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }

  async getDashboardStats(period: Period = Period.DAY) {
    const { start, end } = this.getDateRange(period);

    // Total Revenue (Services + Sales)
    const servicesRevenue = await this.serviceRepository
      .createQueryBuilder('service')
      .select('SUM(service.amount)', 'total')
      .where('service.serviceDate BETWEEN :start AND :end', { start, end })
      .getRawOne();

    const salesRevenue = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.totalAmount)', 'total')
      .where('sale.createdAt BETWEEN :start AND :end', { start, end })
      .getRawOne();

    const totalRevenue =
      (parseFloat(servicesRevenue?.total) || 0) +
      (parseFloat(salesRevenue?.total) || 0);

    // Services count
    const servicesCount = await this.serviceRepository.count({
      where: {
        serviceDate: Between(start, end),
      },
    });

    // Product sales total
    const productSalesTotal = parseFloat(salesRevenue?.total) || 0;

    // Client debts
    const clientDebts = await this.debtRepository
      .createQueryBuilder('debt')
      .select('SUM(debt.totalAmount - debt.paidAmount)', 'total')
      .where('debt.status != :status', { status: DebtStatus.PAID })
      .getRawOne();

    const debtsTotal = parseFloat(clientDebts?.total) || 0;

    // Expenses
    const expenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.expenseDate BETWEEN :start AND :end', { start, end })
      .getRawOne();

    const expensesTotal = parseFloat(expenses?.total) || 0;

    // Profit
    const profit = totalRevenue - expensesTotal;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    // Recent activities
    const recentServices = await this.serviceRepository.find({
      where: {
        serviceDate: Between(start, end),
      },
      relations: ['stylist', 'client'],
      order: { serviceDate: 'DESC' },
      take: 5,
    });

    const recentSales = await this.saleRepository.find({
      where: {
        createdAt: Between(start, end),
      },
      relations: ['user', 'client', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalRevenue,
      servicesCount,
      productSales: productSalesTotal,
      clientDebts: debtsTotal,
      expenses: expensesTotal,
      profit,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      recentActivities: [
        ...recentServices.map((s) => ({
          type: 'service',
          id: s.id,
          name: s.name,
          amount: s.amount,
          date: s.serviceDate,
          stylist: s.stylist ? `${s.stylist.firstName} ${s.stylist.lastName}` : null,
          client: s.client ? `${s.client.firstName} ${s.client.lastName}` : null,
        })),
        ...recentSales.map((s) => ({
          type: 'sale',
          id: s.id,
          name: 'Vente Produits',
          amount: s.totalAmount,
          date: s.createdAt,
          client: s.client ? `${s.client.firstName} ${s.client.lastName}` : 'Anonyme',
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10),
    };
  }

  async getHistory(period: Period = Period.WEEK) {
    const { start, end } = this.getDateRange(period);

    const services = await this.serviceRepository.find({
      where: {
        serviceDate: Between(start, end),
      },
      relations: ['stylist', 'client'],
      order: { serviceDate: 'DESC' },
    });

    const sales = await this.saleRepository.find({
      where: {
        createdAt: Between(start, end),
      },
      relations: ['user', 'client', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    const expenses = await this.expenseRepository.find({
      where: {
        expenseDate: Between(start, end),
      },
      relations: ['user'],
      order: { expenseDate: 'DESC' },
    });

    return {
      services,
      sales,
      expenses,
    };
  }
}

