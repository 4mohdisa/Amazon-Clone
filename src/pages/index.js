import Head from "next/head";
import Banner from "../components/Banner"
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import { 
  selectProducts, 
  setProducts,
  setLoading,
  setError
} from "../slices/productsSlice";

export default function Home({ products: initialProducts }) {
  const dispatch = useDispatch();
  const reduxProducts = useSelector(selectProducts);
  const [loading, setLocalLoading] = useState(true);
  const [error, setLocalError] = useState(null);

  // Initialize products in Redux store
  useEffect(() => {
    if (initialProducts && (!reduxProducts || reduxProducts.length === 0)) {
      dispatch(setProducts(initialProducts));
    }
    setLocalLoading(false);
  }, [dispatch, initialProducts, reduxProducts]);

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      <Header />

      <main className="max-w-screen-2xl mx-auto">
        <Banner />

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500 text-lg">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="button mt-4"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ProductFeed products={reduxProducts || initialProducts} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();

    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        error: 'Failed to fetch products'
      },
    };
  }
}
