import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RecordDto {
    @Field(() => ID)
    _id: string;

    @Field()
    timestamp: Date;

    @Field()
    userId: string;

    @Field()
    itemName: string;

    @Field()
    itemType: string;

    @Field()
    itemQuality: string;

    @Field()
    location: string;

    @Field()
    ethereal: boolean;
}