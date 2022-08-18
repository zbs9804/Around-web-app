import React, { forwardRef } from "react";
import { Form, Upload, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";

// 为了拿到ref，这里就不写自己的function了，只重写forwardRef这个hook，这样就拿到ref了，在20行修改

export const PostForm = forwardRef((props, formRef) => {
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    };
    const normFile = (e) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    return (
        // ref是个api，formRef的大致作用好像是把formRef赋给ref，就知道要的参数是谁了
        <Form name="validate_other" {...formItemLayout} ref={formRef}>
            <Form.Item
                name="description"
                label="Message"
                rules={[
                    {
                        required: true,
                        message: "Please input your E-mail!"
                    }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="Dragger">

                <Form.Item
                    name="uploadPost"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                    rules={[
                        {
                            required: true,
                            message: "Please select an image/video!"
                        }
                    ]}
                >
                    <Upload.Dragger name="files" beforeUpload={() => false}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
        </Form>
    );
});
