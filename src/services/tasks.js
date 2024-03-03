import axiosClient from "src/axios";

export const createTask = async (body) => {
  return await axiosClient.post("/api/tasks", body);
};
export const updateTask = async (id, body) => {
  return await axiosClient.put(`/api/tasks/${id}`, body);
};
export const deleteTask = async (id) => {
  return await axiosClient.delete(`/api/tasks/${id}`);
};

export const getTasks = async (month, year) => {
  return await axiosClient.get(`/api/tasks?month=${month}&year=${year}`);
};

export const getMonths = async () => {
  return await axiosClient.get("/api/tasks/months");
};
