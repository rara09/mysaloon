import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Service } from './service.entity';
import { Sale } from './sale.entity';

export enum DebtStatus {
  UNPAID = 'IMPAYÉ',
  PARTIAL = 'PARTIEL',
  PAID = 'PAYÉ',
}

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({
    type: 'enum',
    enum: DebtStatus,
    default: DebtStatus.UNPAID,
  })
  status: DebtStatus;

  @ManyToOne(() => Client, (client) => client.debts)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  clientId: number;

  @ManyToOne(() => Service, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ nullable: true })
  serviceId: number;

  @ManyToOne(() => Sale, { nullable: true })
  @JoinColumn({ name: 'saleId' })
  sale: Sale;

  @Column({ nullable: true })
  saleId: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

