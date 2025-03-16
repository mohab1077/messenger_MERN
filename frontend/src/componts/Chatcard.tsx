import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Paper,
  Badge,
  Stack,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  
} from "@mui/material";
import { styled } from "@mui/system";
import { FiMoreVertical, FiPaperclip, FiSend } from "react-icons/fi";
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuth } from "../context/auth/AuthContext";
import { BASE_URL } from "../constans/baseurl";
import { chattype } from "../types/chattype";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
}));

const MessageContainer = styled(Box)({
  height: "calc(100vh - 130px)",
  overflowY: "auto",
  padding: "20px",
  backgroundColor: "#f5f5f5",
});

const InputSection = styled(Box)({
  padding: "15px",
  backgroundColor: "#ffffff",
  borderTop: "1px solid #e0e0e0",
});

const OnlineBadge = styled(Badge)({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: "0 0 0 2px #fff",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
});
interface prop {
  username: string;
}
const Chatcard = ({ username }: prop) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const MessageBubble = styled(Paper)(({ sent }) => ({
    padding: "10px 15px",
    maxWidth: "70%",
    borderRadius:
      username !== sent ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
    backgroundColor: username !== sent ? "#e3f2fd" : " #ffffff",
    marginBottom: "10px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  }));

  const { token, myusername } = useAuth();
  console.log(username);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<chattype[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleClosedelchat = async () => {
    const res = await fetch(`${BASE_URL}/chat/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
      }),
    });
    if (!res.ok) {
      return;
    }
    setMessages([]);
    setAnchorEl(null);
  };


 



  const fetchCart = async () => {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setMessages(data);
  };
  
useEffect(()=>{
  fetchCart()
},[username])
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    
  
    // ✅ إنشاء اتصال WebSocket
    socketRef.current = new WebSocket(`${BASE_URL.replace("http", "ws")}/chat`);
  
    socketRef.current.onopen = () => {
      console.log("✅ WebSocket Connected");
  
      // ✅ إرسال بيانات المستخدم عند الاتصال
      socketRef.current?.send(
        JSON.stringify({
          type: "join",
          token,
          username,
        })
      );
    };
  
    // ✅ استقبال الرسائل الجديدة
    socketRef.current.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
  
        if (data.type === "newMessage") {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        }
      } catch (error) {
        console.error("❌ خطأ في استقبال البيانات:", error);
      }
    };
  
    // ✅ تنظيف WebSocket عند تفريغ الـ component
    return () => {
      socketRef.current?.close();
      console.log("❌ WebSocket Closed");
    };
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (message.trim()) {
      
      const res = await fetch(`${BASE_URL}/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: message,
          username,
        }),
      });
      if (!res.ok) {
        return;
      }
      console.log(res);

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "sendMessage",
            data: message,
            username: myusername,
          })
        );
        console.log("✅ الرسالة تم إرسالها إلى WebSocket");
      } else {
        console.error("❌ WebSocket غير متصل، لم يتم إرسال الرسالة");
      }
  

      setMessage("");
    }
  };
const handledelmsg =async (msgg:string|null,usernameF:string|null)=>{
  
  const res = await fetch(`${BASE_URL}/chat/msg`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      _id:msgg,
      username:usernameF
    }),
  });
  if (!res.ok) {
    return;
  }
  fetchCart()
}


const handeldelettfriend = async ()=>{
  const res = await fetch(`${BASE_URL}/friends/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      
      username
    }),
  });
  if (!res.ok) {
    return;
  }
  
  fetchCart()
  window.location.reload();
}

  return (
    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <StyledAppBar position="static">
        <Toolbar>
          <OnlineBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              alt="User"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJd5dSQSYZSNCE_SqePefth4aJ70VSFWi9A&s"
              sx={{ width: 40, height: 40 }}
            />
          </OnlineBadge>
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              fontWeight="medium"
            >
              {username}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Online
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton size="large" color="primary" onClick={handleClick}>
              <FiMoreVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClosedelchat}>delete chat</MenuItem>
              <MenuItem onClick={handeldelettfriend}>delete friend</MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </StyledAppBar>

      <MessageContainer>
        {messages.map((msg) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: username !== msg.user ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <MessageBubble sent={msg.user}>
             
                
                  <Typography variant="body1">{msg.msg}</Typography>
                 
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    textAlign: "right",
                    color: "text.secondary",
                  }}
                >
                  {10}
                </Typography>
              </MessageBubble>
            </Box>
            <IconButton size="large" color="primary" onClick={()=>handledelmsg(msg._id,username)}>
             <DeleteIcon/>
            </IconButton>
          

          </Box>
            
        ))}
        <div ref={messageEndRef} />
      </MessageContainer>

      <InputSection>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton color="primary">
            <FiPaperclip />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!message.trim()}
           
          >
            <FiSend />
          </IconButton>
        </Stack>
      </InputSection>
    </Box>
  );
};

export default Chatcard;
