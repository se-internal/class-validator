import { ValidationOptions } from "../ValidationOptions";
import { ValidationMetadataArgs } from "../../metadata/ValidationMetadataArgs";
import { ValidationTypes } from "../../validation/ValidationTypes";
import { ValidationMetadata } from "../../metadata/ValidationMetadata";
import { getMetadataStorage } from "../../metadata/MetadataStorage";

interface IsOptionalValidationOptions extends ValidationOptions {
    /**
     * If true, both `undefined` and `null` will be allowed inputs. If `false`,
     * only `undefined` will be an allowed input. Defaults to true.
     */
    nullable?: boolean;
}

/**
 * Checks if value is missing and if so, ignores all validators.
 */
export function IsOptional(
    validationOptions?: IsOptionalValidationOptions
): PropertyDecorator {
    validationOptions = { nullable: true, ...validationOptions };

    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [
                (object: any, value: any) =>
                    validationOptions.nullable
                        ? value !== undefined && value !== null
                        : object.hasOwnProperty(propertyName),
            ],
            validationOptions: validationOptions,
        };

        getMetadataStorage().addValidationMetadata(
            new ValidationMetadata(args)
        );
    };
}
