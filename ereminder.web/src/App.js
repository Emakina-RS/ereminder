import React from "react";
import "./App.css";
import Input from "./components/Input";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Input placeholder="Unesite vašu e-mail adresu" />
      <Input placeholder="Unesite vašu šifru" />
      <Input placeholder="Ponovite vašu šifru" />
      <button>Registruj se</button>
      <span>
        Već imate nalog? Uloguj se <a href="">ovde</a>
      </span>
    </div>
  );
}

export default App;
