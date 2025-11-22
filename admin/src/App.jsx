import React from 'react'
import { BrowserRouter } from "react-router-dom";
import RouterController from './router/RouterController'
import { Toaster } from 'sonner';
function App() {
  return (
   <BrowserRouter>
   <Toaster/>
      <RouterController />
    </BrowserRouter>
  )
}

export default App;