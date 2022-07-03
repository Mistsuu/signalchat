import './App.css';
import { CssBaseline } from '@mui/material';
import { ChatPage } from './pages';
import { MainWindow, TitleBar } from 'components';

const App = () => {
  return (
    <>
      <MainWindow>
        <TitleBar/>
        <CssBaseline/>
        <ChatPage/>
      </MainWindow>
    </>
  );
}

export default App;
