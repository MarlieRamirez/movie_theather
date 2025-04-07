import axiosClient from "../apiClient";

export function login(user:string,pwd:string ){
    return axiosClient().post('/user/login',{
        user_name: user,
        pwd: pwd
    });
}

export function getUser(token:string){
    return axiosClient(token).get('/user')
}

export function getAllUsers(token:string){
  return axiosClient(token).get('/admin/users')
}

export function deleteUser(token:string, id:number){
  return axiosClient(token).delete('/admin/user/'+id)
}