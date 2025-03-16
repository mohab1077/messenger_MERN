import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/auth/AuthProvider";
import ProtectedRoute from "./componts/ProtectedRoute";
import Chatpage from "./pages/Chatpage";
import Loginpage from "./pages/Loginpage";
import Rigesterpage from "./pages/Rigesterpage";
import Friendspage from "./pages/Friendspage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<Loginpage />} />   
          <Route path="/rigestir" element={<Rigesterpage />} /> 
          <Route path="/friend" element={<Friendspage />} /> 
          

          <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Chatpage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
