import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { ExpenseCategory } from '../../entities/expense.entity';

export class CreateExpenseDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsDateString()
  expenseDate: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  receipt?: string;

  @IsInt()
  userId: number;
}

