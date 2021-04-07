export const DateFormatter = (date: Date | string) => {
  return new Date(date)
    .toLocaleString()
    .substr(0, 10)
    .split(' ')[0];
};
