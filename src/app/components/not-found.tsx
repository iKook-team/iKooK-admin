import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Whoops! Looks like you&apos;re lost.
        </h1>
        <p className="text-lg mt-4 text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for could not be found. It might be misspelled or removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mt-8 text-white bg-primary rounded-md hover:bg-primary focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        >
          Go Back Home
          <svg
            className="ml-2 -mr-1 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6A1 1 0 018.707 16H4.707A1 1 0 014 14.293l6-6a1 1 0 01.293-.707z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
