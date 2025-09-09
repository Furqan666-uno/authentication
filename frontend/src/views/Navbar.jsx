import { useContext } from "react"
import AuthContext from "../context/Authcontext"
import { jwtDecode } from "jwt-decode"
import { Link } from "react-router-dom"

const Navbar = () => {

    const {user, logoutUser}= useContext(AuthContext)
    const token= localStorage.getItem("authTokens")
    let user_id= null
    if (token) {
        const parsed = JSON.parse(token)
        const decode= jwtDecode(parsed.access)
        let user_id= decode.user_id
    }
    
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
            <div className="container-fluid">
            <a className="navbar-brand" href="#">
                <img style={{width:"100px", padding:"2px"}} src="https://imgs.search.brave.com/ka0HEWVZg3dscTlaOEIjyjliTkAnRpAUHAqDcbtDD6w/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ibG9n/LmxvZ29teXdheS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjEvMDEvZ29vZ2xl/LWxvZ28tbmV3Lmpw/Zw" alt="" />

            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                {
                    token === null &&
                    <>
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to='/login'> Login </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to='/register'> Register </Link>
                    </li>
                    </>
                }

                {
                    token !== null &&
                    <>
                    <li className="nav-item">
                    <a className="nav-link" href="/dashboard">Dashboard</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" onClick={logoutUser} style={{cursor:"pointer"}}>Logout</a>
                    </li>
                    </>
                }
                
                
                </ul>
            </div>
            </div>
        </nav>
        </div>
    )
}

export default Navbar