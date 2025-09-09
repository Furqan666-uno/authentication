import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const AuthContext= createContext()
export default AuthContext


export const AuthProvider= ({children})=> {
    
    // function to take refresh and access token from local storage
    const [authTokens, setAuthTokens]= useState(()=> // we are not using {} bcz we are not return-ing anything
        localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
    );

    // function to take access token from local storage
    const [user, setUser]= useState(()=> 
        localStorage.getItem("authTokens") ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access) : null
    );

    const [loading, setLoading]= useState(true)
    const navigate= useNavigate() // named history in video


    //function to login user
    const loginUser= async (email, password)=> {
        const response= await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email, password})
        })
        const data= await response.json() // respose= url endpoint data converted to json here
        console.log(data)

        if (response.status === 200) {
            console.log("logged in ")
            setAuthTokens(data) // gives access and refresh tokens
            setUser(jwtDecode(data.access)) // only gives acccess token, required for logging in  
            localStorage.setItem("authTokens", JSON.stringify(data))
            navigate('/') // if successful, move to home page

            MySwal.fire({
            title: 'Login Seccessful',
            text: 'You successfully logged in.',
            toast: true,
            timer: 5000,
            position: 'bottom-right',
            timerProgressBar: true,
            icon: 'success',
            confirmButtonText: 'OK'
            })
        }
        else {
            console.log(response.status)
            alert("Something went wrong.", response.status)

            MySwal.fire({
            title: 'Error',
            text: 'Some Error occoured. Try again...',
            toast: true,
            timer: 5000,
            position: 'bottom-right',
            timerProgressBar: true,
            icon: 'error',
            confirmButtonText: 'OK'
            })
        }
    }

    
    // function to register user 
    const registerUser= async (email, username, password, password2)=> { // all these are required for serialzers.py
        const response= await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email, username, password, password2})    
        })

        if (response.status === 201) {
            navigate('/login')

            MySwal.fire({
            title: 'Registration Seccessful',
            text: 'You have successfully registered yourself.',
            toast: true,
            timer: 5000,
            position: 'bottom-right',
            timerProgressBar: true,
            icon: 'success',
            confirmButtonText: 'OK'
            })
        }
        else {
            console.log(response.status)
            alert("Something went wrong.", response.status)

            MySwal.fire({
            title: 'Error',
            text: 'Error Occured ' + response.status,
            toast: true,
            timer: 5000,
            position: 'bottom-right',
            timerProgressBar: true,
            icon: 'error',
            confirmButtonText: 'OK'
            })
        }
    }


    // function to logout user 
    const logoutUser= ()=> { 
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate('/login')

        MySwal.fire({
            title: 'Logout Seccessful',
            text: 'You have logged out.',
            toast: true,
            timer: 5000,
            position: 'bottom-right',
            timerProgressBar: true,
            icon: 'success',
            confirmButtonText: 'OK'
            })
    }

    // this data will be sent to AuthContext as value
    const contextData= {user, setUser, authTokens, setAuthTokens, registerUser, loginUser, logoutUser}

    useEffect(()=> {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])


    return ( 
    <AuthContext.Provider value={contextData}>
        {
            loading ? null : children // children here holds all the value we got from all above operations
        }
    </AuthContext.Provider> 
    )
}