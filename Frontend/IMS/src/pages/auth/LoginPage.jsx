import React from "react";
import { useLogin, useNotify } from "react-admin";
import { TextField, Button } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";

const LoginPage = () => {
    const login = useLogin();
    const notify = useNotify();
    const [credentials, setCredentials] = React.useState({ email: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(credentials).catch(() => notify("Invalid email or password"));
    };

    return (
        <div className="flex  justify-center items-center min-h-screen " >
            {/**style={{
            backgroundImage: "url('banner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: "center",
        }} */}
            <form onSubmit={handleSubmit} className="bg-white px-8 border pt-8 pb-14 rounded-lg shadow-md w-full max-w-sm z-20">
                <FaUserCircle size={70} className="flex mx-auto text-[#184784] items-center justify-center" />
                <br />
                <TextField
                    fullWidth
                    label="Email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                <br />
                <br />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <br />
                <br />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
