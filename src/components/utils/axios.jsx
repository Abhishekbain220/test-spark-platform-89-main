import axios from "axios";

let instance=axios.create({
    baseURL:"https://onlinetestbackend-1a0p.onrender.com",
    withCredentials:true 
})

export default instance