import React, { Component, createRef } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false
    };

    showModal = () => {
        this.setState({
            visible: true
        });
        //函数组件  setIsShowModal(false)不能用，只能this.setState
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true
        });
//step1: create post file obj
//step2: send file to server
//step3: analyze response
// success or fail
        // get form data，postForm是95行定义的子类通过callback修改过的数据
        this.postForm
            .validateFields()//返回类型如果是promise就必须用.then来接受object里的所有values
            .then((form) => {
                const { description, uploadPost } = form;
                const { type, originFileObj } = uploadPost[0];
                const postType = type.match(/^(image|video)/g)[0];
                if (postType) {
                    let formData = new FormData();//data going to save to server
                    formData.append("message", description);//这个name是跟后端对应的
                    formData.append("media_file", originFileObj);//json: key-value

                    const opt = {//define backend request
                        method: "POST",
                        url: `${BASE_URL}/upload`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                        },
                        data: formData
                    };

                    axios(opt)
                        .then((res) => {
                            if (res.status === 200) {
                                message.success("The image/video is uploaded!");//inform user
                                this.postForm.resetFields();//reset form files
                                this.handleCancel();
                                this.props.onShowPost(postType);//refresh posts list
                                this.setState({ confirmLoading: false });
                                //confirmLoading is to control loading sign
                            }
                        })
                        .catch((err) => {
                            console.log("Upload image/video failed: ", err.message);
                            message.error("Failed to upload image/video!");
                            this.setState({ confirmLoading: false });
                        });
                }
            })
            .catch((err) => {
                console.log("err ir validate form -> ", err);
            });
    };

    handleCancel = () => {
        console.log("Clicked cancel button");
        this.setState({
            visible: false
        });
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="Create"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <PostForm ref={(refInstance) => (this.postForm = refInstance)} />
                    {/*dragger和下面的cancel/create不是一个js文件，下面的两个按钮是来自Modal的(createpostbutton，那么如何通过点击这个文件里*/}
                    {/*的create来上传postform里拿到的图片呢？答案：reference*/}
                    {/*reference -> get v-element in react*/}
                    {/*define: React.createRef() || () =>{}，返回element，这里就用了后者的定义方式，并把它传给了postForm*/}
                    {/*PostForm.js改变了refInstance的值，现在可以read from it in CreatePostButton.js*/}
                    {/*我觉得这段可以用在BQ里，就说你拿不到ref，查doc*/}
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;
