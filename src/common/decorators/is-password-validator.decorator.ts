import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsPassword = (validationOptions?: ValidationOptions) => {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: '비밀번호가 너무 약합니다. 다른 비밀번호를 입력해주세요',
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          if (!value) {
            return false;
          }
          const regexIt = value.match(
            /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=]).*$/,
          );
          if (!regexIt) return false;
          return true;
        },
      },
    });
  };
};
