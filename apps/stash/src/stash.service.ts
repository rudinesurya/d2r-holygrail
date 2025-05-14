import { Injectable } from '@nestjs/common';
import { StashRepository } from './stash.repository';

@Injectable()
export class StashService {
    constructor(private readonly stashRepository: StashRepository) { }

    async findAll(filter: any, sortOptions: Record<string, any> = {}, limit?: number) {
      return this.stashRepository.find(filter, sortOptions, limit);
    }
}