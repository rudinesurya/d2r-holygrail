import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class RecordDocument extends AbstractDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  userId: string;

  @Prop()
  itemName: string;

  @Prop()
  itemType: string;

  @Prop()
  itemQuality: string;

  @Prop()
  location: string;

  @Prop()
  ethereal: boolean;
}

export const RecordSchema = SchemaFactory.createForClass(RecordDocument);
