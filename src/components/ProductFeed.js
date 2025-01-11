import Product from "./Product";

function ProductFeed({ products, loading }) {
    if (loading) {
        return (
            <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="m-5 p-10 bg-white z-30 animate-pulse">
                        <div className="w-full h-[200px] bg-gray-200 mb-4"></div>
                        <div className="h-4 bg-gray-200 w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
            {products
                .slice(0,4)
                .map(({id, title, price, description, category, image}) => (
                    <Product
                        key={id}
                        id={id}
                        title={title}
                        price={price}
                        description={description}
                        category={category}
                        image={image}
                    />
            ))}

            {products.length > 0 && (
                <img
                    src="https://links.papareact.com/dyz"
                    alt=""
                    className="md:col-span-full"
                />
            )}

            <div className="md:col-span-2">
                {products
                    .slice(4,5)
                    .map(({id, title, price, description, category, image}) => (
                        <Product
                            key={id}
                            id={id}
                            title={title}
                            price={price}
                            description={description}
                            category={category}
                            image={image}
                        />
                ))}
            </div>

            {products
                .slice(5, products.length)
                .map(({id, title, price, description, category, image}) => (
                    <Product
                        key={id}
                        id={id}
                        title={title}
                        price={price}
                        description={description}
                        category={category}
                        image={image}
                    />
            ))}
        </div>
    );
}

export default ProductFeed;