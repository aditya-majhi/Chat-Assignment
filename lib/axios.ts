import Axios from "axios";

export const axiosAPI = Axios.create({
    baseURL: "/api",
    withCredentials: true,
});