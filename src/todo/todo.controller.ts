import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/jwt-auth/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './create-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@User() user, @Body() dto: CreateTodoDto) {
    return this.todoService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@User() user) {
    return this.todoService.findAll(user.id);
  }
}
