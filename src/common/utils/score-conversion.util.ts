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

class ScoreCard extends AggregateResultResponse {}

/**
 * convert questions to score card
 * @param dto
 */
export const ScoreConversionUtil = (
  dto: AggregateResultResponseQueryDto,
): ScoreCard => {
  const scoreCard = new ScoreCard(dto);
  // age group grade
  if (
    scoreCard.ageGroupCode === AGE_GROUP.AGE_20 ||
    scoreCard.ageGroupCode === AGE_GROUP.AGE_30
  ) {
    scoreCard.ageGroupGrade = 1;
  } else if (
    scoreCard.ageGroupCode === AGE_GROUP.AGE_40 ||
    scoreCard.ageGroupCode === AGE_GROUP.AGE_50 ||
    scoreCard.ageGroupCode === AGE_GROUP.AGE_60_OVER
  ) {
    scoreCard.ageGroupGrade = 2;
  }
  // revenue grade
  if (
    (scoreCard.revenueRangeCode &&
      scoreCard.revenueRangeCode === REVENUE_RANGE.ABOVE_FIVE_THOUSAND) ||
    scoreCard.revenueRangeCode === REVENUE_RANGE.BETWEEN_THREE_AND_FIVE
  ) {
    scoreCard.revenueRangeGrade = 1;
  } else if (
    scoreCard.revenueRangeCode &&
    scoreCard.revenueRangeCode !== REVENUE_RANGE.ABOVE_FIVE_THOUSAND
  ) {
    scoreCard.revenueRangeGrade = 2;
  } else {
    scoreCard.revenueRangeGrade = null;
  }

  // delivery restaurant grade

  // if (dto.deliveryRatioCode === DELIVERY_OR_RESTAURANT.DELIVERY_SPACE_BEST) {
  //   scoreCard.deliveryRatioGrade = 1;
  // } else if (
  //   dto.deliveryRatioCode ===
  //   DELIVERY_OR_RESTAURANT.DELIVERY_SPACE_EQUAL_RESTAURANT
  // ) {
  //   scoreCard.deliveryRatioGrade = 2;
  // } else {
  //   scoreCard.deliveryRatioGrade = 3;
  // }

  if (
    scoreCard.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER &&
    scoreCard.isReadyCode === TENTATIVE_OPEN_OPTION.PREP_PROCESSING
  ) {
    scoreCard.isReadyGrade = 1;
  } else if (
    scoreCard.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER &&
    scoreCard.isReadyCode !== TENTATIVE_OPEN_OPTION.PREP_PROCESSING
  ) {
    scoreCard.isReadyGrade = 2;
  }

  return scoreCard;
};
