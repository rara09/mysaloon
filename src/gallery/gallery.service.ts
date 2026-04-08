import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryMediaEntity } from '../entities/gallery-media.entity';
import { CreateGalleryMediaDto } from './dto/create-gallery-media.dto';
import { UpdateGalleryMediaDto } from './dto/update-gallery-media.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryMediaEntity)
    private readonly repo: Repository<GalleryMediaEntity>,
  ) {}

  findPublic() {
    return this.repo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  findAllManage() {
    return this.repo.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async create(dto: CreateGalleryMediaDto) {
    const row = this.repo.create({
      kind: dto.kind,
      title: dto.title,
      src: dto.src!,
      poster: dto.poster ?? null,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
    return this.repo.save(row);
  }

  async update(id: number, dto: UpdateGalleryMediaDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Gallery media ${id} not found`);
    (Object.keys(dto) as (keyof UpdateGalleryMediaDto)[]).forEach((k) => {
      const v = dto[k];
      if (v !== undefined) (row as any)[k] = v;
    });
    return this.repo.save(row);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Gallery media ${id} not found`);
    return { ok: true };
  }
}

