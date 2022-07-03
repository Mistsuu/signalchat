import './App.css';
import { CssBaseline } from '@mui/material';
import { ChatPage } from './pages';
import { TitleBar } from 'components';

const App = () => {
  return (
    <>
      <TitleBar className="titlebar"/>
      <CssBaseline/>
      <ChatPage/>
    </>
  );
}

export default App;
