// composables/useApiClient.ts
export function useApiClient() {
  return $fetch.create({
    credentials: "include", // cookies for admin
  });
}
