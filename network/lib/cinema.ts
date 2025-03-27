import axiosClient from "../apiClient";

export function getFuture(){
    return axiosClient.get('/cinema');
}