

export const floorKeys = {
  all: ["floors"] as const,
  detail: (messId: string) => [floorKeys.all, "detail", messId]
}
