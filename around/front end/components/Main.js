import React, { useState } from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Register from "./Register"
import Home from "./Home"
function Main(props) {
    const { isLoggedIn, handleLoggedIn } = props;

    const showLogin = () => {
        return isLoggedIn ? (
            <Redirect to="/home" />
            // 这里可不可以直接写<Login/>呢？不可以，这么写虽然还是可以跳转到login界面，但URL不会跳转
        ) : (
            <Login handleLoggedIn={handleLoggedIn} />
        );
    };

    const showHome = () => {
        return isLoggedIn ? <Home /> : <Redirect to="/login" />;
    };
    //login
    //    case1: already logged in => home
    //    case2: hasn't logged in => login
    return( <div className="main">
            {/*定义router就需要定义key-value pair，第一个参数就是key，对应不同的url后缀，第二个参数就是value，对应不同的component*/}
            {/*switch + exact是唯一匹配，只要不加switch就是模糊匹配。都是从上往下找，匹配第一个符合的，其余的就不管了*/}
            {/*path里面如果需要传递参数，就在要传的参数前面加：*/}
            {/*本项目不涉及二级路由*/}
        <Switch>
            <Route path="/" exact render={showLogin} />
            <Route path="/login" render={showLogin} />
            <Route path="/register" component={Register} />
            <Route path="/home" render={showHome} />
        </Switch>
    </div>
    );
}

export default Main;