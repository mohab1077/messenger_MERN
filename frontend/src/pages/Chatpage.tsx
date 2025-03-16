import {
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import Friendscard2 from "../componts/Friendscard2";
import Chatcard from "../componts/Chatcard";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { useEffect, useRef, useState } from "react";
import { friendtype } from "../types/friendtype";
import { BASE_URL } from "../constans/baseurl";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Chatpage = () => {
  const [added, setadd] = useState("");
  const [user, setUser] = useState<string>("");
  const { token, logout, myusername } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [friends, setfrirned] = useState<friendtype[]>([]);
  const navigate = useNavigate();
  const fetchCart = async () => {
    const response = await fetch(`${BASE_URL}/friends/get`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setfrirned(data);
  };
  useEffect(() => {
    if (!token) {
      return;
    }

   

    fetchCart();
  }, [token]);

  const handelchat = (usera: string) => {
    setUser(usera);
  };
  // فتح القائمة عند الضغط على الأيقونة
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // إغلاق القائمة
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlelogout = () => {
    logout();
    navigate("/login");
  };
  const frienduser = useRef<HTMLInputElement>(null);
  const handeladd = async () => {
    const username2 = frienduser.current?.value;

    const res = await fetch(`${BASE_URL}/friends/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username2,
      }),
    });
    if (!res.ok) {
      setadd("not found");
      return;
    }

    setadd("added");
    setfrirned([
      ...friends,
      { userfr: username2 ?? "", statusfr: "inprograss" },
    ]);
  };

  const handelaccept = async (username: string) => {
    const res = await fetch(`${BASE_URL}/friends/accept`, {
      method: "POST",
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
    fetchCart()
  };
  return (
    <Grid container gap={2} sx={{ height: "100vh", backgroundColor: "white" }}>
      <Grid
        item
        xs={8}
        sx={{
          backgroundColor: "white",
          textAlign: "center",
          p: 4,
          border: "2px solidrgb(22, 43, 65)",
          borderRadius: 3,
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        {user ? <Chatcard username={user} /> : <></>}
      </Grid>

      <Grid
        item
        xs={3.8}
        sx={{
          backgroundColor: "white",
          textAlign: "center",
          p: 4,
          border: "2px solidrgb(22, 43, 65)",
          borderRadius: 3,
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField label="add friend" size="small" inputRef={frienduser} />
          <Button
            variant="contained"
            size="small"
            sx={{ width: "2px", height: "40px" }}
            onClick={handeladd}
          >
            add
          </Button>
          {added}

          <IconButton color="primary" onClick={handleClick}>
            <AccountCircleSharpIcon fontSize="medium" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <Typography variant="body2">{myusername}</Typography>
            <MenuItem onClick={handlelogout}>log out</MenuItem>
          </Menu>
        </Box>

        <Typography variant="h5" sx={{ mt: 2 }}>
          My Friends
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
          {friends.map((p) => (
            <>
              <Button onClick={() => handelchat(p.userfr)}>
                <Friendscard2 userfr={p.userfr} statusfr={p.statusfr} />
              </Button>
              {p.statusfr === "request" && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handelaccept(p.userfr)}
                  sx={{
                    width: "100px",
                    height: "30px",
                    position: "relative",
                    left: "125px",
                    textAlign: "center",
                  }}
                >
                  {"accept ✅️"}
                </Button>
              )}
            </>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chatpage;
