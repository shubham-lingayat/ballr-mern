import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () =>{
    const navigate = useNavigate();
    const goToRegister = () => {
        navigate('/register');
    };
    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div>
            Home Page
            <button className="btn btn-primary" onClick={goToRegister}>
                Register
            </button>
            <button className="btn btn-primary" onClick={goToLogin}>
                Login
            </button>

        </div>
    );
}

export default Home;