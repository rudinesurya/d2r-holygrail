import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CurrentUser, JwtAuthGuard, Roles } from '@app/common';
import { CreateRecordDto, UpdateRecordDto, UserDto } from '@app/common/dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.recordsService.create(createRecordDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.recordsService.findAll({});
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    return this.recordsService.update(id, updateRecordDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
