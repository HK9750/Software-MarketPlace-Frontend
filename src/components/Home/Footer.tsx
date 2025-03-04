'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full flex bg-background border-t py-12 justify-center">
            <div className="container px-6 md:px-12">
                {/* Footer Top */}
                <div className="grid gap-12 lg:grid-cols-5">
                    {/* Brand & Socials */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Zap className="h-7 w-7 text-primary" />
                            <span className="font-bold text-2xl tracking-tight">
                                SoftMarket
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-[350px]">
                            The premier marketplace for discovering, comparing,
                            and purchasing software solutions for every need.
                        </p>
                        <div className="flex space-x-4">
                            {socialIcons.map((icon, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-primary/10 transition"
                                >
                                    {icon}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <FooterColumn
                        title="Categories"
                        links={[
                            'Development',
                            'Design',
                            'Business',
                            'Security',
                            'Productivity',
                        ]}
                    />
                    <FooterColumn
                        title="Company"
                        links={[
                            'About',
                            'Careers',
                            'Blog',
                            'Press',
                            'Partners',
                        ]}
                    />
                    <FooterColumn
                        title="Support"
                        links={[
                            'Help Center',
                            'Contact Us',
                            'FAQs',
                            'Community',
                            'Developer API',
                        ]}
                    />
                </div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center border-t mt-12 pt-6 text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} SoftMarket. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6">
                        {['Terms', 'Privacy', 'Cookies'].map((text, index) => (
                            <Link
                                key={index}
                                href="#"
                                className="hover:text-foreground transition"
                            >
                                {text}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => {
    return (
        <div>
            <h3 className="font-semibold text-lg mb-3">{title}</h3>
            <ul className="space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground transition"
                        >
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const socialIcons = [
    <svg
        key="facebook"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>,
    <svg
        key="twitter"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>,
    <svg
        key="instagram"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>,
];

export default Footer;
