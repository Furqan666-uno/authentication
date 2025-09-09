import { useContext } from "react"
import AuthContext from "./Authcontext"
import { Link, Route } from "react-router-dom"

const PrivateRoute= ({children}) => {
    let {user}= useContext(AuthContext)

    return user ? children : <Navigate to="/login" />
}

export default PrivateRoute