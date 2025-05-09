import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, UserDto } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/common/dto/user/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDto) {
    return user;
  }
}
