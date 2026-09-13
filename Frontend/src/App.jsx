import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Logo from './components/onboarding/Logo'
import StepTwo from './components/onboarding/StepTwo'
import StepOne from './components/onboarding/StepOne'
import StepThree from './components/onboarding/StepThree'
import Home from './components/Home/Home'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Logo />} />
        <Route path="/step-one" element={<StepOne />} />
        <Route path="/step-two" element={<StepTwo />} />
        <Route path="/step-three" element={<StepThree />} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </div>
  )
}

export default App
