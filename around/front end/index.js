import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
// 如果是整个项目都需要的库，那就在这里import
const root = ReactDOM.createRoot(document.getElementById('root'));
//以前是ReactDom.render()，是对应类组件的，现在用createRoot这个方法，效果一样
//把整个application用BrowserRouter包裹起来，这样就可以使用react router DOM了
root.render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
