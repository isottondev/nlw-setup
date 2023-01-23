import { List } from "phosphor-react";
import logo from "../assets/logo.svg";


export function Header() {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={logo} alt="Logo alternativo" />
      <button
        className=" font-semibold rounded-lg px-6 py-4 flex gap-3 items-center"
      >
        <List size={20} className="text-violet-500" />
      </button>
    </div>
  );
}