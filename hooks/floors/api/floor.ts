import apiClient from "@/lib/apiClient/client"
import { FloorData } from "@/types/auth/auth.types"
import { ApiResponse } from "@/types/common/api.types";


export const getFloors = async (messId: string) => {
  const { data } = await apiClient.get<ApiResponse<FloorData[]>>(`clerk/floors/${messId}`);
  return data.data;
}
