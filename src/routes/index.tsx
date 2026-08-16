import { createBrowserRouter, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { ROUTES } from './routes';
import { AppLayout } from '@/components/layout';
import {
  LazyLoginView,
  LazySignupView,
  LazyStayInstructionsView,
  LazyStayDetailView,
  LazyNotFoundView,
  LazyDashboardView,
  LazyPropertyListView,
  LazyPropertyDetailView,
  LazyReconcileStaysView,
  LazyCreatePropertyView,
  LazyConnectAuthorizeView,
  LazyConnectedAppsView,
  LazyForgotPasswordView,
  LazyResetPasswordView,
  LazyChangePasswordView,
  LazyBillingSettingsView,
} from './lazyComponents';

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <LazyDashboardView />,
      },
      {
        path: ROUTES.properties,
        element: <LazyPropertyListView />,
      },
      {
        path: ROUTES.createProperty,
        element: <LazyCreatePropertyView />,
      },
      {
        path: ROUTES.property(':property_id'),
        element: <LazyPropertyDetailView />,
      },
      {
        path: ROUTES.reconcileStays,
        element: <LazyReconcileStaysView />,
      },
      {
        path: ROUTES.stayDetail(':property_id', ':stay_id'),
        element: <LazyStayDetailView />,
      },
      {
        path: ROUTES.connectedApps,
        element: <LazyConnectedAppsView />,
      },
      {
        path: ROUTES.changePassword,
        element: <LazyChangePasswordView />,
      },
      {
        path: ROUTES.billingSettings,
        element: <LazyBillingSettingsView />,
      },
    ],
  },
  {
    path: ROUTES.stayInstructions(':stay_id'),
    element: <LazyStayInstructionsView />,
  },
  {
    // Sem ProtectedRoute de propósito: esta rota trata autenticação
    // embutida na própria tela para nunca perder `?request_id=` da URL (o
    // par ProtectedRoute/LoginView hoje só restaura `.pathname`, não
    // `.search`, no retorno do login).
    path: ROUTES.connectAuthorize,
    element: <LazyConnectAuthorizeView />,
  },
  {
    // Sem guard de propósito, mesmo motivo de ROUTES.connectAuthorize acima:
    // precisa funcionar com ou sem sessão ativa, e o PublicRoute redirecionaria
    // usuários já logados para fora antes de conseguirem redefinir a senha.
    path: ROUTES.resetPassword,
    element: <LazyResetPasswordView />,
  },
  {
    path: ROUTES.login,
    element: (
      <PublicRoute>
        <LazyLoginView />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.signup,
    element: (
      <PublicRoute>
        <LazySignupView />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.forgotPassword,
    element: (
      <PublicRoute>
        <LazyForgotPasswordView />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <LazyNotFoundView />,
  },
]);
