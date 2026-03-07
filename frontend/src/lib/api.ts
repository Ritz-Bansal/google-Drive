import axios from "axios";
import globalRouter from "./globalRouter";

// https://google-drive-zeee.onrender.com

const api = axios.create({
  baseURL: `http://localhost:3000`, // configure the port according to you
  headers: {
    "Content-Type": "Application/json",
  },
});

// intercept the request and check if token is present or not, if not do not send the request to the BE



api.interceptors.response.use(
    function onFulfilled(response){
        if(response.status == 400){
            console.log("Inside the onFUlfilled ", response)
        }
        return response;
    }, function onReject(error){
        // this cannot happen now as I added FE zod and FE zod and BE zod are same, can only happen if the hacker intercepts my req
        if(error.status == 400 || error.status == 404){
            alert("Wrong inputs");
        }else if(error.status == 409){
            alert("Email taken");
        }else if(error.status == 402){
            alert("Upgrade to premium to get more storage");
        }
        else 
            if(error.status == 401){
            console.log("Unauthorized")
            globalRouter.navigate!('/signin');
        }
        return Promise.reject(error);
    }
)

export default api;