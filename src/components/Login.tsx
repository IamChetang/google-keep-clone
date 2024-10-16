// src/components/Login.js
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
  Link,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };
  return (
    <>
      <Container maxWidth="xs">
        <form onSubmit={handleLogin}>
          <Box textAlign="center">
            <Box pt={2}>
              <Typography variant="h4">Login </Typography>
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
                {loading ? "Loging up..." : "Login"}
              </Button>
            </Box>
            <Box textAlign="center" p={2}>
              <Typography variant="body2">
                {" "}
                Don't have an account ?{" "}
                <Link onClick={() => navigate("/signup")}>
                  Register here
                </Link>{" "}
              </Typography>
            </Box>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default Login;
