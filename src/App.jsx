
import AppRouter from './routes/AppRoutes.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName={() =>
          "relative flex p-4 rounded-xl justify-between overflow-hidden cursor-pointer bg-card border border-border shadow-lg text-foreground"
        }
        bodyClassName="text-sm text-foreground"
        progressClassName="bg-primary"
      />
    </>
  );
};

export default App;
