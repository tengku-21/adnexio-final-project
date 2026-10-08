import {createBrowserRouter} from "react-router";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "../routes/ProtectedRoute";
import GuestRoute from "../routes/GuestRoute";
import OrderPage from "@/pages/features/order/OrderPage";
import BookPelamin from "@/pages/features/book/BookingPage";
import PackagePage from "@/pages/features/package/PackagePage";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard/> ,
        children :[{
          path: "order",
          element: <OrderPage/> ,
        },
        {
          path: "book",
          element: <BookPelamin/> ,
        },
        {
          path: "package",
          element: <PackagePage/> ,
        },
      ]
      },
      
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;