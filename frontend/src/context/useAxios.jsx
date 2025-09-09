import axios from "axios"
import { useContext } from "react"
import AuthContext from "./Authcontext"
import { jwtDecode } from "jwt-decode"
import dayjs from "dayjs"

const baseURL= 'http://127.0.0.1:8000/api'

const useAxios= ()=> {
    
    const {authTokens, setUser, setAuthTokens}= useContext(AuthContext) // get all these data from AuthContext
    const axiosInstance= axios.create({
        baseURL, 
        headers: {Authorization: `Bearer ${authTokens?.access}`}
    })

    axiosInstance.interceptors.request.use(async req => {
        const user= jwtDecode(authTokens.access)
        // this line will be used for checking if this user token is expired or not 
        const isExpired= dayjs.unix(user.exp).diff(dayjs()) < 1 // exp= expire, diff= difference
        if (isExpired) 
            return req

        const response= await axios.post(`${baseURL}/token/refresh/`, { // url to refresh user token
            refresh: authTokens.refresh
        })
        localStorage.setItem('authTokens', JSON.stringify(response.data))

        setAuthTokens(response.data)
        setUser(jwtDecode(response.data.access))

        req.headers.Authorization= `Bearer ${response.data.access}`
        return req
    })

    return axiosInstance
} 

export default useAxios
