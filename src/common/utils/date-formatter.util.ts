export const DateFormatter = (date: Date | string) => {
  console.log(
    new Date(date)
      .toLocaleString('ko-KR')
      .substr(0, 10)
      .split(' ')[0],
  );
  return new Date(date)
    .toLocaleString('ko-KR')
    .substr(0, 10)
    .split(' ')[0];
};
