import { Resolver, Query, Args } from '@nestjs/graphql';
import { LedgeDto } from '@app/common';
import { StashService } from './stash.service';

@Resolver(() => LedgeDto)
export class StashResolver {
    constructor(private readonly stashService: StashService
    ) { }

    @Query(() => [LedgeDto], { name: 'stash' })
    async stash(
        @Args('userId', { type: () => String, nullable: true }) userId?: string
    ): Promise<any[]> {
        const filter: any = {};
        if (userId) {
            filter.userId = userId;
        }

        return this.stashService.findAll(filter);
    }
}