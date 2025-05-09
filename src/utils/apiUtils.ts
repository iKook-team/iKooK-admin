export function formDataFromObject(data: object, parentKey = ''): FormData {
  const formData = new FormData();

  function appendFormData(key: string, value: any) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        appendFormData(`${key}[]`, item);
      });
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        appendFormData(`${key}[${subKey}]`, subValue);
      });
    } else {
      formData.append(key, value as string);
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;
    appendFormData(fullKey, value);
  });

  return formData;
}

export function arrayToString(array?: string[]): string {
  return array?.join(', ');
}
