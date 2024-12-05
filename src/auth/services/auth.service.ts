import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user.id };
    return { assess_token: this.jwtService.sign(payload) };
  }

  async register(dto: RegisterDto) {
    const heshedpassword = await bcrypt.hash(dto.password, 10);
    return this.userService.create({
      ...dto,
      password: heshedpassword,
    });
  }
}
