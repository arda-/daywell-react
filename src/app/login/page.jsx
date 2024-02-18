"use client";

import { useState } from "react";
import { useUser } from "@/lib/context/user";

export default function Login() {
  const user = useUser();

  console.log(JSON.stringify(user, null, 2));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section>
      <h1>Login or register</h1>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <div>
          <button
            className="button"
            type="button"
            onClick={() => user.login(email, password)}
          >
            Login
          </button>
          <button
            className="button"
            type="button"
            onClick={() => user.register(email, password)}
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
}
