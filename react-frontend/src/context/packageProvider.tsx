import { createContext, useContext } from "react";

const PackageContext = createContext(null);

export const PackageProvider = ({ children, packages }) => {
    return (
        <PackageContext.Provider value={packages}>
            {children}
        </PackageContext.Provider>
    );
};

export const usePackages = () => {
    const context = useContext(PackageContext);

    if (context === null) {
        throw new Error("usePackages must be used inside PackageProvider");
    }

    return context;
};
