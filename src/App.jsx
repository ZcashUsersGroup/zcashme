import './index.css'
import { Routes, Route} from 'react-router-dom'
import ZcasherProfile from './ZcashProfile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ZcasherProfile />} />
      <Route path="/:id" element={<ZcasherProfile />} />
    </Routes>
  )
}

export default App
