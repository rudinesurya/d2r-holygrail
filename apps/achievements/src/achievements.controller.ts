import { Controller, Get, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) { }

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  async calculateProgress(@CurrentUser() user: UserDto) {
    return this.achievementsService.calculateProgress(user._id);
  }
}