import { FormEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastOptions } from "react-toastify/dist/types";
import { signUp } from "./api";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Register.module.css";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //Router dieu huong
  const router = useRouter();

  //Thong bao Toast
  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  //Kiem tra user da dang nhap chua
  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("authtoken")) {
      router.replace("/");
    }
  }, [router]);

  //event dang ky user
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (handleValidation()) {
      {
        const { password, username, email } = values;
        try {
          const { data } = await signUp({ password, username, email });

          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("authtoken", JSON.stringify(data.authToken));
          router.replace("/");
        } catch (error: any) {
          typeof error.response.data?.message === "string"
            ? toast.error(error.response.data?.message, toastOptions)
            : toast.error(error.response.data?.message[0], toastOptions);
        }
      }
    }
  };

  //validate input
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", toastOptions);
      return false;
    } else if (username.length < 4) {
      toast.error("Username should have at least 4 characters", toastOptions);
      return false;
    } else if (password.length > 8) {
      toast.error("Password should have at least 8 characters", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    }
    return true;
  };

  //rende register page
  return (
    <>
      <Head>
        <title>Register Page</title>
        <meta name="description" content="Register page create by Nam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
          <div className={styles.brand}>
            <h1>Register</h1>
          </div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => setValues({ ...values, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={(e) =>
              setValues({ ...values, confirmPassword: e.target.value })
            }
          />
          <button type="submit">Create</button>
          <span>
            Already have an account? <Link href="/login">Login</Link>
          </span>
        </form>
      </main>
      <ToastContainer />
    </>
  );
}
