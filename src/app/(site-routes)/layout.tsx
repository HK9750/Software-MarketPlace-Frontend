import Header from '@/components/Home/Header';
import React from 'react';

export default function Layout({ children }) {
    return (
        <React.Fragment>
            <Header />
            <main className="flex-1">{children}</main>
        </React.Fragment>
    );
}
