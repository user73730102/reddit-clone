# A Modern Social Media Platform (Reddit Clone)

Check out the **[Live Demo](https://client-docker.onrender.com/)**.
> **Note:** The server is hosted on a free tier, so it may take ~30 seconds to load initially while it spins up.

<p align="center">
  A feature-rich, full-stack social media and content aggregation platform built with a modern technology stack, inspired by Reddit.
</p>

<p align="center">
  <!-- Badges -->
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Node.js-18-green?logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-green?logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Docker-blue?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/Sentry-black?logo=sentry" alt="Sentry">
</p>

![Project Screenshot](https://i.imgur.com/o3aNXIQ.png) 
<!-- Tip: Take a great screenshot of your app (in dark mode!) and upload it to a site like Imgur to get a URL to paste here. -->

## ✨ Features

- **Full User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- **Community Creation & Browsing:** Users can create their own communities (subreddits) or browse existing ones.
- **Rich Post Creation:** Create posts with text, images, or videos.
- **Media Uploads:** Seamless, direct-to-cloud media uploads handled by Cloudinary.
- **Real-time Voting System:** Upvote and downvote posts with immediate UI feedback.
- **User Profile Pages:** View user profiles with a complete history of their posts and manage your own account details.
- **Modern UI/UX:**
  - Fully responsive design for desktop and mobile.
  - Beautiful dark and light modes, switchable with a single click.
  - Clean, icon-driven interface using Lucide React.
- **Production-Ready Foundation:**
  - **CI/CD Pipeline:** Automated testing, Docker image builds, and deployments using GitHub Actions.
  - **Containerized:** Fully containerized client and server applications with Docker.
  - **Error Monitoring:** Integrated with Sentry for real-time error tracking in both frontend and backend.
  - **Graceful Shutdown:** The server is configured to handle termination signals for stable deployments.

## 🚀 Technology Stack

| Area      | Technology                                    |
| :-------- | :-------------------------------------------- |
| **Frontend**| **Next.js 14 (React 18)**, TypeScript, Tailwind CSS |
| **Backend** | **Node.js**, **Express.js**, Mongoose         |
| **Database**| **MongoDB** (via MongoDB Atlas)               |
| **CI/CD**   | **Docker**, **GitHub Actions**                |
| **Media**   | **Cloudinary**                                |
| **Testing** | **Jest**, **SuperTest**, **React Testing Library** |
| **Error Monitoring**| **Sentry**                                |

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm
- Docker (optional, for building images)
- A MongoDB Atlas account (or a local MongoDB instance)
- A Cloudinary account

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/reddit-clone.git
    cd reddit-clone
    ```

2.  **Setup Backend Server:**
    ```bash
    cd server
    npm install
    ```
    - Create a `.env` file in the `server` directory.
    - Copy the contents of `.env.example` (if you have one) or add the following variables:
      ```
      DATABASE_URL=your_mongodb_connection_string
      JWT_SECRET=your_super_secret_key
      CLIENT_URL=http://localhost:3000
      CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
      CLOUDINARY_API_KEY=your_cloudinary_api_key
      CLOUDINARY_API_SECRET=your_cloudinary_api_secret
      SENTRY_SERVER_DSN=your_sentry_server_dsn
      ```

3.  **Setup Frontend Client:**
    ```bash
    cd ../client
    npm install
    ```
    - Create a `.env.local` file in the `client` directory.
    - Add the following variables:
      ```
      NEXT_PUBLIC_API_URL=http://localhost:5000
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
      NEXT_PUBLIC_SENTRY_DSN=your_sentry_client_dsn
      ```

4.  **Run the application:**
    - In one terminal, start the backend server:
      ```bash
      cd server
      npm run dev
      ```
    - In a second terminal, start the frontend client:
      ```bash
      cd client
      npm run dev
      ```
    - Open [http://localhost:3000](http://localhost:3000) in your browser.

### Seeding the Database

To populate the application with sample users, communities, and posts, run the seeder script from the `server` directory.

```bash
# To add sample data
npm run seed

# To clear all data
npm run destroy
