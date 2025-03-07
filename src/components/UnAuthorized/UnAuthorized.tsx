'use client';

import React from 'react';
import Link from 'next/link';

const Unauthorized: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
                Unauthorized
            </h1>
            <p className="mt-4 text-gray-600 text-center">
                You don't have permission to access this page.
            </p>
            <Link
                href="/"
                className="mt-6 inline-block px-6 py-3 bg-secondary text-white font-semibold rounded hover:bg-secondary/90 transition-colors"
            >
                Go Back Home
            </Link>
        </div>
    </div>
);

export default Unauthorized;
