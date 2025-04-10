import MainLayout from "./layout/MainLayout";
import AddMeal from "./pages/AddMeal";
import AllMeals from "./pages/AllMeals";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/login/Login";

export default [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "meals/new",
        Component: AddMeal,
      },
      {
        path: "meals",
        Component: AllMeals,
      },
      {
        path: "*",
        // element: <NotFound />,
        Component: NotFound,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
];

{
  /* <MainLayout /> wraps:

├── "/" (index) → <Planner />
├── "/meals/new" → <AddMeal />
├── "/meals" → <AllMeals />
├── "/home" → <Home />
└── "*" → <NotFound />
 */
}
