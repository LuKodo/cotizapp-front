import { lazy, StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/main.css'
import { NotFound } from './components/core/NotFound.tsx'
import { Tax } from './modules/Tax.tsx'
import { ProductType } from './modules/ProductType.tsx'
const Dashboard = lazy(() => import('./modules/Dashboard'))
import Loading from "./components/core/Loader.tsx";
import { Client } from './modules/Client.tsx'
import { Product } from './modules/Product.tsx'
import Layout from './components/core/Layout.tsx'
import { Budget } from './modules/Budget.tsx'
import { Provider } from './modules/Provider.tsx'
import { BudgetForm } from './components/BudgetForm.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
        errorElement: <NotFound />,
      },
      {
        path: '/config/tax',
        element: <Tax />,
        errorElement: <NotFound />,
      },
      {
        path: '/config/product-types',
        element: <ProductType />,
        errorElement: <NotFound />,
      },
      {
        path: '/config/clients',
        element: <Client />,
        errorElement: <NotFound />,
      },
      {
        path: '/product',
        element: <Product />,
        errorElement: <NotFound />,
      },
      {
        path: '/config/provider',
        element: <Provider />,
        errorElement: <NotFound />,
      },
      {
        path: '/budget',
        element: <Budget />,
        errorElement: <NotFound />,
      },
      {
        path: '/budget/:id',
        element: <BudgetForm />,
        errorElement: <NotFound />,
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
