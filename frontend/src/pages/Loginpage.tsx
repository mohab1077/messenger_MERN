import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { BASE_URL } from "../constans/baseurl";

const Loginpage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
      const { login } = useAuth();
      const emailRef = useRef<HTMLInputElement>(null);
      const passwordRef = useRef<HTMLInputElement>(null);

    const handelgo = ()=>navigate("/rigestir")

    const onlogin = async ()=>{
        const email = emailRef.current?.value;
            const password = passwordRef.current?.value;
        
            // Validate the form data
            if (!email || !password) {
              setError("Check submitted data.");
              return;
            }
        
            // Make the call to API to create the user
            const response = await fetch(`${BASE_URL}/user/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
              }),
            });
        
            if (!response.ok) {
              setError("Unable to login user, please try different credientials!");
              return;
            }
        
            const token = await response.json();
        
            if (!token) {
              setError("Incorrect token");
              return;
            }
        
            login(email, token);
            navigate("/");
    }
  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          p: 4,
          paddingBottom: 0,
          border: "2px solid #1976d2",
          borderRadius: 3,
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4">Log in</Typography>
        <TextField label="email" size="small" inputRef={emailRef}/>
        <TextField label="password" type="password" size="small" inputRef={passwordRef} />
        <Button variant="contained" onClick={onlogin}>login</Button>
        <Button onClick={handelgo}>
          <Typography variant="caption"> dont have acc rigester</Typography>
        </Button>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default Loginpage;
