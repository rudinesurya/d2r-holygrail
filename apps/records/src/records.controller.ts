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
import { response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @CurrentUser() user: UserDto,
  ) {
    const record = await this.recordsService.create(createRecordDto, user);

    return {
      message: "Create Record Success",
      data: {
        record
      }
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const records = await this.recordsService.findAll({});

    return {
      message: "Get Records Success",
      data: {
        records
      }
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const record = this.recordsService.findOne(id);
    if (!record) {
      response.status(404).json({
        message: "Get Record Failure"
      });
    }

    return {
      message: "Get Record Success",
      data: {
        record
      }
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    const record = await this.recordsService.update(id, updateRecordDto);
    if (!record) {
      response.status(404).json({
        message: "Update Record Failure"
      });
    }

    return {
      message: "Update Record Success",
      data: {
        record
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string) {
    const record = await this.recordsService.remove(id);
    if (!record) {
      response.status(404).json({
        message: "Remove Record Failure"
      });
    }

    return {
      message: "Remove Record Success",
      data: {
        record
      }
    }
  }

  @MessagePattern('aggregate_records')
  async aggregateRecords(@Payload() pipeline: any[]): Promise<any[]> {
    return this.recordsService.aggregate(pipeline);
  }
}
