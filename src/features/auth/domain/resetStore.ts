export default async function resetStore() {
  localStorage.clear();
  sessionStorage.clear();
  location.replace(location.origin);
}
