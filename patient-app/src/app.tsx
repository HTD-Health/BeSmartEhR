import { QueryClient, QueryClientProvider } from 'react-query';

import AppRouter from 'app_router';

const App = (): JSX.Element => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AppRouter />
        </QueryClientProvider>
    );
};

export default App;
