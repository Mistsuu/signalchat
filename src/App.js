import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline } from '@mui/material';
import { ChatPage } from 'pages';
import { MainWindow, TitleBar } from 'components';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainWindow>
        <TitleBar/>
        <CssBaseline/>
        <ChatPage/>
      </MainWindow>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
