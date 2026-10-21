# 🛒 বাজার দর | BazarDor

**BazarDor** is a modern and responsive product price-tracking web application that helps users explore products, compare market prices, and stay informed about price changes. The platform provides product categories, price trends, and personalized account features in a user-friendly interface.

## 🚀 Technologies Used

- **Next.js** — React framework for building the web application
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Responsive styling and UI design
- **MongoDB Atlas** — Cloud database
- **Better Auth** — Authentication and session management
- **Google OAuth** — Google sign-in
- **GitHub OAuth** — GitHub sign-in
- **Programming Hero BazarDor API** — Product and category data

## ✨ Key Features

1. **Product Discovery:** Browse products and explore different categories.
2. **Price Tracking:** View product prices and identify top price risers and fallers.
3. **Category Filtering and Sorting:** Find products by category and sort the available results.
4. **Secure Authentication:** Sign up and sign in using email and password, Google, or GitHub.
5. **Personalized Profile:** View account information, update your name, and securely log out.

## 🖥️ Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB Atlas database
- Required authentication credentials for Better Auth and OAuth providers

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd bazar-dor
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and configure the required environment variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

   Replace the placeholder values with your own credentials. **Never commit `.env.local` or publish your secrets.**

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build

To create a production build, run:

```bash
npm run build
```

## 👨‍💻 Author

Developed as part of the Programming Hero web development assignment.

---

**বাজার দর — Explore products. Track prices. Shop smarter.**