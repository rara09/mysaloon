import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogServiceEntity } from '../entities/catalog-service.entity';
import { CreateCatalogServiceDto } from './dto/create-catalog-service.dto';
import { UpdateCatalogServiceDto } from './dto/update-catalog-service.dto';

@Injectable()
export class CatalogServicesService {
  constructor(
    @InjectRepository(CatalogServiceEntity)
    private readonly repo: Repository<CatalogServiceEntity>,
  ) {}

  findPublic(): Promise<CatalogServiceEntity[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { type: 'ASC', name: 'ASC' },
    });
  }

  findAll(): Promise<CatalogServiceEntity[]> {
    return this.repo.find({
      order: { type: 'ASC', name: 'ASC' },
    });
  }

  async create(dto: CreateCatalogServiceDto): Promise<CatalogServiceEntity> {
    const row = this.repo.create({
      ...dto,
      duration: dto.duration ?? 60,
      isActive: dto.isActive ?? true,
    });
    return this.repo.save(row);
  }

  async update(
    id: number,
    dto: UpdateCatalogServiceDto,
  ): Promise<CatalogServiceEntity> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Catalog service ${id} not found`);
    (Object.keys(dto) as (keyof UpdateCatalogServiceDto)[]).forEach((key) => {
      const v = dto[key];
      if (v !== undefined) {
        (row as unknown as Record<string, unknown>)[key as string] = v as unknown;
      }
    });
    return this.repo.save(row);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected)
      throw new NotFoundException(`Catalog service ${id} not found`);
  }
}
