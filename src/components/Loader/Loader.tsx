'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Define the particle type
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
}

const Loader = ({ message = 'Loading' }) => {
    // Properly type the particles state
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const particleCount = 12;
        const newParticles = Array.from({ length: particleCount }).map(
            (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 10 + 10,
            })
        );
        setParticles(newParticles);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Ambient floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute rounded-full bg-primary/20"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                            }}
                            animate={{
                                x: [0, Math.random() * 100 - 50, 0],
                                y: [0, Math.random() * 100 - 50, 0],
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                {/* Main loader container */}
                <motion.div
                    className="relative"
                    animate={{
                        scale: [0.98, 1.02, 0.98],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    {/* Compact multi-layered loader */}
                    <div className="relative w-24 h-24">
                        {' '}
                        {/* Reduced from w-32 h-32 */}
                        {/* Outermost rotating ring with dynamic stroke */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient
                                        id="outerRingGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="var(--primary)"
                                            stopOpacity="0.1"
                                        />
                                        <stop
                                            offset="50%"
                                            stopColor="var(--primary)"
                                            stopOpacity="0.4"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="var(--primary)"
                                            stopOpacity="0.1"
                                        />
                                    </linearGradient>
                                </defs>
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="48"
                                    stroke="url(#outerRingGradient)"
                                    strokeWidth="2"
                                    strokeDasharray="6 3"
                                    animate={{
                                        strokeDashoffset: [0, 30],
                                    }}
                                    transition={{
                                        duration: 15,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />
                            </svg>
                        </motion.div>
                        {/* Outer rotating ring */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                rotate: 360,
                                filter: [
                                    'brightness(1)',
                                    'brightness(1.3)',
                                    'brightness(1)',
                                ],
                            }}
                            transition={{
                                rotate: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                                filter: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                        >
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient
                                        id="primaryGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="var(--primary)"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="var(--primary-light, var(--primary))"
                                        />
                                    </linearGradient>
                                    <filter
                                        id="glow"
                                        x="-50%"
                                        y="-50%"
                                        width="200%"
                                        height="200%"
                                    >
                                        <feGaussianBlur
                                            stdDeviation="2"
                                            result="blur"
                                        />{' '}
                                        {/* Reduced blur for smaller size */}
                                        <feComposite
                                            in="SourceGraphic"
                                            in2="blur"
                                            operator="over"
                                        />
                                    </filter>
                                </defs>
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="var(--muted)"
                                    strokeOpacity="0.15"
                                    strokeWidth="6"
                                />
                                <motion.path
                                    d="M 50,5 A 45,45 0 1,1 5,50 A 45,45 0 1,1 50,95 A 45,45 0 1,1 95,50 A 45,45 0 1,1 50,5"
                                    stroke="url(#primaryGradient)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    fill="transparent"
                                    filter="url(#glow)"
                                    animate={{
                                        pathLength: [0.15, 0.4, 0.15],
                                        pathOffset: [0, 1],
                                    }}
                                    transition={{
                                        pathLength: {
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        },
                                        pathOffset: {
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        },
                                    }}
                                />
                            </svg>
                        </motion.div>
                        {/* Middle rotating ring - counterclockwise */}
                        <motion.div
                            className="absolute inset-6"
                            animate={{ rotate: -360 }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient
                                        id="middleGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="var(--primary)"
                                            stopOpacity="0.7"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="var(--primary)"
                                            stopOpacity="0.3"
                                        />
                                    </linearGradient>
                                </defs>
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="url(#middleGradient)"
                                    strokeWidth="3"
                                    strokeDasharray="25 12"
                                    animate={{
                                        strokeDashoffset: [0, 75],
                                    }}
                                    transition={{
                                        duration: 7,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />
                            </svg>
                        </motion.div>
                        {/* Inner ring with orbit */}
                        <motion.div
                            className="absolute inset-12"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="25"
                                    stroke="var(--primary)"
                                    strokeOpacity="0.2"
                                    strokeWidth="2"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="25"
                                    r="4"
                                    fill="var(--primary)"
                                    animate={{
                                        filter: [
                                            'drop-shadow(0 0 1px var(--primary))',
                                            'drop-shadow(0 0 3px var(--primary))',
                                            'drop-shadow(0 0 1px var(--primary))',
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </svg>
                        </motion.div>
                        {/* Central pulsing core */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                                animate={{
                                    boxShadow: [
                                        '0 0 0px 0px rgba(var(--primary-rgb), 0.1)',
                                        '0 0 10px 3px rgba(var(--primary-rgb), 0.3)',
                                        '0 0 0px 0px rgba(var(--primary-rgb), 0.1)',
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                <motion.div
                                    className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: 0.5,
                                    }}
                                >
                                    <motion.div
                                        className="w-4 h-4 rounded-full bg-primary shadow-md"
                                        animate={{
                                            scale: [0.9, 1.2, 0.9],
                                            boxShadow: [
                                                '0 0 5px 0px rgba(var(--primary-rgb), 0.5)',
                                                '0 0 10px 3px rgba(var(--primary-rgb), 0.8)',
                                                '0 0 5px 0px rgba(var(--primary-rgb), 0.5)',
                                            ],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Animated text with letter animation */}
                <div className="mt-6 text-center">
                    {' '}
                    {/* Reduced margin from mt-8 */}
                    <motion.div
                        className="text-foreground/80 font-medium text-base tracking-wide"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {message.split('').map((char, index) => (
                            <motion.span
                                key={index}
                                animate={{
                                    opacity: [0.4, 1, 0.4],
                                    y: [0, -2, 0],
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: index * 0.05,
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                        <motion.span
                            className="inline-flex"
                            animate={{
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <span className="mx-0.5">.</span>
                            <span className="mx-0.5">.</span>
                            <span className="mx-0.5">.</span>
                        </motion.span>
                    </motion.div>
                </div>

                <span className="sr-only">Loading, please wait...</span>
            </motion.div>
        </AnimatePresence>
    );
};

export default Loader;
