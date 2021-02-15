import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
/* import { useRoutes } from 'react-router-dom'; */
import { useRoutes } from 'hookrouter';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
/* import routes from 'src/routes'; */
import { AuthProvider } from 'src/contexts/AuthContext';
import { StoreProvider, createStore } from 'easy-peasy';
import MainLayout from 'src/layouts/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import DashboardView from 'src/views/reports/DashboardView';
import DashboardLayout from 'src/layouts/DashboardLayout';
import RegisterView from 'src/views/auth/RegisterView';
import { useAuth } from 'src/contexts/AuthContext';
import model from './model';

const App = () => {
  const routes = {
    '/': () => (
      <MainLayout>
        <LoginView />
      </MainLayout>
    ),
    '/login': () => (
      <MainLayout>
        <LoginView />
      </MainLayout>
    ),
    '/app/dashboard': () => (
      <DashboardLayout>
        <DashboardView />
      </DashboardLayout>
    ),
    '/register': () => (
      <MainLayout>
        <RegisterView />
      </MainLayout>
    )
  };

  const routing = useRoutes(routes);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />

        {/* <LoginView /> */}
        {routing || <h1>Invalid routing</h1>}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
