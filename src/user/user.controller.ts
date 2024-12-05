import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/jwt-auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserEntity } from '@prisma/client';
import { User } from '../auth/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: UserEntity) {
    if (user.id !== parseInt(id)) {
      throw new ForbiddenException('You are not authorized to view this user');
    }
    const foundUser = await this.userService.findOne(id);
    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }
    return foundUser;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ) {
    if (user.id !== parseInt(id)) {
      throw new ForbiddenException(
        'You are not authorized to update this user',
      );
    }
    const updatedUser = await this.userService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new UnauthorizedException('Failed to update user');
    }
    return updatedUser;
  }
}
