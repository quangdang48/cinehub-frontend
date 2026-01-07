import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import { Header, Footer } from "@/components";
import AppRoutes from "./routes/Route";
import { Toaster } from "./components/ui/sonner";
import { NotificationProvider } from "./providers/NotificationProvider";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotificationProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Header />
            <AppRoutes />
            <Footer />
          </BrowserRouter>
        </NotificationProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
