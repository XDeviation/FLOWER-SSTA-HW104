import React, { useEffect, useRef, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import type { NotificationPlacement } from "antd/es/notification/interface";
import {
  ConfigProvider,
  Button,
  Layout,
  Table,
  Input,
  Divider,
  notification,
  Modal,
  Alert,
  InputRef,
  Select,
} from "antd";
const { Footer, Content } = Layout;

type Song = {
  name: string;
  type: string;
  language: string;
  singer: string;
  first_letter: string;
  comment: string;
};

type LanguageType = {
  type: string | undefined;
  language: string | undefined;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalSongs, setTotalSongs] = useState<Song[]>();
  const [filterSongs, setFliterSongs] = useState<Song[]>();
  const [filterString, setFliterString] = useState<string>("");
  const [columns, setColumns] = useState<ColumnsType<Song>>([]);
  const [clipboardText, setClipboardText] = useState<string>("");
  const [languageType, setLanguageType] = useState<LanguageType[]>([]);
  const [selectType, setSelectType] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const openModel = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 100);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://www.gujiujiu.icu/api/songlist", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const { data } = await response.json();

        const languageTypeSet = new Set();
        data.forEach((song: Song) => {
          languageTypeSet.add(
            song.language + (song.type ? `-${song.type}` : "")
          );
        });
        const languageTypeArray = Array.from(languageTypeSet) as string[];
        const tmpLanguageType = [
          { language: undefined, type: undefined },
        ] as LanguageType[];
        languageTypeArray.forEach((val: string) => {
          const tmp = val.split("-");
          tmpLanguageType.push({
            language: tmp[0],
            type: tmp[1] || undefined,
          });
        });
        setLanguageType(tmpLanguageType);
        // const typeSet = new Set();
        // const singerSet = new Set();
        // const languageSet = new Set();
        // const firstLetterSet = new Set();
        // data.forEach((song: Song) => {
        //   typeSet.add(song.type);
        //   singerSet.add(song.singer);
        //   languageSet.add(song.language.trim());
        //   firstLetterSet.add(song.first_letter.toUpperCase());
        // });
        // const typeArray = Array.from(typeSet) as string[];
        // const singerArray = Array.from(singerSet) as string[];
        // const languageArray = Array.from(languageSet) as string[];
        // const firstLetterArray = Array.from(firstLetterSet) as string[];
        // firstLetterArray.sort((a: string, b: string) =>
        //   ("" + a).localeCompare(b)
        // );

        setColumns([
          {
            title: "曲名",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
            // sorter: (a, b) => ("" + a.name).localeCompare(b.name),
            // filters: firstLetterArray.map((value) => ({
            //   value,
            //   text: value,
            // })),
            // filterSearch: true,
            // onFilter: (value: string | number | boolean, record) =>
            //   record.first_letter === value.toString(),
          },
          {
            title: "歌手",
            dataIndex: "singer",
            key: "singer",
            render: (text) => <a>{text}</a>,
            // sorter: (a, b) => ("" + a.singer).localeCompare(b.singer),
            // filters: singerArray.map((value) => ({
            //   value,
            //   text: value,
            // })),
            // filterSearch: true,
            // onFilter: (value: string | number | boolean, record) =>
            //   record.singer === value.toString(),
          },
          {
            title: "语言和曲风",
            dataIndex: "language",
            key: "language",
            render: (text, record: Song) => (
              <a>{record.type ? record.type : record.language}</a>
            ),
            // sorter: (a, b) => ("" + a.type).localeCompare(b.type),
            // filters: languageArray.map((value) => ({
            //   value,
            //   text: value,
            // })),
            // filterSearch: true,
            // onFilter: (value: string | number | boolean, record) =>
            //   record.language === value.toString(),
          },
          {
            title: "备注",
            dataIndex: "comment",
            key: "comment",
            render: (text) => <a>{text}</a>,
            // sorter: (a, b) => ("" + a.comment).localeCompare(b.comment),
          },
        ]);
        setTotalSongs(data);
      } catch (err) {
        // setErr(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !totalSongs ||
        ((!filterString || filterString.length === 0) && !selectType)
      ) {
        setFliterSongs(totalSongs);
        return;
      }
      setIsLoading(true);
      const filterStringLower = filterString.toLowerCase();
      const { language, type } = languageType[selectType];
      const tmp = totalSongs.filter((song: Song) => {
        if (language && song.language !== language) return false;
        if (type && song.type !== type) return false;
        for (const value of Object.values(song)) {
          if (value.toLowerCase().indexOf(filterStringLower) !== -1) {
            return true;
          }
        }
        return false;
      });
      setFliterSongs(tmp);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [totalSongs, filterString, selectType, languageType]);

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    message: string,
    placement: NotificationPlacement = "topRight"
  ) => {
    api.success({
      message: message,
      placement,
    });
  };

  const randerHeader = () => {
    return (
      <div>
        <div style={{ marginTop: "5%" }}>
          <img
            style={{ borderRadius: "50%" }}
            alt="avatar"
            width="200"
            height="200"
            src="./avatar.webp"
          ></img>
        </div>

        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#e6b49c",
              display: "grid",
            }}
          >
            <h1>顾疚疚的歌单</h1>
          </div>
        </div>

        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
            }}
          >
            <a
              target="_blank"
              href="https://live.bilibili.com/362064"
              rel="noreferrer"
            >
              <Button ghost>
                {/* <img src="/bilibili_logo.png" alt="bilibili logo" /> */}
                前往疚宝的直播间
              </Button>
            </a>
          </div>

          <div
            style={{
              justifyContent: "center",
              marginBottom: "5%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                color: "#424249",
                display: "grid",
                marginTop: "1%",
              }}
            >
              <span>轻点歌名可以复制哦</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#e6b49c",
          },
        }}
      >
        {contextHolder}
        <Content
          style={{
            marginLeft: "10%",
            marginRight: "10%",
          }}
        >
          {randerHeader()}
          <div
            style={{
              marginTop: "1%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Select
              style={{ width: "20%", opacity: 0.85 }}
              value={selectType}
              onChange={(e) => {
                setSelectType(e);
              }}
              options={languageType.map((value, index) => {
                const { language, type } = value;
                if (!language && !type)
                  return { label: "所有语言和曲风", value: index };
                if (!type) return { label: language, value: index };
                return { label: `${language}-${type}`, value: index };
              })}
            ></Select>
            <Input
              style={{ width: "55%", opacity: 0.85 }}
              value={filterString}
              placeholder="搜索"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { value: inputValue } = e.target;
                setFliterString(inputValue);
              }}
            ></Input>
            <Button
              style={{ width: "20%", opacity: 0.85 }}
              onClick={async () => {
                try {
                  let selectSong = {} as Song;
                  const randomIndex = Math.floor(
                    Math.random() *
                      (filterSongs?.length || totalSongs?.length || 0)
                  );
                  if (!filterSongs) {
                    if (!totalSongs) {
                      return;
                    }
                    selectSong = totalSongs[randomIndex];
                  } else {
                    selectSong = filterSongs[randomIndex];
                  }
                  setClipboardText(`点歌 ${selectSong.name}`);

                  let comment = "";
                  if (selectSong.comment) {
                    comment = `注意，这首歌是 ${selectSong.comment} 哦！`;
                  }

                  const permissionName = "clipboard-write" as PermissionName;
                  const { state } = await navigator.permissions.query({
                    name: permissionName,
                  });

                  if (state === "denied") {
                    throw "no permission";
                  }
                  await navigator.clipboard.writeText(
                    `点歌 ${selectSong.name}`
                  );

                  openNotification(
                    `你抽中了 ${selectSong.name} , 已经成功复制到剪贴板，快去直播间点歌吧！${comment}`
                  );
                } catch (err) {
                  openModel();
                  console.log(err);
                }
              }}
            >
              盲盒点歌
            </Button>
          </div>

          <Table
            style={{
              opacity: 0.85,
              marginTop: "1%",
            }}
            columns={columns}
            dataSource={filterSongs}
            pagination={false}
            loading={isLoading}
            scroll={{ x: true }}
            rowKey={(record: Song) =>
              `${record.name}-${record.singer}-${record.comment}`
            }
            onRow={(record: Song) => {
              return {
                onClick: async (event) => {
                  try {
                    setClipboardText(`点歌 ${record.name}`);

                    const permissionName = "clipboard-write" as PermissionName;
                    const { state } = await navigator.permissions.query({
                      name: permissionName,
                    });
                    if (state === "denied") {
                      throw "no permission";
                    }

                    await navigator.clipboard.writeText(`点歌 ${record.name}`);
                    openNotification(
                      `你选择了 ${record.name} ，已经成功复制到剪贴板，快去直播间点歌吧！`
                    );
                  } catch (err) {
                    openModel();
                  }
                },
              };
            }}
          />
        </Content>
        <Footer>
          <Divider
            style={{
              opacity: 0.5,
              marginTop: "1%",
            }}
          >
            Copyright © 2022 GuJiuJiu. All rights reserved.{" "}
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              style={{
                color: "black",
              }}
            >
              鲁ICP备2022041736号-1
            </a>
          </Divider>
        </Footer>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          footer={null}
          closable={false}
          onCancel={handleCancel}
        >
          <Alert
            description="浏览器拒绝了河豚的复制请求，请手动复制并到直播间点歌~"
            type="warning"
            showIcon
          />
          <Input
            ref={inputRef}
            onFocus={() => {
              inputRef.current && inputRef.current.select();
            }}
            style={{ marginTop: "12px" }}
            value={clipboardText}
          ></Input>
        </Modal>
      </ConfigProvider>
    </div>
  );
};
export default App;
