import { BaseDto } from 'src/core';
import { AggregateResultResponse } from 'src/modules/aggregate-result-response/aggregate-result-response.entity';
import { AggregateResultResponseQueryDto } from 'src/modules/aggregate-result-response/dto';
import {
  AGE_GROUP,
  DELIVERY_OR_RESTAURANT,
  FNB_OWNER,
  REVENUE_RANGE,
  TENTATIVE_OPEN_OPTION,
} from 'src/shared';

class ScoreCard extends BaseDto<ScoreCard>
  implements Partial<AggregateResultResponse> {
  deliveryRatioGrade: number;
  ageGroupGrade: number;
  isReadyGrade?: number;
  fnbOwnerStatus: FNB_OWNER;
  revenueRangeGrade?: number;
}

/**
 * convert questions to score card
 * @param dto
 */
export const ScoreConversionUtil = (dto: AggregateResultResponseQueryDto) => {
  const scoreCard = new ScoreCard(dto);
  // age group grade
  if (dto.ageGroupCode === AGE_GROUP.AGE_20 || AGE_GROUP.AGE_30) {
    scoreCard.ageGroupGrade = 1;
  }
  // revenue grade
  if (
    (dto.revenueRangeCode &&
      dto.revenueRangeCode === REVENUE_RANGE.ABOVE_FIVE_THOUSAND) ||
    REVENUE_RANGE.BETWEEN_THREE_AND_FIVE
  ) {
    scoreCard.revenueRangeGrade = 1;
  } else if (
    (dto.revenueRangeCode &&
      dto.revenueRangeCode !== REVENUE_RANGE.ABOVE_FIVE_THOUSAND) ||
    REVENUE_RANGE.BETWEEN_THREE_AND_FIVE
  ) {
    scoreCard.revenueRangeGrade = 2;
  } else {
    scoreCard.revenueRangeGrade = null;
  }

  // delivery restaurant grade

  if (dto.deliveryRatioCode === DELIVERY_OR_RESTAURANT.DELIVERY_SPACE_BEST) {
    scoreCard.deliveryRatioGrade = 1;
  } else if (
    dto.deliveryRatioCode ===
    DELIVERY_OR_RESTAURANT.DELIVERY_SPACE_EQUAL_RESTAURANT
  ) {
    scoreCard.deliveryRatioGrade = 2;
  } else {
    scoreCard.deliveryRatioGrade = 3;
  }

  if (
    dto.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER &&
    dto.isReadyCode === TENTATIVE_OPEN_OPTION.PREP_PROCESSING
  ) {
    scoreCard.isReadyGrade = 1;
  } else if (
    dto.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER &&
    dto.isReadyCode !== TENTATIVE_OPEN_OPTION.PREP_PROCESSING
  ) {
    scoreCard.isReadyGrade = 2;
  }

  console.log(scoreCard);
  return scoreCard;
};
