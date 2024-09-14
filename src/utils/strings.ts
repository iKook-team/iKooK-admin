export function capitalize(string: string) {
  return string.replace(string[0], string[0].toUpperCase());
}

export function toCamelCase(string: string) {
  return string.replace(string[0], string[0].toLowerCase()).replace(/\s/g, '');
}

export function fromCamelCase(string: string) {
  return string.replace(string[0], string[0].toUpperCase()).replace(/([A-Z])/g, ' $1');
}
