import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./lib/navigation/Routes";
import { Toaster } from "sonner";
import "./App.css";

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
