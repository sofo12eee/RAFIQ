import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import WashRahYsrali from './pages/WashRahYsrali'
import TreatmentDetail from './pages/TreatmentDetail'
import KifashN3ich from './pages/KifashN3ich'
import TipDetail from './pages/TipDetail'
import Sijil from './pages/Sijil'
import MshWahdek from './pages/MshWahdek'
import Family from './pages/Family'
import SawtElMrid from './pages/SawtElMrid'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="wash-rah-ysrali" element={<WashRahYsrali />} />
        <Route path="wash-rah-ysrali/:id" element={<TreatmentDetail />} />
        <Route path="kifash-n3ich" element={<KifashN3ich />} />
        <Route path="kifash-n3ich/:id" element={<TipDetail />} />
        <Route path="sijil" element={<Sijil />} />
        <Route path="msh-wahdek" element={<MshWahdek />} />
        <Route path="family" element={<Family />} />
        <Route path="sawt-el-mrid" element={<SawtElMrid />} />
      </Route>
    </Routes>
  )
}

export default App
