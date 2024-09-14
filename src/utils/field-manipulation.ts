export function removeFields<T extends object, K extends keyof T>(object: T, ...fields: K[]) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !fields.includes(key as K))
  ) as Omit<T, K>;
}

export function leaveFields<T extends object, K extends keyof T>(object: T, ...fields: K[]) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => fields.includes(key as K))
  ) as Pick<T, K>;
}
