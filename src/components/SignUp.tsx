// src/components/SignUp.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/googleStore";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await signUp(email, password);
    navigate("/");
  };

  return (
    <>
      <Container maxWidth="xs">
        <form onSubmit={handleSignUp}>
          <Box textAlign="center">
            <Box pt={2}>
              <Typography variant="h4">Sign up </Typography>
            </Box>
            <Box pt={2}>
              <Divider />
            </Box>
            <Box pl={2} pr={2} pt={10}>
              <TextField
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                label="Email"
                variant="outlined"
              />
            </Box>
            <Box p={2}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Box textAlign="center" p={2}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default SignUp;
