import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ItemDto {
    @Field(() => ID)
    _id: string;

    @Field()
    itemName: string;

    @Field()
    itemType: string;

    @Field()
    itemQuality: 'Unique' | 'Set';
}