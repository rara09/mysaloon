import { IsNumber, Min } from 'class-validator';

export class PayDebtDto {
  @IsNumber()
  @Min(0)
  amount: number;
}

