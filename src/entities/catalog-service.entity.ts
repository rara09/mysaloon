import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceType } from './enums';

@Entity('catalog_services')
export class CatalogServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'int', default: 60 })
  duration: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ nullable: true })
  image: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
