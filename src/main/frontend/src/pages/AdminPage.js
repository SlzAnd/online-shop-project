import ProductList from "../components/ProductList";
import AddProductForm from "../components/AddProductForm";
import MyButton from "../components/MyButton";

const AdminPage = () => {
    return (
        <div className="admin-page">
            <h1>All Products</h1>
            <MyButton formComponent={AddProductForm}/>
            <ProductList/>
        </div>
    )
}

export default AdminPage;