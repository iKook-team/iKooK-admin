export function capitalize(string?: string) {
  if (!string) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
}

export function toCamelCase(string?: string) {
  return string?.replace(string[0], string[0].toLowerCase()).replace(/\s/g, '');
}

export function fromCamelCase(string?: string) {
  return string?.replace(string[0], string[0].toUpperCase()).replace(/([A-Z])/g, ' $1');
}

export function fromSnakeCase(string?: string) {
  return string?.replace(/_/g, ' ');
}

export function fromSnakeOrCamelCase(string: string) {
  return fromCamelCase(fromSnakeCase(string));
}

export function truncateString(string: string, length: number, separator: string = '...') {
  return string.length > length ? `${string.slice(0, length)}${separator}` : string;
}
