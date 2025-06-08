import axios from "axios";


const axiosInstance=axios.create({
    baseURL: "https://wayfarer-rj79.onrender.com",
    headers: {
        "Content-Type": "application/json",
    }
})

export default axiosInstance;