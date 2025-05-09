import { Resolver, Query } from '@nestjs/graphql';
import { ItemDto } from '@app/common';
import { ItemsService } from './items.service';

@Resolver(() => ItemDto)
export class ItemsResolver {
    constructor(private readonly itemsService: ItemsService) { }

    @Query(() => [ItemDto], { name: 'items' })
    async findAll(): Promise<any[]> {
        return this.itemsService.findAll();
    }
}