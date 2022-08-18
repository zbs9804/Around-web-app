import React, { useState } from "react";
import { Input, Radio } from "antd";

import { SEARCH_KEY } from "../constants";

const { Search } = Input;

function SearchBar(props) {
    //search 一定是个受控组件，所以要加onChange
    //onchange不用每个小组件都加，可以再父组件加，父组件会时间代理，任何小组件的状态变化都会导致onchange
    const [searchType, setSearchType] = useState(SEARCH_KEY.all);
    const [error, setError] = useState("");

    const changeSearchType = (e) => {//这个e是react提供的https://developer.mozilla.org/en-US/docs/Web/API/Event
        const searchType = e.target.value;
        setSearchType(searchType);//这个setSearchType是异步更新的，所以在下面的if语句里只能用e.target.value
        setError("");
        if (e.target.value === SEARCH_KEY.all) {
            //参数传递路径：Home.js调用SearchBar组件，并传入handlesearch函数，然后在SearchBar.js这里，给了这个函数两个参数：
            //type，keyword,然后再回到Home.js里的handlesearch函数，会接受传过去的参数，并进行解构，拿出对应参数，执行相应的功能
            props.handleSearch({ type: searchType, keyword: "" });
        }
    };

    const handleSearch = (value) => {
        if (searchType !== SEARCH_KEY.all && value === "") {
            setError("Please input your search keyword!");
            return;
        }
        setError("");
        props.handleSearch({ type: searchType, keyword: value });//keyword is image
    };

    return (
        <div className="search-bar">
            <Search
                placeholder="input search text"
                enterButton="Search"
                size="large"
                onSearch={handleSearch}// 如果发生search请求，就会执行onSearch指向的handleSearch，参数value是antd帮你做的
                disabled={searchType === SEARCH_KEY.all}
            />
            <p className="error-msg">{error}</p>

            <Radio.Group
                onChange={changeSearchType}
                value={searchType}
                className="search-type-group"
            >
                <Radio value={SEARCH_KEY.all}>All</Radio>
                <Radio value={SEARCH_KEY.keyword}>Keyword</Radio>
                <Radio value={SEARCH_KEY.user}>User</Radio>
            </Radio.Group>
        </div>
    );
}

export default SearchBar;