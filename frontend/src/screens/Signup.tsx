import Button from "@/components/Button";
import type { ButtonSpinner } from "@/components/ButtonSpinner";
import Error from "@/components/Error";
import Footer from "@/components/Footer";
import InputBox from "@/components/InputBox";
import api from "@/lib/api";
import { signupSchema } from "@/validators/auth.validator";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

// enum Gender {
//     Male = "male",
//     Female = "female",
//     Other = "other"
// }

type FormElement = HTMLInputElement | HTMLSelectElement;

export function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    // const [loading, setIsLoading] = useState<boolean>(false);
    const [isDisable, setIsDisable] = useState<boolean>(false);
    // const [gender, setGender] = useState<Gender>(Gender.Male);
    const [isValid, setIsValid] = useState<boolean>(true);

    const navigate = useNavigate();
    function navigateToSignin(){
      navigate("/signin");
    }
    
    async function signup(){
        try{
          console.log("Inside the function");
          // gender.toLowerCase();
          const {success} = signupSchema.safeParse({email, username, password});
          
          if(!success){
            setIsValid(false);
            return;
          }
          
            setIsDisable(true);
            console.log("Before api call");
            const response = await api.post("/auth/signup", {
                email: email,
                // gender: gender,
                username: username,
                password: password
            })
            console.log("After api call");

            if(response.status == 201){
              navigate("/signin"); // routing to the landing page
            }

            setIsDisable(false);

          }catch(error: any){
            console.log(error);
          console.log(error.response.status);
          if(error.response.status == 400){
            // return   -- cannot write return inside a onClick function
          }
          setIsDisable(false);
        }
    }
    
    function onChange<T extends string>(e: React.ChangeEvent<FormElement>, setter: React.Dispatch<SetStateAction<T>>){
        setter(e.target.value as T)
    }

    return (
      <div className="grid grid-cols-2 h-screen">
        <div className=" flex items-center justify-center">
        <form className="max-w-100" onSubmit={(e)=> {
          e.preventDefault();
          signup();
          }}>
          <div className="w-full">
            <InputBox focus={true}  header="Full Name" setterFunction={setUsername}/>
            <InputBox  header="E-mail" setterFunction={setEmail}/>
            <InputBox  header="Password" setterFunction={setPassword}/>

            <Button name="Sign Up" onClick={signup} isDisable={isDisable} />            
            {isValid ? null: <Error content="An account with this email already exists." />}
            <Footer content="Already have an account? " link="Login" navigateTo={navigateToSignin} />

            {/* <input type="text" autoFocus placeholder="username" className="border-2" onChange={(e) => onChange(e, setUsername)}/><br/> */}
            {/* <input type="text" placeholder="email" className="border-2" onChange={(e) => onChange(e, setEmail)}/> */}
          </div>
          {/* <div>
            <input type="text" placeholder="password" className="border-2" onChange={(e) => onChange(e, setPassword)}/>
          </div> */}

          {/* <button className="border-2" onClick={signup} >Signup Button</button> */}
          {/* <p>Already Signed Up? <a onClick={navigateToSignin}>Login</a></p> */}
        </form>
        </div>
        
        <div className="bg-[#3BAD9E] text-white text-5xl flex justify-end items-center font-">
          <div className="text-center pr-20 font-bold">
            <h2 className="text-right">Create your <h2 className="mt-3">STASH.</h2></h2><br />
            <h2 className="text-right">Own your <h2 className="mt-3">SPACE.</h2></h2>
          </div>
        </div>
      
      </div>
    );
}

export default Signup;