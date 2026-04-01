import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/enums';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<User> {
    if (createClientDto.email) {
      const existing = await this.userRepository.findOne({
        where: { email: createClientDto.email },
      });
      if (existing) throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create({
      email:
        createClientDto.email?.trim() ||
        `client+${Date.now()}@local.invalid`,
      password: '', // clients CRM créés en backoffice
      firstName: createClientDto.firstName,
      lastName: createClientDto.lastName,
      avatar: createClientDto.avatar,
      isActive: true,
      role: UserRole.CLIENT,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.CLIENT },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, role: UserRole.CLIENT },
    });
    if (!user) throw new NotFoundException(`Client with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateClientDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}

