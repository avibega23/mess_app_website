import { ApiResponse, Paginated } from "@/types/common/api.types";
import {
  RegisterStudentRequest,
  Student,
  StudentFilters,
  UpdateStudentRequest,
} from "@/types/students/student.types";
import { Bill } from "@/types/bills/bill.types";
import apiClient from "@/lib/apiClient/client";

export const getStudents = async (
  filters: StudentFilters = {}
): Promise<Paginated<Student>> => {
  const { data } = await apiClient.get<ApiResponse<Paginated<Student>>>("clerk/students", { params: filters });

  return data.data;
};

export const getStudentById = async (id: string): Promise<Student> => {
  const { data } = await apiClient.get<ApiResponse<Student>>(`/clerk/students/${id}`);
  return data.data;
};

export const getStudentBills = async (studentId: string): Promise<Bill[]> => {
  const { data } = await apiClient.get<ApiResponse<Bill[]>>(`/clerk/students/${studentId}/bills`);
  return data.data;
};

export const registerStudent = async (
  payload: RegisterStudentRequest
) => {
  await apiClient.post("/clerk/register", payload);
};

export const updateStudent = async (
  id: string,
  payload: UpdateStudentRequest
): Promise<Student> => {
  const { data } = await apiClient.patch<ApiResponse<Student>>(`/clerk/students/${id}`, payload);
  return data.data;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await apiClient.delete(`/clerk/students/${id}`);
};

export const clearAllStudents = async (): Promise<void> => {
  await apiClient.delete("/clerk/students");
};
