import React from "react";
import Styles from "./login-styles.scss";
import Spinner from "@/pressentation/components/spinner/spinner";
import LoginHeader from "@/pressentation/components/login-header/login-header";
import Footer from "@/pressentation/components/footer/footer";
import Input from "@/pressentation/components/input/input";
import FormStatus from "@/pressentation/components/form-status/form-status";

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader />

      <form className={Styles.form}>
        <h2>Login</h2>
        <Input type="email" name="email" placeholder="Digite seu e-mail" />
        <Input type="password" name="password" placeholder="Digite sua senha" />

        <button className={Styles.submit} type="submit">
          Entrar
        </button>
        <span className={Styles.link}>Criar Conta</span>
        <FormStatus />
      </form>

      <Footer />
    </div>
  );
};

export default Login;
