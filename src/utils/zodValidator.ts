import {
  z,
  ZodArray,
  ZodBoolean,
  ZodDefault,
  ZodEnum,
  ZodLiteral,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRawShape,
  ZodSchema,
  ZodString,
  ZodUnion
} from 'zod';

export const withZodSchema = (schema: ZodSchema) => (values: any) => {
  const result = schema.safeParse(values);

  if (result.success) {
    return {};
  } else {
    const errors: { [key: string]: string } = {};
    result.error.errors.forEach((issue) => {
      const path = issue.path[0];
      if (path) {
        errors[path] = issue.message;
      }
    });
    return errors;
  }
};

// Helper type to extract initial values type from a Zod schema
type InitialValues<T extends ZodRawShape> = {
  [K in keyof T]: T[K] extends ZodDefault<any>
    ? ReturnType<T[K]['_def']['defaultValue']>
    : T[K] extends ZodOptional<any>
      ? undefined
      : T[K] extends ZodBoolean
        ? boolean
        : T[K] extends ZodString
          ? string
          : T[K] extends ZodNumber
            ? number
            : T[K] extends ZodArray<any>
              ? Array<z.infer<T[K]['element']>>
              : T[K] extends ZodObject<any>
                ? InitialValues<T[K]['shape']>
                : T[K] extends ZodEnum<any>
                  ? T[K]['options'][number]
                  : T[K] extends ZodUnion<any>
                    ? z.infer<T[K]>
                    : T[K] extends ZodLiteral<any>
                      ? T[K]['value']
                      : null;
};

export const extractInitialValues = <T extends ZodRawShape>(
  schema: ZodObject<T>
): InitialValues<T> => {
  const shape = schema.shape;
  const initialValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof ZodDefault) {
      initialValues[key] = value._def.defaultValue();
    } else if (value instanceof ZodOptional) {
      initialValues[key] = undefined;
    } else if (value instanceof ZodBoolean) {
      initialValues[key] = false;
    } else if (value instanceof ZodString) {
      initialValues[key] = '';
    } else if (value instanceof ZodNumber) {
      initialValues[key] = 0;
    } else if (value instanceof ZodArray) {
      initialValues[key] = [];
    } else if (value instanceof ZodObject) {
      initialValues[key] = extractInitialValues(value);
    } else {
      initialValues[key] = null;
    }
  }

  return initialValues as InitialValues<T>;
};
