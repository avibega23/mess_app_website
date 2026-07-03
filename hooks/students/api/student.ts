import { StudentPayload } from "@/types/auth/students.types";
import apiClient from "../../../lib/apiClient/client";


export const getStudents = async ()=>{
    const data:StudentPayload[]= 
    [   
        {
            username:"Avinoor Singh",
            mobileNo:"6239512160",
            roomNo:"621 A"
        },
        {
            username:"Keshav Babbar",
            mobileNo:"7814922310",
            roomNo:"621 B"
        }
    ]    
    return data;
}