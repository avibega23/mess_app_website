import axios from "axios";
import apiClient from "./client";

export interface LoginPayload {
    mobileNo: string;
    password: string;
}

export const loginUser = async (payload:LoginPayload) => {
    try {
        const response = {data:{token:"bega"}};
        return response.data;
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