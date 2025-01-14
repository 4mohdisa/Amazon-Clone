import Product from "./Product";

function ProductFeed({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No products available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
            {products
                .slice(0, 4)
                .map(({ id, title, price, description, category, image }) => (
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

            <img
                className="md:col-span-full mx-auto"
                src="https://links.papareact.com/dyz"
                alt="Amazon Advertising"
            />

            <div className="md:col-span-2">
                {products
                    .slice(4, 5)
                    .map(({ id, title, price, description, category, image }) => (
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
                .map(({ id, title, price, description, category, image }) => (
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