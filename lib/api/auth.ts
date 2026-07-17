import axios from "axios";
import apiClient from "../apiClient/client";
import { ApiResponse } from "@/types/common/api.types";
import { LoginResponse} from "@/types/auth/auth.types";

export interface LoginPayload {
    mobileNo: string;
    password: string;
}


export const loginUser = async (loginPayload: LoginPayload) => {
    try {
        const {data} = await apiClient.put<ApiResponse<LoginResponse>>("/clerk/login", loginPayload);
        return data.data;
    } catch (error) {
        if(axios.isAxiosError(error))
        {
            if(error.response)
            {
                throw new Error(error.response.data.message || "Login Failed");
            }

            if(error.request)
            {
                throw new Error("No response from server");
            }
        }

        throw new Error("An unexpected error occurred, Please try again!")
    }
}