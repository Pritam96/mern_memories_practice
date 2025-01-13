import { useState } from "react";
import { TextField, Chip, Box } from "@mui/material";

const ChipInput = ({ tags, onAdd, onDelete }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue(""); // Clear the input field
    }
  };

  return (
    <Box>
      <TextField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        label="Search Tags"
        variant="outlined"
        fullWidth
      />
      <Box mt={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => onDelete(tag)}
            style={{ margin: "5px" }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ChipInput;
