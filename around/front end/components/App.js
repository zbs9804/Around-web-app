import React, { useState } from "react";
import TopBar from "./TopBar";
import Main from "./Main";

import { TOKEN_KEY } from "../constants";
import "../styles/App.css";

function App() {//这个localStorage就是Windows提供的API，在本地暂存数据
  //读取localStorage的token，判断初始状态是否已登录
  const [isLoggedIn, setIsLoggedIn] = useState(
      localStorage.getItem(TOKEN_KEY) ? true : false
  );

  const logout = () => {
    console.log("log out");
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
  };

  const loggedIn = (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  };
  return (
      <div className="App">
        <TopBar isLoggedIn={isLoggedIn} handleLogout={logout} />
        <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn} />
        {/*App.handleLoggedIn -> Main -> Login*/}
      </div>
  );
}

export default App;