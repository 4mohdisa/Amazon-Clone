##Amazon 2.0
Amazon 2.0 is a full-stack web application designed to simulate an e-commerce platform similar to Amazon. This project was created as part of a web development course and built using Node.js, Express, and MongoDB.

##Getting Started
To run this application on your local machine, follow the steps outlined below:

##Clone this repository to your local machine using the following command:

##bash
Copy code
git clone https://github.com/4mohdisa/amazon-2.0-.git
Install the required dependencies using the following command:

##Copy code
npm install
Create a .env file in the root directory of the project and add the following environment variables:

makefile
Copy code
DATABASE_URL=<your_mongodb_uri>
PORT=<port_number>
SESSION_SECRET=<session_secret_key>
You can get your MongoDB URI from your MongoDB account or use a local MongoDB database. The PORT variable should be set to the port you want to run the application on, and the SESSION_SECRET variable should be set to a secret key for session management.

Start the server using the following command:

sql
Copy code
npm start
Visit http://localhost:<port_number> in your web browser to access the application.

Features
User authentication: Users can register for an account or log in with their existing account to access the application features.
Shopping cart functionality: Users can add and remove products to/from their shopping cart and proceed to checkout for payment.
Product search and filtering: Users can search for products based on keywords or apply filters based on categories, price range, or product ratings.
Product reviews and ratings: Users can rate and review products they have purchased.
Admin dashboard: Admin users can access a separate dashboard for managing products and orders.
Stripe integration: The application is integrated with Stripe for processing payments.
Technologies Used
The following technologies were used in the development of this application:

Node.js: A JavaScript runtime environment for executing server-side code.
Express: A popular Node.js web application framework for building web applications and APIs.
MongoDB: A NoSQL database used for storing data in JSON-like documents.
EJS (Embedded JavaScript): A simple templating language that lets you generate HTML markup with plain JavaScript.
Bootstrap: A popular CSS framework for building responsive and mobile-first websites.
Stripe: A payment processing platform used for accepting credit card payments.
Contributing
Contributions are welcome! If you find any issues or would like to contribute to this project, please submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.





Mohammed Isa
I used nextjs tailwind stripe firebase 
E-Commerce Website
This is an e-commerce website built using Next.js, Tailwind CSS, Stripe, and Firebase.

Getting Started
To run this application on your local machine, follow the steps outlined below:

Clone this repository to your local machine using the following command:

bash
Copy code
git clone https://github.com/yourusername/e-commerce-website.git
Install the required dependencies using the following command:

Copy code
npm install
Create a .env.local file in the root directory of the project and add the following environment variables:

makefile
Copy code
NEXT_PUBLIC_STRIPE_API_KEY=<your_stripe_api_key>
NEXT_PUBLIC_FIREBASE_API_KEY=<your_firebase_api_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_firebase_project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your_firebase_app_id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your_firebase_measurement_id>
You can get your Stripe API key by signing up for a Stripe account and following the instructions in the Stripe dashboard. To set up Firebase, you can create a new project in the Firebase console and follow the instructions to get your API keys.

Start the server using the following command:

arduino
Copy code
npm run dev
Visit http://localhost:3000 in your web browser to access the application.

Features
User authentication: Users can register for an account or log in with their existing account to access the application features.
Shopping cart functionality: Users can add and remove products to/from their shopping cart and proceed to checkout for payment.
Product search and filtering: Users can search for products based on keywords or apply filters based on categories, price range, or product ratings.
Product reviews and ratings: Users can rate and review products they have purchased.
Admin dashboard: Admin users can access a separate dashboard for managing products and orders.
Stripe integration: The application is integrated with Stripe for processing payments.
Firebase integration: The application is integrated with Firebase for user authentication, data storage, and hosting.
Technologies Used
The following technologies were used in the development of this application:

Next.js: A React-based framework for building server-side rendered (SSR) web applications.
Tailwind CSS: A utility-first CSS framework for building custom UI designs quickly.
Stripe: A payment processing platform used for accepting credit card payments.
Firebase: A comprehensive platform for building mobile and web applications, with features such as authentication, data storage, and hosting.
Contributing
Contributions are welcome! If you find any issues or would like to contribute to this project, please submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.


### See demo here: https://amazon-2-0-liart.vercel.app/

### AMAZON 2.0!

![image](https://user-images.githubusercontent.com/84847782/162528926-935d14b5-b374-4a8d-b641-a33b258666d1.png)

