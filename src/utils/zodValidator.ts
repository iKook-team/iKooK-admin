import {
  z,
  ZodArray,
  ZodBoolean,
  ZodDefault,
  ZodEffects,
  ZodEnum,
  ZodLiteral,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRawShape,
  ZodRecord,
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
                : T[K] extends ZodRecord<any>
                  ? Record<string, any>
                  : T[K] extends ZodEnum<any>
                    ? T[K]['_def']['values'][number]
                    : T[K] extends ZodUnion<any>
                      ? z.infer<T[K]>
                      : T[K] extends ZodLiteral<any>
                        ? T[K]['_def']['value']
                        : null;
};

// New: Helper to unwrap ZodEffects if wrapped
function unwrapEffects(schema: any): any {
  while (schema instanceof ZodEffects) {
    schema = schema._def.schema;
  }
  return schema;
}

export const extractInitialValues = <T extends ZodRawShape>(
  schema: ZodObject<T> | ZodEffects<ZodObject<T>>
): InitialValues<T> => {
  const unwrapped = unwrapEffects(schema) as ZodObject<T>;
  const shape = unwrapped.shape;
  const initialValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(shape)) {
    const field = unwrapEffects(value);

    if (field instanceof ZodDefault) {
      initialValues[key] = field._def.defaultValue();
    } else if (field instanceof ZodOptional) {
      initialValues[key] = undefined;
    } else if (field instanceof ZodBoolean) {
      initialValues[key] = false;
    } else if (field instanceof ZodString) {
      initialValues[key] = '';
    } else if (field instanceof ZodNumber) {
      initialValues[key] = 0;
    } else if (field instanceof ZodArray) {
      initialValues[key] = [];
    } else if (field instanceof ZodObject) {
      initialValues[key] = extractInitialValues(field);
    } else if (field instanceof ZodRecord) {
      initialValues[key] = {};
    } else if (field instanceof ZodEnum) {
      initialValues[key] = field._def.values[0]; // Pick first enum value as default
    } else if (field instanceof ZodLiteral) {
      initialValues[key] = field._def.value;
    } else if (field instanceof ZodUnion) {
      initialValues[key] = null; // Unions are tricky; default to null
    } else {
      initialValues[key] = null;
    }
  }

  return initialValues as InitialValues<T>;
};
