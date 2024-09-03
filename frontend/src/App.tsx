import React, { useEffect, useState } from 'react';

import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { persistor, store } from './components/store';
import router from './components/routes';


const App = () => {
 
  return <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <RouterProvider router={router}/>
              <ToastContainer/>
            </PersistGate>
         </Provider>
};

export default App;



