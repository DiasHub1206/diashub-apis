import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsAllowedEmail', async: false })
export class IsAllowedEmailConstraint
  implements ValidatorConstraintInterface
{
  allowedDomains = process.env.EMAIL_DOMAINS_INCLUDED?.split(',');

  email: string;

  validate(email: string) {
    this.email = email;

    if (this.allowedDomains) {
      return this.allowedDomains.some((allowedDomain) =>
        email.endsWith(allowedDomain),
      );
    }

    return true;
  }

  defaultMessage() {
    return `Provided email ${this.email} is not accepted`;
  }
}

export function IsAllowedEmail(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      propertyName,
      name: 'isAllowedEmail',
      target: object.constructor,
      options: validationOptions,
      validator: IsAllowedEmailConstraint,
    });
  };
}
