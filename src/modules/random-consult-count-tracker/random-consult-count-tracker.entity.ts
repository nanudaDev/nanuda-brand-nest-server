import { Column, Entity } from 'typeorm';
import { YN } from '../../common/interfaces/yn.type';
import { BaseMapperEntity } from '../../core/base-mapper.entity';

@Entity({ name: 'random_consult_count_tracker' })
export class RandomConsultCountTracker extends BaseMapperEntity<
  RandomConsultCountTracker
> {
  @Column({
    type: 'int',
  })
  value: number;

  @Column({
    name: 'is_used_yn',
    type: 'char',
    default: () => YN.YES,
  })
  isUsedYn: YN;
}
