"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="w-full flex items-center justify-center py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          {/* Left Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Ready to Sell Your Software?
              </h2>
              <p className="max-w-[600px] mx-auto lg:mx-0 md:text-lg text-muted-foreground">
                Join thousands of developers and companies selling their
                software on our marketplace. Reach millions of potential
                customers.
              </p>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 shadow-md bg-white/20 backdrop-blur-lg hover:scale-105 transition"
              >
                Learn More
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary px-8 transition hover:scale-105"
              >
                Become a Seller
              </Button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=500&h=500&q=80"
                alt="Seller illustration"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
