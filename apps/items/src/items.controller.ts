import { Controller } from '@nestjs/common';
import { ItemsService } from './items.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern('verify_item')
  async verifyItem(@Payload() { itemName }: any) {
    return this.itemsService.verifyItem(itemName);
  }
}
