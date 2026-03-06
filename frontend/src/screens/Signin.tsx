import Button from "@/components/Button";
import Error from "@/components/Error";
import Footer from "@/components/Footer";
import InputBox from "@/components/InputBox";
import api from "@/lib/api";
import { signinSchema } from "@/validators/auth.validator";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const navigate = useNavigate();

  async function signin() {
    try {
      console.log("Before call");
      const { success } = signinSchema.safeParse({ email, password });
      console.log(success);
      console.log(password);
      console.log(email);
      if (!success) {
        setIsValid(false);
        return;
      }
      setIsDisable(true);
      const response = await api.post("/auth/signin", {
        email: email,
        password: password,
      });

      console.log("After call");
      if (response.status == 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/home");
      }
      setIsDisable(false);
    } catch (error: any) {
      console.log(error);
      if (error.response.status == 400) {
        console.log("Bad inputs"); // get this in the inteerceptor, 400 and 401(unauthorised)
      }
      setIsDisable(false);
    }
  }

  function goToSignup() {
    navigate("/signup");
  }

  function onChange<T extends string>(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<SetStateAction<T>>,
  ) {
    setter(e.target.value as T);
  }

  return (
    <div className="grid grid-cols-2 h-screen">
        <div className="bg-[#3BAD9E] text-white text-5xl flex items-center">
          <div className="pl-20 font-bold text-[4rem]">
            <h2>Welcome</h2>
            <h2 className="mt-2">Back!</h2>
          </div>
        </div>
      <div className="flex items-center justify-center">
      <form className="max-w-100"
        onSubmit={(e) => {
          e.preventDefault();
          signin();
        }}
      >
        <div>
          <InputBox focus={true} setterFunction={setEmail} header="E-mail" />
          <InputBox setterFunction={setPassword} header="Password" />
        </div>
        <Button name="Login" onClick={signin} isDisable={isDisable}/>
        {isValid ? null : <Error content="Invalid credentials. Please try again." />}
        <Footer navigateTo={goToSignup} content="New User? " link="Sign In" />
      </form>
      </div>
    </div>
  );
}

export default Signin;
