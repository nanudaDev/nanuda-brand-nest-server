export const DateFormatter = (date: Date | string) => {
  return new Date(date)
    .toLocaleString('ko-KR')
    .substr(0, 10)
    .split(' ')[0];
};
