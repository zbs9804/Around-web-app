import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

// 这个暂时是laioffer的demo url，后期部署后换成自己的
import { BASE_URL } from "../constants";

function Login(props) {
    const { handleLoggedIn } = props;

    const onFinish = (values) => {
        //step1: get values of username, password
        //step2: send login request to the server
        //step3: get the response from server
        //      case1: login successfully
        //              ->inform Main -> App
        //      case2: login failed
        //              ->inform user
        const { username, password } = values;
        const opt = {
            method: "POST",
            url: `${BASE_URL}/signin`,
            data: {
                username: username,
                password: password
            },
            headers: { "Content-Type": "application/json" }
        };
        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    //handleLoggedIn of APP -> Main -> Login
                    handleLoggedIn(data);
                    message.success("Login succeed! ");
                }
            })
            .catch((err) => {
                console.log("login failed: ", err.message);
                message.error("Login failed!");
            });
    };

    return (
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: "Please input your Username!"
                    }
                ]}
            >
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input your Password!"
                    }
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                 Or <Link to="/register">register now!</Link>
                {/*这里写的link会被拿到Main.js里写的route里找*/}
            </Form.Item>
        </Form>
    );
}

export default Login;