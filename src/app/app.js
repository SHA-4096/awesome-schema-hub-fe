import React, { useState } from "react";
import { Layout, Menu, Input, Upload, Button, List, message } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import Form from "@rjsf/core";
import { saveAs } from "file-saver";

const { Header, Content, Footer, Sider } = Layout;

import validator from "@rjsf/validator-ajv8"; // 引入验证器

const App = () => {
  const [schemas, setSchemas] = useState([]); // 存储上传的 JSON Schema 列表
  const [selectedSchema, setSelectedSchema] = useState(null); // 当前选中的 Schema
  const [formData, setFormData] = useState({}); // 表单数据
  const [searchTerm, setSearchTerm] = useState(""); // 搜索关键词

  // 上传 Schema 的回调
  const handleUpload = (file) => {
    console.log("Upload function called");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const schema = JSON.parse(e.target.result);
        setSchemas([...schemas, { name: file.name, schema }]);
        message.success(`${file.name} 上传成功`);
      } catch (error) {
        message.error("文件解析失败，请上传正确的 JSON Schema 文件");
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 搜索过滤
  const filteredSchemas = schemas.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 下载生成的 JSON 数据
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "generated.json");
  };

  // 使用 items 属性定义菜单项
  const menuItems = [
    {
      key: "upload",
      label: (
        <Upload beforeUpload={handleUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />} type="primary">
            上传 JSON Schema
          </Button>
        </Upload>
      ),
    },
    {
      key: "search",
      label: (
        <Input
          placeholder="搜索 Schema"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        {/* 使用 items 定义菜单 */}
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <h1 style={{ margin: "0 20px" }}>JSON Schema Hub</h1>
        </Header>
        <Content style={{ margin: "20px" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            {/* 左侧 Schema 列表 */}
            <div style={{ flex: 1 }}>
              <h2>Schema 列表</h2>
              <List
                bordered
                dataSource={filteredSchemas}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => setSelectedSchema(item.schema)}
                    style={{
                      cursor: "pointer",
                      background:
                        selectedSchema === item.schema ? "#f0f0f0" : "white",
                    }}
                  >
                    {item.name}
                  </List.Item>
                )}
              />
            </div>

            {/* 右侧表单生成区域 */}
            <div style={{ flex: 2 }}>
              <h2>表单生成</h2>
              {selectedSchema ? (
                <Form
                  schema={selectedSchema}
                  formData={formData}
                  onChange={({ formData }) => setFormData(formData)}
                  validator={validator} // 传递验证器
                >
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    下载 JSON
                  </Button>
                </Form>
              ) : (
                <p>请选择一个 Schema 以生成表单</p>
              )}
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          JSON Schema Hub ©2024 
          Made With Love by <a href="https://github.com/SHA-4096" style={{ color: "blue"} }>Zarah Xu</a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
