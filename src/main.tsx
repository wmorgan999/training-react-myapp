import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('index.html has no #root element')   // narrows `HTMLElement | null` to `HTMLElement`

createRoot(root).render(
  <BrowserRouter><App /></BrowserRouter>
)
