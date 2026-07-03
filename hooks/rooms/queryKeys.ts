import { RoomFilters } from "@/types/rooms/room.types";

export const roomKeys = {
    all: ["rooms"] as const,
    list: (filters: RoomFilters) => [...roomKeys.all, "list", filters] as const,
    detail: (id: string) => [...roomKeys.all, "detail", id] as const,
}
