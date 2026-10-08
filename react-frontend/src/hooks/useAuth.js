import { useSelector } from "react-redux";

const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  return {
    name: user?.name || "",
    role: user?.role || "",
    email: user?.email || "",
    token: token || "",
    isAuthenticated: !!token,
    isAdmin : user?.role == "admin"
  };
};

export default useAuth;
