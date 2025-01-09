import { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GoogleLogin } from "@react-oauth/google";
import makeStyles from "./styles";
import Input from "./Input";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const classes = makeStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleChange = () => {};

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const googleSuccess = async (response) => {
    try {
      const decodedToken = jwtDecode(response?.credential);
      dispatch({ type: "AUTH", data: decodedToken });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const googleFailure = async (error) => {
    console.log(error);
  };

  const handleSubmit = () => {};

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            sx={{
              marginBottom: 3,
            }}
          >
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}

            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              handleShowPassword={handleShowPassword}
              type={showPassword ? "text" : "password"}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                handleShowPassword={handleShowPassword}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <div className={classes.googleButton}>
            <GoogleLogin
              onSuccess={googleSuccess}
              onError={googleFailure}
              theme="filled_blue"
              // how give this width dynamically Width=100%
              text={isSignup ? "signup_with" : "signin_with"}
            />
          </div>
          <Grid
            container
            justifyContent="flex-end"
            sx={{
              marginTop: 2,
            }}
          >
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already hav an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
