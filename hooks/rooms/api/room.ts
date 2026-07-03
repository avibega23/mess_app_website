import { RoomDetail, RoomFilters, RoomWithOccupancy } from "@/types/rooms/room.types";
import { delay, occupantsOf, rooms } from "@/lib/mock/db";

// Real backend swap: replace each function body with the commented apiClient call.
// import apiClient from "@/lib/apiClient/client";

export const getRooms = async (
    filters: RoomFilters = {}
): Promise<RoomWithOccupancy[]> => {
    // const { data } = await apiClient.get("/rooms", { params: filters });
    // return data;
    await delay();
    let result = rooms.map((room) => ({
        ...room,
        occupantCount: occupantsOf(room.id).length,
    }));
    if (filters.block) result = result.filter((r) => r.block === filters.block);
    if (filters.floor !== undefined) result = result.filter((r) => r.floor === filters.floor);
    if (filters.onlyVacant) result = result.filter((r) => r.occupantCount < r.capacity);
    return result;
};

export const getRoomById = async (id: string): Promise<RoomDetail> => {
    // const { data } = await apiClient.get(`/rooms/${id}`);
    // return data;
    await delay();
    const room = rooms.find((r) => r.id === id);
    if (!room) throw new Error("Room not found");
    return { ...room, occupants: occupantsOf(id).map((s) => ({ ...s })) };
};
