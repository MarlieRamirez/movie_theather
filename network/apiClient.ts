import axios from 'axios';

const axiosClient = (token?:string) => axios.create({
    baseURL: process.env.API || 'http://localhost:3001/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization' : 'Bearer '+token 
    },
});

axiosClient().interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        let res = error.response;
        if (res.status == 401) {
            window.location.href = 'https://localhost:3000/login';
        }
        console.error('Looks like there was a problem. Status Code: ' + res.status);
        return Promise.reject(error);
    }
)

export default axiosClient;