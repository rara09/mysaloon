import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

function withoutPassword(u: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = u as any;
  return rest;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepo.find({ order: { createdAt: 'DESC' } });
    return users.map(withoutPassword);
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return withoutPassword(user);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      avatar: dto.avatar,
      isActive: dto.isActive ?? true,
      role: dto.role,
    });
    const saved = await this.usersRepo.save(user);
    return withoutPassword(saved);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already exists');
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.email !== undefined) user.email = dto.email;
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.avatar !== undefined) user.avatar = dto.avatar;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.role !== undefined) user.role = dto.role;

    const saved = await this.usersRepo.save(user);
    return withoutPassword(saved);
  }

  async remove(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.usersRepo.remove(user);
    return { ok: true };
  }
}

