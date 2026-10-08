import { Outlet } from "react-router"


//probably here in future just parse the context provider for protected routes
export default function Dashboard() {
    return (
        <div className="w-full p-8">
        <Outlet/>
        </div>
    )
}
