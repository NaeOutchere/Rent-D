import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/properties",
});

// Automatically attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getAvailableProperties = () => API.get("/");
export const getPropertyById = (id) => API.get(`/${id}`);

export const createProperty = (data) => API.post("/", data);
export const updateProperty = (id, data) => API.put(`/${id}`, data);
export const deleteProperty = (id) => API.delete(`/${id}`);

export const scheduleViewing = (id, data) => API.post(`/${id}/schedule`, data);

export const applyToRent = (id, data) => API.post(`/${id}/apply`, data);
