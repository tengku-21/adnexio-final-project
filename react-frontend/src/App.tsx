import { RouterProvider } from "react-router";
import router from "./app/router";
import { PackageProvider } from "./context/packageProvider";
import { useGetPackagesQuery } from "./APIs/package/packagesApi";

function App() {
  const {
    data: packageData,
    isLoading: isPackageLoading,
    isError: isPackageError,
  } = useGetPackagesQuery();

  // if (isPackageLoading) {
  //   return <div>Loading packages...</div>;
  // }

  // if (isPackageError) {
  //   return <div>Failed to load packages.</div>;
  // }

  return (
    <PackageProvider packages={packageData}>
      <RouterProvider router={router} />
    </PackageProvider>
  );
  
  // return <RouterProvider router={router} />;
}

export default App;