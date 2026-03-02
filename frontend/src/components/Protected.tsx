import { Navigate, Outlet } from "react-router-dom";

// this will stop the useless backend calls, therefore I can remove axios now and no need
// global router, can use Navigate too
function Protected(){
    console.log("Inside the protected route");
    let token = localStorage.getItem('token');
    if(!token){
        console.log("Routing");
        <Navigate to={"/signin"} />
    }
    console.log("Returning");
    return <Outlet />
}

export default Protected;