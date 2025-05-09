import { Resolver, Query, Args } from '@nestjs/graphql';
import { RecordsService } from './records.service';
import { RecordDto } from '@app/common';

@Resolver(() => RecordDto)
export class RecordsResolver {
    constructor(private readonly recordsService: RecordsService) { }

    @Query(() => [RecordDto], { name: 'records' })
    async records(@Args('userId', { type: () => String, nullable: true }) userId?: string): Promise<any[]> {
        if (userId) {
            return this.recordsService.findAllByUser(userId);
        }
        return this.recordsService.findAll();
    }
}