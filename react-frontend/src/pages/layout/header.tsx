import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/APIs/auth/authApi";
import { logout as logoutAction } from "@/APIs/auth/authSlice";
import { apiSlice } from "@/APIs/api/apiSlice";

///Just a header part - will show globally

export default function Header() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clears user + token in Redux and removes the token from localStorage
      dispatch(apiSlice.util.resetApiState())
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-wedding text-xl font-bold">
          3SahabatWedding
        </Link>

        <div className="flex items-center gap-2">
          {token ? (
            <>
            <Button variant="ghost" >
                <Link to="/dashboard/order">Dashboard</Link>
            </Button>
            <Button onClick={handleLogout} disabled={isLoading}>
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" >
                <Link to="/login">Login</Link>
              </Button>
              <Button >
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}