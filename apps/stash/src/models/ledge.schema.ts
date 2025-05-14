import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class LedgeDocument extends AbstractDocument {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    itemName: string;

    @Prop({ required: true, default: 0 })
    count: number;
}

export const LedgeSchema = SchemaFactory.createForClass(LedgeDocument);