export const RandomRevenueGenerator = () => {
  return Math.floor(Math.random() * (200 - 100 + 1) + 100).toString();
};

export const RandomTrajectoryGenerator = () => {
  return Math.floor(Math.random() * (20 - 10 + 1) + 10);
};
