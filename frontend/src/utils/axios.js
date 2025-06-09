import axios from "axios";


const axiosInstance=axios.create({
    baseURL: "https://wayfarer-rj79.onrender.com/api/v1",    
    headers: {
        "Content-Type": "application/json",
    }
})

export default axiosInstance;