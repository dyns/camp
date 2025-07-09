import { redirect, NavLink } from "react-router";

export default function LogIn() {
  return (
    <div style={{ background: "white" }}>
      Log In Here
      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Enter you email to receive a sign in link:
        </legend>
        <input type="text" className="input" placeholder="email ..." />
        <NavLink className="btn btn-primary" to="/trip">
          Get sign in link
        </NavLink>
        <p className="label">Or create a new account:</p>
        <NavLink className="btn btn-outline btn-secondary" to="/create-account">
          Create a new account
        </NavLink>
      </fieldset>
    </div>
  );
}
