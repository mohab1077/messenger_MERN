import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constans/baseurl";
import { useAuth } from "../context/auth/AuthContext";

const Rigesterpage = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handelgo = () => navigate("/login");

  const onsignup = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const username = usernameRef.current?.value;

    // Validate the form data
    if (!email || !password) {
      setError("Check submitted data.");
      return;
    }

    // Make the call to API to create the user
    const response = await fetch(`${BASE_URL}/user/rigester`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
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
  };

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
        <Typography variant="h4">sign up</Typography>
        <TextField label="username" inputRef={usernameRef} size="small" />
        <TextField label="email" inputRef={emailRef} size="small" />
        <TextField
          label="password"
          type="password"
          inputRef={passwordRef}
          size="small"
        />
        <Button variant="contained" onClick={onsignup}>
          sign up
        </Button>
        <Button onClick={handelgo}>
          <Typography variant="caption"> you already have acc</Typography>
        </Button>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
      </Box>
      
    </Container>
  );
};

export default Rigesterpage;
