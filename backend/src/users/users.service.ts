import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

export interface CreateUserDto {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createOrUpdate(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.upsert({
      where: { googleId: dto.googleId },
      update: {
        name: dto.name,
        email: dto.email,
        avatar: dto.avatar,
      },
      create: {
        googleId: dto.googleId,
        email: dto.email,
        name: dto.name,
        avatar: dto.avatar,
      },
    });
  }

  async upsertDemoUser(params: {
    googleId: string;
    email: string;
    name: string;
  }): Promise<User> {
    return this.prisma.user.upsert({
      where: { googleId: params.googleId },
      update: { name: params.name, email: params.email },
      create: {
        googleId: params.googleId,
        email: params.email,
        name: params.name,
      },
    });
  }
}
