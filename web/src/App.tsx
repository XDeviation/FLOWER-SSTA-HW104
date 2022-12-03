import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { ConfigProvider, Button, Layout, Table, Input, Avatar } from "antd";
const { Header, Footer, Sider, Content } = Layout;

type Song = {
  name: string;
  type: string;
  language: string;
  singer: string;
  first_letter: string;
  comment: string;
};

const columns: ColumnsType<Song> = [
  {
    title: "曲名",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "歌手",
    dataIndex: "singer",
    key: "singer",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "语言",
    dataIndex: "language",
    key: "language",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "备注",
    dataIndex: "comment",
    key: "comment",
    render: (text) => <a>{text}</a>,
  },
];

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalSongs, setTotalSongs] = useState<Song[]>();
  const [filterSongs, setFliterSongs] = useState<Song[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/songlist", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();

        setTotalSongs(result.data);
      } catch (err) {
        // setErr(err.message);
      } finally {
        setIsLoading(false);
        // setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFliterSongs(totalSongs);
  }, [totalSongs]);

  const randerHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5%",
          marginBottom: "5%",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginRight: "10%",
            display: "grid",
          }}
        >
          {/* <a target="_blank" href="https://live.bilibili.com/362064">
            <Button ghost>进入 BILIBILI 首页</Button>
          </a> */}
          <a
            style={{
              marginTop: "20%",
            }}
            target="_blank"
            href="https://live.bilibili.com/362064"
          >
            <Button ghost>盲盒点歌</Button>
          </a>
          <a
            style={{
              marginTop: "20%",
            }}
            target="_blank"
            href="https://live.bilibili.com/362064"
          >
            <Button ghost>进入 BILIBILI 直播间</Button>
          </a>
        </div>
        <img
          style={{ borderRadius: "50%" }}
          alt="avatar"
          width="200"
          height="200"
          src="./avatar.webp"
        ></img>
      </div>
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00b96b",
          },
        }}
      >
        <Content
          style={{
            marginLeft: "10%",
            marginRight: "10%",
          }}
        >
          {randerHeader()}
          <Input
            style={{
              opacity: 0.5,
              marginTop: "1%",
            }}
          ></Input>
          <Table
            style={{
              opacity: 0.5,
              marginTop: "1%",
            }}
            columns={columns}
            dataSource={filterSongs}
            pagination={false}
            loading={isLoading}
          />
        </Content>
      </ConfigProvider>
    </div>
  );
};
export default App;
