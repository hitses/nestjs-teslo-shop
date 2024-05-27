import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = await this.userRepository.save({
        ...userData,
        password: bcrypt.hashSync(password, 12),
      });
      delete newUser.password;

      return { ...newUser, token: this.getJwt({ id: newUser.id }) };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      select: { email: true, password: true, id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new BadRequestException('Invalid credentials');

    const token = this.getJwt({ id: user.id });

    delete user.id;

    return {
      ...user,
      token,
    };
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwt({ id: user.id }),
    };
  }

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException();
  }
}
