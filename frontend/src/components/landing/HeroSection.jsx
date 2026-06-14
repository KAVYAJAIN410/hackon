import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] flex items-center justify-start bg-amazon-dark overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img alt="Sustainable logistics facility" className="w-full h-full object-cover opacity-70" src="https://lh3.googleusercontent.com/aida/AP1WRLuTsoagyqSYICAVIDH-JtSjSd1JKyOJxGq7StAGlUgN4zGvFKFiqZtU2xjp8wA0M2zxY1ObcCH3rrvoJfmNvNzYjVRS-N8ucwMmPwVMrqt9wIy9PJMeUDWo6UsmU6a6V50z7zx4OtvuKpSncj0J9guM0RnJ9BtAFSFFiR0GybzZVSuGUFrMwQX6mYuUaZznkXSwJMCyxqxDAxrwU-U7EjRAd_3US_PdZLN0D2V8UZYsS11yQGV1Wl-PBHU" />
        <div className="absolute inset-0 bg-gradient-to-r from-amazon-dark via-amazon-dark/80 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-[1500px] mx-auto px-5 w-full text-white">
        <div className="max-w-xl">
          <h1 className="font-headline-lg text-[40px] leading-tight font-bold mb-4">
            Extend the Life of Your Products. <br />
            <span className="text-reloop-green">Maximize Your Value.</span>
          </h1>
          <p className="font-body-lg text-gray-300 mb-6">
            Join the circular economy with ReLoop on Amazon. Trade in your used devices, discover certified refurbished electronics, and responsibly recycle—all while earning rewards and reducing your carbon footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/outgrown-it">
              <Button className="bg-gradient-to-b from-[#FFB03B] to-[#FF9900] hover:from-[#f7c06c] hover:to-[#f3a847] text-[#111] border border-[#A88734] font-label-bold px-6 py-6 rounded flex items-center gap-2">
                Explore Trade-In Values
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" className="bg-white text-amazon-dark border-border-standard hover:bg-gray-100 hover:text-amazon-dark font-label-bold px-6 py-6 rounded flex items-center gap-2">
                Learn About Refurbished
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 flex items-center gap-4 bg-white/10 backdrop-blur-sm p-3 rounded border border-white/20 w-fit">
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-secondary-container w-5 h-5" />
              <span className="font-label-medium text-sm">Amazon Certified Quality</span>
            </div>
            <div className="w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Leaf className="text-reloop-green w-5 h-5" />
              <span className="font-label-medium text-sm">Zero Waste to Landfill Commitment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
