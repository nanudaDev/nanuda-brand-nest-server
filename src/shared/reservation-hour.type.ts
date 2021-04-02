export enum RESERVATION_HOURS {
  TEN = '오전 10:00',
  ELEVEN = '오전 11:00',
  TWELVE = '오후 12:00',
  THIRTEEN = '오후 01:00',
  FOURTEEN = '오후 02:00',
  FIFTEEN = '오후 03:00',
  SIXTEEN = '오후 04:00',
  SEVENTEEN = '오후 05:00',
  EIGHTEEN = '오후 06:00',
}

export const CONST_RESERVATION_HOURS = Object.values(RESERVATION_HOURS);

export const RESERVATION_HOURS_JSON = [
  { value: RESERVATION_HOURS.TEN, available: true },
  { value: RESERVATION_HOURS.ELEVEN, available: true },
  { value: RESERVATION_HOURS.TWELVE, available: true },
  { value: RESERVATION_HOURS.THIRTEEN, available: true },
  { value: RESERVATION_HOURS.FOURTEEN, available: true },
  { value: RESERVATION_HOURS.FIFTEEN, available: true },
  { value: RESERVATION_HOURS.SIXTEEN, available: true },
  { value: RESERVATION_HOURS.SEVENTEEN, available: true },
  { value: RESERVATION_HOURS.EIGHTEEN, available: true },
];
