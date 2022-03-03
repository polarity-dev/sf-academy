import "./assets/css/App.css";
import MyRoutes from "./MyRoutes";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <MyRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
