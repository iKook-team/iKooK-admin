export function formDataFromObject(data: object) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
    } else if (value) {
      formData.append(key, value as string);
    }
  });
  return formData;
}
