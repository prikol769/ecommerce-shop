import React, {useEffect} from 'react';
import {Product, HeroBanner, FooterBanner} from '../components';
import {client} from '../lib/client';
import {useStateContext} from '../context/StateContext';

const Home = ({products, bannerData}) => {
    const {setCartItems, selectedProductsStorage,setTotalPrice, setTotalQuantities} = useStateContext();

    useEffect(() => {
        if(selectedProductsStorage.length){
            let selectedProducts = [];
            let totalPriceStorage = 0;
            let totalQuantitiesStorage = 0;

            selectedProductsStorage?.filter((storageProduct) => {
                for (let i = 0; i <= products.length; i++) {
                    if (storageProduct._id === products[i]?._id) {
                        selectedProducts.push({...products[i], quantity: storageProduct.quantity })
                        totalPriceStorage = totalPriceStorage + products[i].price * storageProduct.quantity
                        totalQuantitiesStorage = totalQuantitiesStorage + storageProduct.quantity
                    }
                }

            })

            setCartItems(selectedProducts);
            setTotalQuantities(totalQuantitiesStorage);
            setTotalPrice(totalPriceStorage);
        }
    }, [])
    return (
        <div>
            <HeroBanner heroBanner={bannerData.length && bannerData[0]}/>
            <div className="products-heading">
                <h2>Best Selling Products</h2>
                <p>Speakers of many variations</p>
            </div>
            <div className="products-container">
                {products?.map((product) => <Product key={product._id} product={product}/>)}
            </div>

            <FooterBanner footerBanner={bannerData && bannerData[0]}/>
        </div>
    );
};

export const getServerSideProps = async () => {
    const query = '*[_type == "product"]';
    const products = await client.fetch(query);

    const bannerQuery = '*[_type == "banner"]';
    const bannerData = await client.fetch(bannerQuery);

    return {
        props: {products, bannerData}
    }
}

export default Home;


