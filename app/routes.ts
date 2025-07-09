import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/trip.tsx"),
  // route("/trip", "routes/trip.tsx"),
  route("/category/:id", "routes/category.tsx"),
] satisfies RouteConfig;
