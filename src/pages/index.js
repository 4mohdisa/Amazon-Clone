import Head from "next/head";
import Banner from "../components/Banner"
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";
import Footer from "../components/Footer";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  selectProducts, 
  selectProductsLoading, 
  selectLastFetched,
  setProducts,
  setLoading,
  setError
} from "../slices/productsSlice";

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export default function Home({ initialProducts, session }) {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const lastFetched = useSelector(selectLastFetched);

  useEffect(() => {
    if (initialProducts && products.length === 0) {
      dispatch(setProducts(initialProducts));
    }
  }, [dispatch, initialProducts]);

  useEffect(() => {
    const shouldFetchProducts = () => {
      if (!lastFetched) return false;
      return Date.now() - lastFetched > CACHE_DURATION;
    };

    const fetchProducts = async () => {
      if (!shouldFetchProducts()) return;

      dispatch(setLoading());
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch(setProducts(data));
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(setError(error.message));
      }
    };

    fetchProducts();
  }, [dispatch, lastFetched]);

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>
      <Header/>
      <main className="max-w-screen-2xl mx-auto">
        <Banner/>
        <ProductFeed products={products} loading={loading} />
      </main>
      <Footer/>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const initialProducts = await response.json();

    return {
      props: {
        initialProducts,
        session
      }
    };
  } catch (error) {
    console.error('Error fetching initial products:', error);
    return {
      props: {
        initialProducts: [],
        session
      }
    };
  }
}
