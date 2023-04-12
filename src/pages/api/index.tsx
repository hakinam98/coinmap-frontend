import axios from "axios";
import { AxiosResponse } from "axios";
import { User } from "../interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ILogin {
  user?: User;
  authToken?: string;
}

export const host = API_URL;

const API = axios.create({
  baseURL: host,
});

export const signUp = (FormData: {
  password: string;
  username: string;
  email: string;
}) => API.post("auth/signup", FormData);

export const login = (FormData: {
  email: string;
  password: string;
}): Promise<AxiosResponse<ILogin>> => API.post("auth/login", FormData);

export const getAllUsers = (
  authToken: string
): Promise<AxiosResponse<User[]>> =>
  API.get(`/users`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const deleteUser = (
  authToken: string,
  user_id: number
): Promise<AxiosResponse<String>> =>
  API.delete(`/users/${user_id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
