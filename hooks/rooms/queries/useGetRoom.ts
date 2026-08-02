import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "@/hooks/rooms/api/room";
import { roomKeys } from "../queryKeys";

export const useGetRoom = (id: string) => {
    return useQuery({
        queryKey: roomKeys.detail(id),
        queryFn: () => getRoomById(id),
        enabled: !!id,
    });
};
