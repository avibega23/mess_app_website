import apiClient from "../client";


export const getStudents = async ()=>{
    const data = 
    [
        {
            name:"Avinoor Singh",
            password:"avibega123",
            mobileNo:"6239512160",
            email:"avinoor196@gmail.com"
        },
        {
            name:"Keshav Babbar",
            password:"keshav123",
            mobileNo:"7814922310",
            email:"keshavbabbar123@gmail.com"
        }
    ]
    return data;
}