import { FC, PropsWithChildren, useState } from "react";
import { AuthContext } from "./AuthContext";
import { BASE_URL } from "../../constans/baseurl";

const USERNAME_KEY = "username";
const TOKEN_KEY = "token";
const myusername_key="myusername"

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [email, setemail] = useState<string | null>(
    localStorage.getItem(USERNAME_KEY)
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN_KEY)
  );
  const [myusername, setusername] = useState<string | null>(
    localStorage.getItem(myusername_key)
  );




  const isAuthenticated = !!token;

  const login = async(email: string, token: string) => {
    setemail(email);
    setToken(token);
    localStorage.setItem(USERNAME_KEY, email);
    localStorage.setItem(TOKEN_KEY, token);
    const response = await fetch(`${BASE_URL}/chat/myuser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return
      }

      const data = await response.json();
      setusername(data)
      localStorage.setItem(myusername_key, data);

  };

  const logout = () => {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(myusername_key);
    setemail(null);
    setToken(null);
    setusername(null)
  };

  return (
    <AuthContext.Provider
      value={{ email, token, isAuthenticated, login, logout,myusername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;