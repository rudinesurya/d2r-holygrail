import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { LedgeDocument } from './models/ledge.schema';

@Injectable()
export class StashRepository extends AbstractRepository<LedgeDocument> {
    protected readonly logger = new Logger(StashRepository.name);

    constructor(@InjectModel(LedgeDocument.name) model: Model<LedgeDocument>) {
        super(model);
    }
}