import { AbstractDocument } from "@app/common";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class ItemDocument extends AbstractDocument {
    @Prop()
    itemName: string;

    @Prop()
    itemType: string;

    @Prop()
    itemQuality: string;
}