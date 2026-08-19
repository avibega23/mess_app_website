import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../api/floor";
import { floorKeys } from "../queryKeys";

export const useGetFloors = (messId: string) => {
  return useQuery({
    queryKey: floorKeys.detail(messId),
    queryFn: () => getFloors(messId),
    enabled: !!messId,
  });
};
