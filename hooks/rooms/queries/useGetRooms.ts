import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRooms } from "@/hooks/rooms/api/room";
import { roomKeys } from "../queryKeys";
import { RoomFilters } from "@/types/rooms/room.types";

interface UseGetRoomsOptions {
  enabled?: boolean;
}

export const useGetRooms = (filters: RoomFilters = {}, options: UseGetRoomsOptions = {}) => {
  return useQuery({
    queryKey: roomKeys.list(filters),
    queryFn: () => getRooms(filters),
    placeholderData: keepPreviousData,
    enabled: options.enabled,
  });
};
