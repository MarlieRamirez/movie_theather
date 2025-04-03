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