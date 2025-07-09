import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/create-account", "routes/createAccount.tsx"),
  route("/account-settings", "routes/accountSettings.tsx"),
  route("/trip", "routes/trip.tsx"),
  route("/category/:id", "routes/category.tsx"),
] satisfies RouteConfig;
