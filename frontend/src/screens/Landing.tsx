import { useNavigate } from "react-router-dom";


function Landing(){
    const navigate = useNavigate();

    return (
      <>
        <div className="border-2 rounded-2xl m-2">
          <button onClick={() => navigate("/signup")}>Signup Button</button>
        </div>

        <div className="border-2 rounded-2xl m-2">
          <button onClick={() => navigate("/signin")}>Signin Button</button>
        </div>
      </>
    );
}

export default Landing;