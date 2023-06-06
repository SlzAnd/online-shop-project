import ProductList from "../components/ProductList";
import NavBar from "../components/NavBar";
import React, {useEffect, useState} from "react";
import axios from "axios";


const AdminPage = () => {

    const [productList, setProductList] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);


    const fetchProductList = (searchQuery) => {
        if (searchQuery === undefined){
            searchQuery = '';
        }
        console.log(searchQuery)
        axios.get(`http://localhost:8080/api/products?search=${searchQuery}`).then(res => {
            console.log(res);
            setProductList(res.data);
        })
    }

    useEffect(() => {
        if (initialLoad) {
            fetchProductList();
            setInitialLoad(false);
        }
    }, [])


    const updateProductList = (searchQuery) => {
        fetchProductList(searchQuery);
    };

    return (
        <div className="">
            <NavBar updateProducts={updateProductList}/>
            <h1 className="mt-3 mb-3">Products</h1>
            <div className="m-1">
                <ProductList productList={productList} updateProducts={updateProductList}/>
            </div>
        </div>
    )
}

export default AdminPage;