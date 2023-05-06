import './App.css';
import { BrowserRouter as Router, Routes,
    Route } from "react-router-dom";
import AddProductForm from "./components/AddProductForm";
import AdminPage from "./pages/AdminPage";
import MyButton from "./components/MyButton";


function App() {
  return (
    <div className="App">
        <AdminPage/>

    </div>
  );
}

export default App;
