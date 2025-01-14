# Twitter Trends Scraper

This project is a web application that scrapes trending topics from Twitter using Selenium and displays them on a React frontend. The backend is built with Node.js and Express, and it uses MongoDB to store the scraped data.

## Technologies Used

- **Frontend**: React, Vite, Framer Motion
- **Backend**: Node.js, Express, Selenium WebDriver, MongoDB
- **Other**: ProxyMesh for proxy management, dotenv for environment variables

## Live Demo

![Live Demo](assets/working.mp4)

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- ProxyMesh account for proxy management

### Backend Setup

1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the [backend](http://_vscodecontentref_/1) directory and add the following environment variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    TWITTER_USERNAME=your_twitter_username
    TWITTER_PASSWORD=your_twitter_password
    TWITTER_VERIFICATION_USERNAME=your_twitter_verification_username
    PROXYMESH_USERNAME=your_proxymesh_username
    PROXYMESH_PASSWORD=your_proxymesh_password
    PORT=3001
    ```

4. Start the backend server:
    ```sh
    node server.js
    ```

### Frontend Setup

1. Navigate to the [frontend](http://_vscodecontentref_/2) directory:
    ```sh
    cd frontend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the frontend development server:
    ```sh
    npm run dev
    ```

### Running the Application

1. Ensure the backend server is running.
2. Open your browser and navigate to `http://localhost:3000`.
3. Click the "Click here to run the script" button to scrape the latest Twitter trends.


## License

This project is licensed under the MIT License.