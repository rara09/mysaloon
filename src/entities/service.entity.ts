import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Client } from './client.entity';

export enum ServiceType {
  TRESSES = 'Tresses',
  TISSAGE = 'Tissage',
  COUPE = 'Coupe',
  COLORATION = 'Coloration',
  ONGLERIE = 'Onglerie',
  AUTRE = 'Autre',
}

export enum PaymentMethod {
  CASH = 'Espèces',
  MOBILE_MONEY = 'Mobile Money',
  CREDIT = 'Crédit',
  CARD = 'Carte',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'datetime' })
  serviceDate: Date;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.services)
  @JoinColumn({ name: 'stylistId' })
  stylist: User;

  @Column()
  stylistId: number;

  @ManyToOne(() => Client, (client) => client.services, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ nullable: true })
  clientId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

