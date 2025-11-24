// composables/useApiClient.ts
export function useApiClient() {
  // On server, forward incoming cookies to internal /api calls
  const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;

  return $fetch.create({
    credentials: "include",
    headers,
  });
}
