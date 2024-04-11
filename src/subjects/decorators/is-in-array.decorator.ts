import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsInArray(allowedValues: any[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsInArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [allowedValues],
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          const [allowedValues] = args.constraints;
          return value ? value.every(val => allowedValues.includes(val)) : false; // check if value is not undefined before calling every
        },
      },
    });
  };
}