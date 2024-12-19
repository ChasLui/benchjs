import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  //
  index("routes/home.tsx"),
  route("playground", "routes/editor/root.tsx"),
] satisfies RouteConfig;
