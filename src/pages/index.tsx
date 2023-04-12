import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { StyledBadge } from "./components/StyledBadge";
import { IconButton } from "./components/IconButton";
import { EyeIcon } from "./components/EyeIcon";
import { EditIcon } from "./components/EditIcon";
import { DeleteIcon } from "./components/DeleteIcon";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { deleteUser, getAllUsers } from "./api";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

type UserType = {
  id: number;
  username?: string;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType>();
  const [authToken, setAuthToken] = useState("");
  const [users, setUsers] = useState<Array<UserType>>([]);
  const router = useRouter();
  const columns = [
    { name: "ID", uid: "id" },
    { name: "USERNAME", uid: "username" },
    { name: "EMAIL", uid: "email" },
    { name: "CREATED TIME", uid: "created_at" },
    { name: "UPDATED TIME", uid: "updated_at" },
    { name: "ACTIONS", uid: "actions" },
  ];

  useEffect(() => {
    const setToken = async () => {
      if (!localStorage.getItem("authtoken")) {
        if (localStorage.getItem("user")) {
          localStorage.removeItem("user");
        }
        router.replace("/login");
      } else {
        if (!localStorage.getItem("user")) {
          router.replace("/login");
        }
        setCurrentUser(await JSON.parse(localStorage.getItem("user")!));
        setAuthToken(await JSON.parse(localStorage.getItem("authtoken")!));
      }
    };
    setToken();
  }, [router]);

  useEffect(() => {
    const getContacts = async () => {
      if (currentUser && authToken) {
        const { data } = await getAllUsers(authToken);
        setUsers(data);
      }
    };
    getContacts();
  }, [currentUser, authToken, setUsers]);

  const handleDelete = async (user_id: number) => {
    const { data } = await deleteUser(authToken, user_id);
    if (data === "Deleted Successfully!") {
      router.reload();
    }
  };

  const renderCell = (user: UserType, columnKey: React.Key) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Details">
                <IconButton onClick={() => console.log("View user", user?.id)}>
                  <EyeIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit user">
                <IconButton onClick={() => console.log("Edit user", user?.id)}>
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete user"
                color="error"
                onClick={() => handleDelete(user?.id)}
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };
  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home page create by Nam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1>Chào mừng {currentUser?.username} đến với trang chủ</h1>
        </div>
        <div>
          <h2>Danh sách Users</h2>
        </div>
        <Table
          aria-label="Example table with custom cells"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
          selectionMode="none"
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={users}>
            {(item: UserType) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </main>
    </>
  );
}
