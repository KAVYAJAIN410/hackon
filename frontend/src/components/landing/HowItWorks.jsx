import React from 'react';
import { Smartphone, Truck, Wrench, Recycle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      icon: <Smartphone className="w-8 h-8" />,
      title: "Assess Your Device",
      desc: "Use our instant valuation tool to see what your old phone, laptop, or tablet is worth as Amazon Pay balance."
    },
    {
      num: 2,
      icon: <Truck className="w-8 h-8" />,
      title: "Free Doorstep Pickup",
      desc: "Schedule a convenient pickup time. Our logistics partner will verify the device condition and collect it securely."
    },
    {
      num: 3,
      icon: <Wrench className="w-8 h-8" />,
      title: "Refurbish or Recycle",
      desc: "Devices are professionally data-wiped and restored to 'Like New' condition, or responsibly broken down for parts."
    },
    {
      num: 4,
      icon: <Recycle className="w-8 h-8" />,
      title: "Re-enter the Loop",
      desc: "Refurbished items are relisted with the ReLoop Certified badge. You spend your rewards on your next purchase.",
      isEco: true
    }
  ];

  return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-[1500px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg font-bold text-on-surface mb-2 text-3xl">The ReLoop Lifecycle</h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">
            A seamless, fully integrated process designed to keep valuable materials in circulation while rewarding you for participating.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="relative flex flex-col items-center text-center p-6 border border-border-standard rounded hover:shadow-sm transition-shadow bg-surface-bright">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border ${step.isEco ? 'bg-reloop-green/20 text-reloop-green border-reloop-green/30' : 'bg-surface-container text-on-surface-variant border-border-standard'}`}>
                {step.icon}
              </div>
              <div className={`absolute top-6 left-6 w-8 h-8 rounded font-label-bold flex items-center justify-center shadow ${step.isEco ? 'bg-reloop-green text-white' : 'bg-amazon-dark text-on-primary'}`}>
                {step.num}
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-2">{step.title}</h3>
              <p className="font-body-sm text-on-surface-variant">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
