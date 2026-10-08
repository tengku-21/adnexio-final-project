import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { store } from "./app/store";
import { Provider } from "react-redux"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
)
