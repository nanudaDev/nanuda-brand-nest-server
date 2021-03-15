export const DeliverySpaceConversion = (deliveryRatio: number) => {
  let grade;
  if (deliveryRatio > 40) {
    grade = { grade: 1, key: 'deliveryData' };
  } else if (deliveryRatio > 30 && deliveryRatio < 40) {
    grade = { grade: 2, key: 'restaurantData' };
  } else {
    grade = { grade: 3, key: 'aggregateData' };
  }

  return grade;
};
