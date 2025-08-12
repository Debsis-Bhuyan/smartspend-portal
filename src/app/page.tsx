import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10 text-center">
      <div className="max-w-xl bg-white p-8 rounded-lg shadow-md w-full">
        <div className="mb-6 flex justify-center">
          <Image
            src="/smart_spend_logo.jpg" 
            alt="Smart Spend Logo"
            width={80}
            height={80}
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to Smart Spend</h1>
        <p className="text-gray-600 mb-6">
          Your all-in-one financial management platform to track expenses, manage budgets, and make smarter spending decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Register
          </Link>
          <Link
            href="#about"
            className="border border-gray-300 px-5 py-2 rounded hover:bg-gray-100"
          >
            About
          </Link>
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Smart Spend Management System
      </footer>
    </div>
  );
}
