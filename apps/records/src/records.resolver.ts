import { Resolver, Query, Args } from '@nestjs/graphql';
import { RecordsService } from './records.service';
import { RecordDto } from '@app/common';

@Resolver(() => RecordDto)
export class RecordsResolver {
    constructor(private readonly recordsService: RecordsService) { }

    @Query(() => [RecordDto], { name: 'records' })
    async records(
        @Args('userId', { type: () => String, nullable: true }) userId?: string,
        @Args('sort', { type: () => String, nullable: true }) sort?: string, // Sort argument
        @Args('limit', { type: () => Number, nullable: true }) limit?: number, // Limit argument
    ): Promise<any[]> {
        const sortOptions = sort
            ? sort.startsWith('-')
                ? { [sort.substring(1)]: -1 } // Descending order
                : { [sort]: 1 } // Ascending order
            : {};
        if (userId) {
            return this.recordsService.findAllByUser(userId, sortOptions, limit);
        }
        return this.recordsService.findAll(sortOptions, limit);
    }
}