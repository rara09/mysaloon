import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PayDebtDto } from './dto/pay-debt.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DebtStatus } from '../entities/debt.entity';

@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @Get()
  findAll(@Query('status') status?: DebtStatus) {
    return this.debtsService.findAll(status);
  }

  @Get('total')
  getTotal() {
    return this.debtsService.getTotalDebts();
  }

  @Get('clients-count')
  getClientsCount() {
    return this.debtsService.getClientsWithDebts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtsService.update(+id, updateDebtDto);
  }

  @Put(':id/pay')
  payDebt(@Param('id') id: string, @Body() payDebtDto: PayDebtDto) {
    return this.debtsService.payDebt(+id, payDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtsService.remove(+id);
  }
}

