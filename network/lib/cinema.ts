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

export function getAvailability(id: string) {
  return axiosClient().get('/seats?id=' + id)
}

export function setMovieData(id: number, movie: string, img: string, token:string) {
  if (token != '') {
    return axiosClient(token).put('/admin/movies/' + id, {
      movie: movie,
      img: img
    });
  }
}

export function setCapacity(id: number, rows: number, columns: number, token:string) {
  if (token != '') {
    return axiosClient(token).put('/admin/cinema/' + id, {
      rows: rows,
      columns: columns
    });
  }
}