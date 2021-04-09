export const DateFormatter = (date: Date | string) => {
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  const year = new Date(date).getFullYear();

  return `${year}-${month}-${day}`;
};
