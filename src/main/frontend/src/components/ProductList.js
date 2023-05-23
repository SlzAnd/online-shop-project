import React, {useState, useEffect} from "react";
import axios from "axios";

const ProductList = () => {

    const [productList, setProductList] = useState([]);
    const fetchProductList = () => {
        axios.get("http://localhost:8080/api/products").then(res => {
            console.log(res);
            setProductList(res.data);
        })
    }

    useEffect(() => {
        fetchProductList()
    }, [])

    return productList.map((productList, index) => {
        return (
            <div className={"productCard"}>
                <h2>{productList.name}</h2>
                <h3>Price: {productList.price} uah</h3>
                <h3>Quantity: {productList.quantity}</h3>
                <p>Description: {productList.description}</p>
            </div>
        )
    })
}

export default ProductList;