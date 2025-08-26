import './index.css'
import { Routes, Route} from 'react-router-dom'
import ZcashProfile from './ZcashProfile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ZcashProfile />} />
      <Route path="/:id" element={<ZcashProfile />} />
    </Routes>
  )
}

export default App
