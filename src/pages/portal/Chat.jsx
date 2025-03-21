import  { useState } from "react";
import PropTypes from "prop-types";
import { Box, Card, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatPage = ({ userName, companyName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput(""); // Clear input field after sending
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a1a2e", // Dark background
        color: "#fff",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #00ffa2, #00f2ff)",
          color: "#000",
          padding: "12px",
          textAlign: "center",
          fontWeight: "bold",
          boxShadow: "0px 4px 10px rgba(0, 255, 170, 0.4)",
        }}
      >
        {userName} | {companyName}
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg, index) => (
          <Card
            key={index}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#00ffa2" : "#00f2ff",
              color: "#000",
              padding: "8px 12px",
              maxWidth: "60%",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 255, 170, 0.3)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 6px 15px rgba(0, 255, 170, 0.5)",
              },
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
          </Card>
        ))}
      </Box>

      {/* Message Input Field */}
      <Box
        sx={{
          display: "flex",
          padding: "12px",
          backgroundColor: "#292929",
          boxShadow: "0px -2px 10px rgba(0, 255, 170, 0.4)",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            input: { color: "#fff" },
            fieldset: { borderColor: "#00ffa2" },
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: "#00f2ff" },
              "&.Mui-focused fieldset": { borderColor: "#00f2ff" },
            },
          }}
        />
        <IconButton onClick={handleSend} sx={{ color: "#00ffa2", marginLeft: "10px" }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
ChatPage.propTypes = {
  userName: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
};

export default ChatPage;
