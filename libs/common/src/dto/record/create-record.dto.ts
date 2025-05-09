import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOverride: Date;

  @IsOptional()
  @IsBoolean()
  ethereal: boolean;
}
