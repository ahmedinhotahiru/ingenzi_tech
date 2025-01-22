import { FC, lazy } from "react";
const Index = lazy(() => import("../pages/Index.tsx"));
const Test = lazy(() => import("../pages/Index.tsx"));
const Admin = lazy(() => import("../pages/Admin.tsx"));

export interface RouteConfig {
  path: string;
  component: FC;
  exact?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Index,
    exact: true,
  },
  {
    path: "/test/:id",
    component: Test,
  },
  {
    path: "/admin",
    component: Admin,
  },
];

export default routes;
