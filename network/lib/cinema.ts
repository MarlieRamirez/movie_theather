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

export function getAdminCinemas(token:string) {
  return axiosClient(token).get('/admin/cinema/');
}

export function newCinema(formValues: {name: string, rows: number, columns:number, movie: string, img_url: string}, token:string) {
  if (token != '') {
    return axiosClient(token).post('/admin/cinema/', {
      name: formValues.name,
      rows: formValues.rows,
      columns: formValues.columns,
      movie: formValues.movie,
      img: formValues.img_url
      
    });
  }
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

export function deleteCinema(token:string, id:number){
  return axiosClient(token).delete('/admin/cinema/'+id)
}

export function saveSeat(token:string, seat: Seat){
  return axiosClient(token).post('/seats',seat)
}