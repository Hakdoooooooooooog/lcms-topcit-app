import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Routes from "./lib/navigation/Routes";
import { Toaster } from "sonner";
function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <Toaster visibleToasts={1} expand={true} />
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </>
  );
}

export default App;
