/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const Cryptr = require('cryptr');
/**
 * encrypt strings for URL parameters
 * @param code
 */
export const encryptString = (code: string) => {
  const crypts = new Cryptr(process.env.CRYPTR_KEY);

  const encrypted = crypts.encrypt(code);
  console.log(encrypted);
  return encrypted;
};

export const decryptString = (code: string) => {
  const crypts = new Cryptr(process.env.CRYPTR_KEY);
  return crypts.decrypt(code);
};
