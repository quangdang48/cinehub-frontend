import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import { Header, Footer } from '@/components';
import AppRoutes from './routes/Route';

function App() {
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Header />
            <AppRoutes />
            <Footer />
          </BrowserRouter>
        </PersistGate>
    </Provider>
  );
}

export default App;
