import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecordDto, ItemDto, ITEMS_SERVICE, UpdateRecordDto, UserDto } from '@app/common';
import { RecordsRepository } from './records.repository';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UnverifiedItemException } from './unverified-item-exception';

@Injectable()
export class RecordsService {
  constructor(
    private readonly recordsRepository: RecordsRepository,
    @Inject(ITEMS_SERVICE) private readonly itemsService: ClientProxy,
  ) { }

  async create(
    createRecordDto: CreateRecordDto,
    { email, _id: userId }: UserDto,
  ) {
    const foundItem: ItemDto = await lastValueFrom(
      this.itemsService.send<ItemDto>('verify_item', {
        itemName: createRecordDto.itemName,
      }),
    );

    if (!foundItem) {
      throw new UnverifiedItemException('Item verification failed');
    }

    const timestamp = createRecordDto.dateOverride ? createRecordDto.dateOverride : new Date();
    const itemName = foundItem.itemName; // this will make sure the name is in correct cases as in database

    const { itemType, itemQuality } = foundItem;
    return this.recordsRepository.create({ ...createRecordDto, itemName, itemType, itemQuality, timestamp, userId });
  }

  async findAll(filter: any, sortOptions: Record<string, any> = {}, limit?: number) {
    return this.recordsRepository.find(filter, sortOptions, limit);
  }

  async count(filter: any): Promise<number> {
    return this.recordsRepository.count(filter);
  }

  async findOne(_id: string) {
    return this.recordsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateRecordDto) {
    return this.recordsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.recordsRepository.findOneAndDelete({ _id });
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.recordsRepository.aggregate(pipeline);
  }
}
