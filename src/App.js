import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline } from '@mui/material';
import { LoginPage, HomePage, RegisterPage } from 'pages';
import { MainWindow, TitleBar } from 'components';
import { PathConstant } from 'const';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainWindow>
        <TitleBar/>
        <CssBaseline/>
        <HashRouter>
          <Routes>
            <Route path={PathConstant.PATH_HOME} element={<HomePage/>}/>
            <Route path={PathConstant.PATH_LOGIN} element={<LoginPage/>}/>
            <Route path={PathConstant.PATH_REGISTER} element={<RegisterPage/>}/>
          </Routes>
        </HashRouter>
      </MainWindow>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
