export function capitalize(string?: string, lowercaseRemaining: boolean = false) {
  if (!string) {
    return '';
  }
  return (
    string[0].toUpperCase() + (lowercaseRemaining ? string.slice(1).toLowerCase() : string.slice(1))
  );
}

export function capitalizeWords(string?: string) {
  return string
    ?.split(' ')
    .map((s) => capitalize(s))
    .join(' ');
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
