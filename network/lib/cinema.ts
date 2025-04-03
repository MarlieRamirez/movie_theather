import axiosClient from "../apiClient";

export function getFuture(){
    return axiosClient().get('/cinema');
}

export function getSchedules(id:string){
    return axiosClient().get('/schedule?id='+ id);
}