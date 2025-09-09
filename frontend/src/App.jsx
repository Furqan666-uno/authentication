import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import PrivateRoute from "./context/PrivateRoute";
import Navbar from "./views/Navbar";
import Dashboard from './views/Dashboard'
import Homepage from './views/Homepage'
import Loginpage from './views/Loginpage'
import Registerpage from './views/Registerpage'


const App = () => {
  return (
    <Router>
      <AuthProvider>        
        <Navbar />
        <Routes>
          <Route path="/login" element={<Loginpage />} />  
          <Route path="/register" element={<Registerpage />} />
          <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App