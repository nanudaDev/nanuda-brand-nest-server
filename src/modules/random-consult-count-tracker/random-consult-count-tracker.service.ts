import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../core/base.service';
import { RandomConsultCountTracker } from './random-consult-count-tracker.entity';
import { Repository } from 'typeorm';
import { AdminRandomConsultCountTrackerUpdateDto } from './dto';
import { YN } from 'src/common';

@Injectable()
export class RandomConsultCountTrackerService extends BaseService {
  constructor(
    @InjectRepository(RandomConsultCountTracker)
    private readonly randomTrackerRepo: Repository<RandomConsultCountTracker>,
  ) {
    super();
  }

  /**
   * update random consult count tracker for landing page
   * @param id
   * @param adminRandomConsultCountTrackerUpdateDto
   * @returns
   */
  async updateForAdmin(
    id: number,
    adminRandomConsultCountTrackerUpdateDto: AdminRandomConsultCountTrackerUpdateDto,
  ): Promise<RandomConsultCountTracker> {
    const tracker = await this.randomTrackerRepo.findOne(id);
    if (!tracker) throw new NotFoundException();
    let newTracker = new RandomConsultCountTracker(
      adminRandomConsultCountTrackerUpdateDto,
    );
    tracker.isUsedYn = YN.NO;
    await this.randomTrackerRepo.save(tracker);
    return await this.randomTrackerRepo.save(newTracker);
  }
}
