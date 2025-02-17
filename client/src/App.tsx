import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Router from "@/shared/Router";
import "@/assets/styles/App.scss";

const queryClient = new QueryClient();

function App() {
    return (
        <div className="wrap">
            <QueryClientProvider client={queryClient}>
                <Router />
            </QueryClientProvider>
        </div>
    );
}

export default App;
