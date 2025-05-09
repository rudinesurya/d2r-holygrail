import { ItemDto, RecordDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly configService: ConfigService
  ) { }

  private async fetchRecords(userId: string): Promise<RecordDto[]> {
    const query = `query ($userId: String!) { records(userId: $userId) { itemName } }`;
    const variables = { userId };
    try {
      const response = await fetch(this.configService.get('RECORDS_GRAPHQL_URL'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || 'Failed to fetch records');
      }
      return data.data.records;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  }

  private async fetchItems(): Promise<ItemDto[]> {
    const query = `query { items { itemName itemQuality } }`;
    try {
      const response = await fetch(this.configService.get('ITEMS_GRAPHQL_URL'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || 'Failed to fetch items');
      }
      return data.data.items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async calculateProgress(userId: string): Promise<{ progress: object; metadata: object }> {
    const totalItems: ItemDto[] = await this.fetchItems();
    const collectedItems: RecordDto[] = await this.fetchRecords(userId);
    const uniqueCollectedItemNames = Array.from(new Set(collectedItems.map(item => item.itemName)));

    if (totalItems.length === 0) {
      return { progress: { found: 0, total: 0 }, metadata: {} };
    }

    const uniqueItemsProgress = await this.calculateUniqueItemsProgress(uniqueCollectedItemNames, totalItems);
    const setItemsProgress = await this.calculateSetItemsProgress(uniqueCollectedItemNames, totalItems);

    return {
      progress: {
        found: uniqueItemsProgress["found"] + setItemsProgress["found"],
        total: uniqueItemsProgress["total"] + setItemsProgress["total"],
      },
      metadata: {
        uniqueItemsProgress: uniqueItemsProgress,
        setItemsProgress: setItemsProgress,
      }
    };
  }

  async calculateUniqueItemsProgress(uniqueCollectedItemNames: string[], totalItems: ItemDto[]): Promise<object> {
    const uniqueItems = totalItems.filter(item => item.itemQuality === 'Unique');
    const uniqueItemNames = uniqueItems.map(item => item.itemName);
    const collectedUniqueItems = uniqueItemNames.filter(name => uniqueCollectedItemNames.includes(name));

    return { found: collectedUniqueItems.length, total: uniqueItems.length };
  }

  async calculateSetItemsProgress(uniqueCollectedItemNames: string[], totalItems: ItemDto[]): Promise<object> {
    const setItems = totalItems.filter(item => item.itemQuality === 'Set');
    const setItemNames = setItems.map(item => item.itemName);
    const collectedSetItems = setItemNames.filter(name => uniqueCollectedItemNames.includes(name));

    return { found: collectedSetItems.length, total: setItems.length };
  }
}