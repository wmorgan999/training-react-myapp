import { Routes, Route, Link } from 'react-router-dom'
import CustomersPage from './pages/CustomersPage'
import CustomerDetailPage from './pages/CustomerDetailPage'

export default function App() {
  return (
    <>
      <nav><Link to="/">Customers</Link></nav>
      <Routes>
        <Route path="/" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </>
  )
}
