import { Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Input = ({
  name,
  label,
  type,
  handleChange,
  handleShowPassword,
  autoFocus,
  half,
}) => {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        name={name}
        label={label}
        type={type}
        onChange={handleChange}
        autoFocus={autoFocus}
        variant="outlined"
        required
        fullWidth
        slotProps={{
          input: {
            endAdornment:
              name === "password" ? (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {type === "password" ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
        }}
      />
    </Grid>
  );
};

export default Input;
