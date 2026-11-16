import { Routes, Route, Link } from 'react-router-dom'
import CustomersPage from './pages/CustomersPage'

export default function App() {
  return (
    <>
      <nav><Link to="/">Customers</Link></nav>
      <Routes>
        <Route path="/" element={<CustomersPage />} />
      </Routes>
    </>
  )
}