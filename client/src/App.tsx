import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Router from "@/shared/Router";
import { useWindowSize } from "@/store/windowSizeStore";
import "@/assets/styles/App.scss";

const queryClient = new QueryClient();

function App() {
    useWindowSize();
    return (
        <div className="wrap">
            <QueryClientProvider client={queryClient}>
                <Router />
            </QueryClientProvider>
        </div>
    );
}

export default App;
