import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/create-account", "routes/createAccount.tsx"),
  route("/create-category", "routes/createCategory.tsx"),
  route("/account-settings", "routes/accountSettings.tsx"),
  route("/trips", "routes/trips.tsx"),
  route("/trip", "routes/trip.tsx"),
  route("/trip-settings", "routes/tripSettings.tsx"),
  route("/category/:id", "routes/category.tsx"),
] satisfies RouteConfig;
