export const DeliverySpaceConversion = (deliveryRatio: number) => {
  let grade: number;
  if (deliveryRatio > 40) {
    grade = 1;
  } else if (deliveryRatio > 30 && deliveryRatio < 40) {
    grade = 2;
  } else {
    grade = 3;
  }

  return grade;
};
