import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/* exception.message {
  statusCode: 400,
  error: 'Bad Request',
  message: [
    ValidationError {
      target: [BuyerFindEmailDto],
      value: 'string',
      property: 'mobile',
      children: [],
      constraints: {
        isNotEmpty: 'first name should not be empty'
      }
    },
    ValidationError {
      target: [BuyerFindEmailDto],
      value: 'string',
      property: 'mobile',
      children: [],
      constraints: {
        IsCustomPhoneNumber: 'must be a valid mobile number'
      }
    }
  ]
} */

/* exception.message {
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    ValidationError {
      "property": "mobile",
      "children": [],
      "constraints": {
        "isCustomPhoneNumber": "Must be a valid mobile number"
      }
    },
    ValidationError {
      "property": "buyerCompany",
      "children": [
        {
          "property": "phone",
          "children": [],
          "constraints": {
            "isCustomPhoneNumber": "Must be a valid phone number"
          }
        }
      ]
    }
  ]
} */

/*
function messageValueStringToArray(message) {
  const result = {};
  Object.keys(message).forEach(key => {
    result[key] =
      typeof message[key] === 'string' ? [message[key]] : message[key];
  });
  return result;
}
*/

export class BrandAiException extends BaseException {
  /**
   * TODO: change syntex
   * @param message {
   *    email: { emailNotExist: `No user found for email.` },
   *  }
   * @param message {'email.notExist': `No user found for email`}
   * @param message 'email.notExist', `No user found for email`
   * @param message 'email', {'notExist': `No user found for email`}
   */
  // constructor(field: string, message: string | TemplateStringsArray);
  // constructor(message: { [field: string]: { [validatorName: string]: string | TemplateStringsArray } })
  // constructor(
  //   messages: string | {
  //     [field: string]: { [validatorName: string]: string | TemplateStringsArray }
  //   },
  // message?: string | TemplateStringsArray )
  constructor(code: string);
  constructor(code: string, value: object);
  constructor(code: string, message: string);
  constructor(code: string, message: string, value: object);
  constructor(code: string, message?: string | object, value?: object) {
    console.log(
      'brand-ai - exception',
      typeof code,
      typeof message,
      typeof value,
    );
    if (typeof message === 'string') {
      super(HttpStatus.NOT_ACCEPTABLE, code, message, value);
    } else if (typeof message === 'object') {
      super(HttpStatus.NOT_ACCEPTABLE, code, undefined, message);
    } else {
      super(HttpStatus.NOT_ACCEPTABLE, code, message, value);
    }
  }
}
