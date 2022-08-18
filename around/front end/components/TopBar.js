import React from 'react';
import logo from "../assets/images/logo.svg";

import { LogoutOutlined } from '@ant-design/icons';

function TopBar(props) {//logout功能只有在login以后才会显示，所以这就涉及到父子组件间通信，上传下通过props，下传上通过cb
    const { isLoggedIn, handleLogout } = props;
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="App-title">Around Web</span>
            {
                isLoggedIn ?
                    <LogoutOutlined className='logout' onClick={handleLogout}/>
                    :
                    null
            }
        </header>
    );
}

export default TopBar;