import * as React from 'react';

import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Navbar from './components/Navbar';
import PendingData from './components/PendingData';
import Data from './components/Data';
import SendData from './components/SendData';

import { LinkProps } from '@mui/material/Link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, LinkProps as RouterLinkProps } from 'react-router-dom';

// Dal blog di MUI
const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <Link ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

class App extends React.Component {

  constructor(props: IAppProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}> </Route>
          <Route path="/getPendingData" element={<PendingData />}></Route>
          <Route path="/getData" element={<Data />}></Route>
          <Route path="/insert" element={<SendData />}></Route>
        </Routes>
      </div>
    );
  }
}

export interface IAppProps { }

export interface IAppState { }

export default App;
