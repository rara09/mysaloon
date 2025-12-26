import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt, DebtStatus } from '../entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PayDebtDto } from './dto/pay-debt.dto';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private debtRepository: Repository<Debt>,
  ) {}

  async create(createDebtDto: CreateDebtDto): Promise<Debt> {
    const debt = this.debtRepository.create({
      ...createDebtDto,
      paidAmount: 0,
      status: DebtStatus.UNPAID,
    });
    return this.debtRepository.save(debt);
  }

  async findAll(status?: DebtStatus): Promise<Debt[]> {
    const where = status ? { status } : {};
    return this.debtRepository.find({
      where,
      relations: ['client', 'service', 'sale'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Debt> {
    const debt = await this.debtRepository.findOne({
      where: { id },
      relations: ['client', 'service', 'sale'],
    });
    if (!debt) {
      throw new NotFoundException(`Debt with ID ${id} not found`);
    }
    return debt;
  }

  async update(id: number, updateDebtDto: UpdateDebtDto): Promise<Debt> {
    const debt = await this.findOne(id);
    Object.assign(debt, updateDebtDto);
    return this.debtRepository.save(debt);
  }

  async payDebt(id: number, payDebtDto: PayDebtDto): Promise<Debt> {
    const debt = await this.findOne(id);

    if (debt.status === DebtStatus.PAID) {
      throw new BadRequestException('Debt is already fully paid');
    }

    const newPaidAmount = debt.paidAmount + payDebtDto.amount;

    if (newPaidAmount > debt.totalAmount) {
      throw new BadRequestException('Payment amount exceeds total debt');
    }

    debt.paidAmount = newPaidAmount;

    if (newPaidAmount === debt.totalAmount) {
      debt.status = DebtStatus.PAID;
    } else if (newPaidAmount > 0) {
      debt.status = DebtStatus.PARTIAL;
    }

    return this.debtRepository.save(debt);
  }

  async remove(id: number): Promise<void> {
    const debt = await this.findOne(id);
    await this.debtRepository.remove(debt);
  }

  async getTotalDebts(): Promise<number> {
    const result = await this.debtRepository
      .createQueryBuilder('debt')
      .select('SUM(debt.totalAmount - debt.paidAmount)', 'total')
      .where('debt.status != :status', { status: DebtStatus.PAID })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getClientsWithDebts(): Promise<number> {
    return this.debtRepository
      .createQueryBuilder('debt')
      .select('COUNT(DISTINCT debt.clientId)', 'count')
      .where('debt.status != :status', { status: DebtStatus.PAID })
      .getRawOne()
      .then((result) => parseInt(result.count) || 0);
  }
}

