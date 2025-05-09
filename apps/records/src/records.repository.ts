import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { RecordDocument } from './models/record.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RecordsRepository extends AbstractRepository<RecordDocument> {
  protected readonly logger = new Logger(RecordsRepository.name);

  constructor(
    @InjectModel(RecordDocument.name)
    recordModel: Model<RecordDocument>,
  ) {
    super(recordModel);
  }
}
