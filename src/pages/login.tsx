import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/Login.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import { ToastOptions } from "react-toastify/dist/types";
import "react-toastify/dist/ReactToastify.css";
import { login } from "./api";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  //Tao thong bao Toast
  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  //Tao router dieu huong
  const router = useRouter();

  //Kiem soat user da dang nhap chua
  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("authtoken")) {
      router.replace("/");
    }
  }, [router]);

  //Event Login
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, email } = values;
      try {
        const { data } = await login({ password, email });
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("authtoken", JSON.stringify(data.authToken));
        router.replace("/");
      } catch (error: any) {
        typeof error.response.data?.message === "string"
          ? toast.error(error.response.data?.message, toastOptions)
          : toast.error(error.response.data?.message[0], toastOptions);
      }
    }
  };

  const handleValidation = (): boolean => {
    const { password, email } = values;
    if (password === "" || email === "") {
      toast.error("Username and password are required", toastOptions);
    }
    return true;
  };
  //Render Login page
  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="Login page create by Nam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
          <div className={styles.brand}>
            <h1>Login</h1>
          </div>
          <input
            className={styles.input}
            type="text"
            placeholder="email"
            name="email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="password"
            name="password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />

          <button className={styles.button} type="submit">
            Login
          </button>
          <span className={styles.span}>
            Do not have an account? <Link href="/register">Register</Link>
          </span>
        </form>
      </main>
      <ToastContainer />
    </>
  );
}
