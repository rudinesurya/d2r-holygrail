import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StashRepository } from './stash.repository';
import { RECORDS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CronJobService implements OnModuleInit {
    private readonly logger = new Logger(CronJobService.name);

    constructor(
        @Inject(RECORDS_SERVICE) private readonly recordsService: ClientProxy,
        private readonly stashRepository: StashRepository,
    ) { }

    onModuleInit() {
        this.updateItemCounts(); // Run immediately on app start
    }

    @Cron(CronExpression.EVERY_10_SECONDS) // Runs every 10 seconds (adjust as needed)
    async updateItemCounts() {
        this.logger.log('Running cron job to update stash...');

        // Step 1: Aggregate counts from the records collection
        const aggregationPipeline = [
            {
                $group: {
                    _id: { userId: '$userId', itemName: '$itemName' },
                    count: { $sum: 1 },
                },
            },
        ];

        const aggregatedCounts: any[] = await lastValueFrom(
            this.recordsService.send<[]>('aggregate_records', aggregationPipeline),
        );

        // Step 2: Update the item_counts collection
        for (const { _id, count } of aggregatedCounts) {
            const { userId, itemName } = _id;

            await this.stashRepository.findOneAndUpdate(
                { userId, itemName },
                { $set: { count } }, // Set the new count
                { upsert: true }, // Create the document if it doesn't exist
            );
        }

        this.logger.log('Stash updated successfully.');
    }
}