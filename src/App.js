import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { AuthProvider } from 'src/contexts/AuthContext';
import { StoreProvider, createStore } from 'easy-peasy';
import model from './model';

const App = () => {
  const routing = useRoutes(routes);

  const store = createStore({
    orders: [],
    price: null,
    userData: {}
  });
  console.log(model);

  return (
    <AuthProvider>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {routing}
        </ThemeProvider>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;
