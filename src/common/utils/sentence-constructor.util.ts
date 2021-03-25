import { RemoveDuplicateObject } from '.';

export const SentenceConstructor = (response: any[]) => {
  const sameCategory = [];
  const modResponse = RemoveDuplicateObject(response, 'modifiedSufSentence');
  modResponse.map(mod => {
    sameCategory.push(mod.modifiedSufSentence);
  });
  sameCategory.map(same => {
    same.timeSlots = [];
  });
  return modResponse;
  //   return sameCategory;
};
