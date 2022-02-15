import Head from "next/head";
import Banner from "../components/Banner"
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";
import Footer from "../components/Footer";
import { getSession } from "next-auth/react";

export default function Home({ products }) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>
     {/* Header */}
     <Header/>
     <main className="max-w-screen-2xl mx-auto">
       {/* Banner */}
       <Banner/>
       {/* Product */}
       <ProductFeed products={products} />
     </main>
     <Footer/>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  const products = await fetch('https://fakestoreapi.com/products').then(response => response.json())

  return { props: {
    products, session
  } }
}


