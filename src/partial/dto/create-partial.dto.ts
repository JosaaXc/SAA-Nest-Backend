import { IsEnum, IsString, Validate } from "class-validator";
import { Partials } from "../interfaces/partials.interfaces.dto";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';


@ValidatorConstraint({ name: 'IsDateRange', async: false })
export class IsDateRange implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value !== relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `startDate and ${relatedPropertyName} cannot be the same`;
    }
}

export class CreatePartialDto {

    @IsEnum(Partials)
    partial: string;
    
    @IsString()
    @Validate(IsDateRange, ['finishDate'])
    startDate: string;
    
    @IsString()
    finishDate: string;
}