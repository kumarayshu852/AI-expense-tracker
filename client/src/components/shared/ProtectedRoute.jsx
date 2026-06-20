import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from '../../context/AuthContext'

const ProtectedRoute =() =>{
    const {token,loading} =useAuth()

    if(loading){
        return(
            <div className="flex items-center justify-center h-screen bg-dark-300">
                 <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return token ? <Outlet/> : <Navigate to='/login' replace/>
}

export default ProtectedRoute