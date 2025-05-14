import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LedgeDto {
    @Field(() => ID)
    _id: string;

    @Field()
    userId: string;

    @Field()
    itemName: string;

    @Field()
    count: number;
}