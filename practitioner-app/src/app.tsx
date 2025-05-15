import AppRouter from '@/app_router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JSX } from 'react';

const App = (): JSX.Element => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AppRouter />
        </QueryClientProvider>
    );
};

export default App;
