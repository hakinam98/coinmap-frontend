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
      </main>
    </>
  );
}
