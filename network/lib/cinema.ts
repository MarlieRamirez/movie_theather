import axiosClient from "../apiClient";

export function getFuture() {
  return axiosClient().get('/cinema');
}

export function getSchedules(id: string) {
  return axiosClient().get('/schedule?id=' + id);
}

export function getCinema(id: string) {
  return axiosClient().get('/cinema/' + id);
}

export function getAvailability(id:string){
  return axiosClient().get('/seats?id='+id)
}