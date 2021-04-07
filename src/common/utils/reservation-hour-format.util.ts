import { RESERVATION_HOURS } from 'src/shared';

export const ReservationHourFormat = (hour?: RESERVATION_HOURS): string => {
  if (hour === RESERVATION_HOURS.TEN) {
    return '10:00';
  } else if (hour === RESERVATION_HOURS.ELEVEN) {
    return '11:00';
  } else if (hour === RESERVATION_HOURS.TWELVE) {
    return '12:00';
  } else if (hour === RESERVATION_HOURS.THIRTEEN) {
    return '13:00';
  } else if (hour === RESERVATION_HOURS.FOURTEEN) {
    return '14:00';
  } else if (hour === RESERVATION_HOURS.FIFTEEN) {
    return '15:00';
  } else if (hour === RESERVATION_HOURS.SIXTEEN) {
    return '16:00';
  } else if (hour === RESERVATION_HOURS.SEVENTEEN) {
    return '17:00';
  } else if (hour === RESERVATION_HOURS.EIGHTEEN) {
    return '18:00';
  }
  return 'hour';
};
