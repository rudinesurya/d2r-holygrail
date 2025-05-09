import { Injectable, OnModuleInit } from '@nestjs/common';
import { ItemDocument } from './models/item.model';

// Import JSON files directly
import uniqueItemsData from '../data/uniqueitems.json';
import setItemsData from '../data/setitems.json';
import localeStringsData from '../data/localestrings-eng.json';

@Injectable()
export class ItemsService implements OnModuleInit {
  private items: ItemDocument[] = [];

  onModuleInit() {
    // Convert the object to an array and map the data
    const uniqueItems: ItemDocument[] = Object.values(uniqueItemsData)
      .filter((item: any) => item['enabled'] == undefined || item['enabled'] != 0) // Treat default value of 'enabled' as 1
      .filter((item: any) => item.code != null)
      .map((item: any) => ({
        _id: item['*ID'],
        itemName: localeStringsData[item.index] || item.index,
        itemType: localeStringsData[item.code],
        itemQuality: 'Unique',
      }));

    // Example for setItemsData (if it has a similar structure)
    const setItems: ItemDocument[] = Object.values(setItemsData)
      .filter((item: any) => item.item != null)
      .map((item: any) => ({
        _id: item['*ID'],
        itemName: localeStringsData[item.index] || item.index,
        itemType: localeStringsData[item.item],
        itemQuality: 'Set',
      }));

    this.items = [...uniqueItems, ...setItems];
  }

  findAll() {
    return this.items;
  }

  verifyItem(itemName: string): ItemDocument | null {
    if (!itemName) {
      return null; // Return null if itemName is undefined or null
    }

    const foundItem = this.items.find(item => item.itemName.toLowerCase() === itemName.toLowerCase());
    return foundItem || null;
  }
}