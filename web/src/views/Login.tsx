

import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";

function Login() {
  return (
    <Fragment>
      <Header />
      <Link
        to={"/home"}
        className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex gap-3 items-center hover:border-violet-300"
      >
        home
      </Link>
    </Fragment>
  )
}

export default Login;
