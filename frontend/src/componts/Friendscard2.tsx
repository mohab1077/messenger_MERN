import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";
export interface props{
    userfr:string,
    statusfr:string
}
export default function Friendscard2({userfr,statusfr}:props) {
  return (
    <Box sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        border: "2px solid #1976d2",
        borderRadius: 3,
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
      }} >
      
    <List
      
    >
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText sx={{ mt: 1.5 }} primary={userfr}
        secondary={statusfr} />
        
       
      </ListItem>
      
    </List>
    
   
    
    
  
    </Box>
     
  );
}
