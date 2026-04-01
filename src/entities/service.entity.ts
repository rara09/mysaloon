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
import { ServiceType, PaymentMethod } from './enums';
import { Expose } from 'class-transformer';

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

  // Duration in minutes (used by appointments scheduling)
  @Column({ type: 'int', default: 60 })
  duration: number;

  /* @ManyToOne(() => User, (user) => user.services, { nullable: true })
  @JoinColumn({ name: 'stylistId' })
  stylist: User;

  @Column()
  stylistId: number; */

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({ nullable: true })
  clientId: number;

  // guest client
  @Column({ nullable: true, default: 'Invité' })
  guestName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // getter for display name
  @Expose()
  get clientName(): string {
    if (this.client) {
      return `${this.client.firstName} ${this.client.lastName}`;
    }
    return this.guestName || 'Invité';
  }
}
