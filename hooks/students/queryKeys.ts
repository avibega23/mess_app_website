export const studentKeys = {
    all: ["students"] as const,
    get: () => [...studentKeys.all, "get"] as const,
}  