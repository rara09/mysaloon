import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SaleItem } from './sale-item.entity';

export enum ProductCategory {
  HAIR = 'Hair',
  NAILS = 'Nails',
  AESTHETICS = 'Aesthetics',
  OTHER = 'Other',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
    default: ProductCategory.HAIR,
  })
  category: ProductCategory;

  @Column('decimal', { precision: 10, scale: 2 })
  costPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellingPrice: number;

  @Column({ default: 0 })
  stockLevel: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  lowStockAlert: boolean;

  @Column({ default: 5 })
  lowStockThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.product)
  saleItems: SaleItem[];
}

