import React from 'react'
import { BrowserRouter } from "react-router-dom";
import RouterController from './router/RouterController'
function App() {
  return (
   <BrowserRouter>
      <RouterController />
    </BrowserRouter>
  )
}

export default App;