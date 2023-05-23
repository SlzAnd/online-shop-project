import ProductList from "../components/ProductList";
import Header from "../components/Header";

const AdminPage = () => {
    return (
        <div className="admin-page">
            <Header/>
            <h1>All Products</h1>
            <ProductList/>
        </div>
    )
}

export default AdminPage;