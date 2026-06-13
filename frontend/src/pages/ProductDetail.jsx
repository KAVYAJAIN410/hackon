import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { SkeletonBox } from '../components/ui/SkeletonCard';

export default function ProductDetail() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: image */}
              <div className="lg:col-span-5">
                <SkeletonBox className="aspect-square w-full rounded-xl" />
                <div className="flex gap-2 mt-3">
                  {[1,2,3].map(i=><SkeletonBox key={i} className="w-16 h-16 rounded" />)}
                </div>
              </div>
              {/* Right: details */}
              <div className="lg:col-span-7 space-y-4">
                <SkeletonBox className="h-8 w-4/5" />
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-10 w-40" />
                <SkeletonBox className="h-4 w-56" />
                <div className="grid grid-cols-2 gap-4">
                  <SkeletonBox className="h-36 rounded-xl" />
                  <SkeletonBox className="h-36 rounded-xl" />
                </div>
                <SkeletonBox className="h-12 w-full rounded-lg" />
                <SkeletonBox className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="max-w-container-max mx-auto px-margin-desktop py-stack-md">

<nav className="flex items-center gap-2 mb-4 text-body-sm text-secondary">
<Link className="hover:underline" to="#">Electronics</Link>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<Link className="hover:underline" to="#">Home Audio</Link>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-on-surface">Wireless Speakers</span>
</nav>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

<div className="lg:col-span-5 flex flex-col md:flex-row-reverse gap-4">

<div className="flex-1 bg-white border border-border-subtle rounded p-4 relative">
<img className="w-full h-auto object-contain aspect-square" data-alt="A professional studio product photograph of a high-end portable wireless speaker in deep matte black. The speaker is positioned centrally against a clean white backdrop, illuminated by soft cinematic key lighting. The scene emphasizes the texture of the speaker's metal mesh and the sleek industrial design. The overall aesthetic is minimalist, modern, and high-quality, fitting for a premium electronics marketplace." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKf4a-D929bgTjn9NEWQLTjN3XvDy3JKn4-Za27hV6LfoMs21bvhutl9NSW1v1GhNZbjX24l7crrGB8PqzdatP_k6HI39Sa7_juRjY7Mtm7jANdFZhAYj2-CHAdPZ3tLq7IWzz6VP4qT2L9EgMZlBx79XntewTGhHAmOu0EHijvY_jsTOZMGHZWK_GdpCt1fBbrV3UzuawzyaU6uFS1p5iVMhQUhuFiWSIsaLQvc9gDjo840iYvjoG6C-qdt0Zk85nelgtiOV4q5I"/>
<div className="absolute top-4 left-4 bg-reloop-green text-white px-2 py-1 text-label-caps font-label-caps rounded flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]" >verified</span>
            AI-VERIFIED GRADE A
          </div>
</div>

<div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
<button className="w-16 h-16 border-2 border-primary-container rounded overflow-hidden p-1 flex-shrink-0">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD_uL3blT-SnTfEQ8YUwEN4uGmpdz7Wy2hdwk6bXVkDbgJUYHfPkGzCkowg7C2RLnboKG5z57UCorpfkIvsgXB3zDEtCAhIIzqPy--K3IMsCDrp-W923ElRRcBAMLhx8bHfnnG2I3gHgMl67avk4jQb5khU-dzxVSa8wUxUopmiMGnqMa3BkVJ39XonZApruXwIMFQ_xD-7zWcgb5EQjGo5OS09yaKoaQ2aG7pIqkL3NZrZgAOBRclFIqNJ9cWYhzTRdAXYPnCv2A"/>
</button>
<button className="w-16 h-16 border border-border-subtle hover:border-primary-container rounded overflow-hidden p-1 flex-shrink-0">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJizH_cqqyqrnZfvxT_Kdc1qDuXup4snYliFJb8FvEbci_2SbbLOxdKjJP9RQ3HFiUcBKafry8vmD5mzeZ74qpUHZIShBIDuvA4Z9_fywqTWs4gY7S-8VTb-AcYWN5rJllwE52hvZoPZrOffSTJ8jUnjSqNWGdYKZFgFunY-k9cvdZsoKkp0qbJj1I-0Ar97JOnve_4sVkFPeSV3jNINM-etozzYZ51tcNyyG27T1hyPKTK6nPTdQMGNtI6q99xPV-B0nX7WnhXkA"/>
</button>
<button className="w-16 h-16 border border-border-subtle hover:border-primary-container rounded overflow-hidden p-1 flex-shrink-0">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA504l0-k3EaMohigPxmNYV9chqL1Yj-fbBY2iczTBbHKmiEIdIam_BCsu3uuiTcT2nlYAYtXlHxBCYBS658iDixKV3Y_b_3o-ZfUpgh1x_DBecwbp0JUz1fhfpZgQcvoF7HTCe35WmHDNkrH9BUaGej3DPaEfO8M6pcTbi7m_RqWWmMAxejruGRVyZMoTL2flW7Roe_k4V5D83YyhhBntmdrs1YrmkY1PFt5rm4rAALJQH0cjpwYaroN5te4mMpKAM4aIv-ZO2UXA"/>
</button>
</div>
</div>

<div className="lg:col-span-7 flex flex-col gap-stack-md">

<div>
<h1 className="font-display-lg text-display-lg text-on-surface mb-1">ReLoop Certified: SoundFlow Ultra Pro Wireless Speaker</h1>
<div className="flex items-center gap-2 mb-2">
<div className="flex text-primary-container">
<span className="material-symbols-outlined" >star</span>
<span className="material-symbols-outlined" >star</span>
<span className="material-symbols-outlined" >star</span>
<span className="material-symbols-outlined" >star</span>
<span className="material-symbols-outlined" >star_half</span>
</div>
<span className="text-tertiary font-body-sm">(128 Global ReLoop Ratings)</span>
</div>
<hr className="border-border-subtle my-2"/>
<div className="flex items-baseline gap-2 py-2">
<span className="text-body-sm text-secondary self-start mt-1">₹</span>
<span className="font-price-lg text-price-lg">12,499</span>
<span className="text-body-sm text-secondary line-through">₹18,999</span>
<span className="text-reloop-green font-label-bold text-label-bold">34% Savings</span>
</div>
<p className="text-body-sm text-secondary mb-4">Eligible for <span className="text-reloop-green font-bold">Free Eco-Shipping</span> to Jaipur.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="bg-surface-container-lowest border border-border-subtle p-4 rounded flex flex-col gap-2">
<div className="flex justify-between items-start">
<span className="font-label-bold text-label-bold uppercase tracking-wider text-secondary">Health Status</span>
<span className="bg-reloop-green/10 text-reloop-green px-2 py-0.5 rounded text-[10px] font-bold">EXCELLENT</span>
</div>
<div className="flex items-center gap-4 my-2">
<div className="w-16 h-16 rounded-full border-4 border-reloop-green flex items-center justify-center">
<span className="font-display-lg text-headline-md text-reloop-green">94</span>
</div>
<div>
<p className="text-body-md font-bold">Verified AI Score</p>
<p className="text-body-sm text-secondary">Tested across 42 logistics checkpoints.</p>
</div>
</div>
<div className="mt-2 space-y-1">
<div className="flex items-center gap-2 text-body-sm">
<span className="material-symbols-outlined text-reloop-green text-[16px]">check_circle</span>
<span>Battery health: 98% capacity remaining</span>
</div>
<div className="flex items-center gap-2 text-body-sm">
<span className="material-symbols-outlined text-reloop-green text-[16px]">check_circle</span>
<span>Connectivity: Bluetooth 5.2 certified</span>
</div>
<div className="flex items-center gap-2 text-body-sm">
<span className="material-symbols-outlined text-error text-[16px]">info</span>
<span className="text-on-surface-variant font-medium">Defect: Minor scratch on back casing</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-border-subtle p-4 rounded flex flex-col gap-2">
<span className="font-label-bold text-label-bold uppercase tracking-wider text-secondary">Local Impact</span>
<div className="mt-2 bg-surface-container p-3 rounded border border-border-subtle relative overflow-hidden">

<div className="flex items-center justify-between relative z-10">
<div className="text-center">
<div className="w-8 h-8 bg-amazon-dark rounded-full flex items-center justify-center mb-1 mx-auto">
<span className="material-symbols-outlined text-white text-[18px]">inventory_2</span>
</div>
<span className="text-[10px] font-label-bold text-secondary">Jaipur DC</span>
</div>
<div className="flex-1 px-2 mb-4">
<div className="h-0.5 bg-dashed bg-secondary-fixed-dim w-full relative">
<div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
<span className="material-symbols-outlined text-reloop-green animate-pulse-soft">local_shipping</span>
<span className="text-[9px] font-bold text-reloop-green">8km</span>
</div>
</div>
</div>
<div className="text-center">
<div className="w-8 h-8 bg-reloop-green rounded-full flex items-center justify-center mb-1 mx-auto">
<span className="material-symbols-outlined text-white text-[18px]">home</span>
</div>
<span className="text-[10px] font-label-bold text-secondary">YOU</span>
</div>
</div>
<p className="text-[11px] text-center mt-2 text-secondary italic">"Hyper-local sourcing reduced CO2 by 84%"</p>
</div>
<div className="mt-4">
<table className="w-full text-left text-body-sm">
<thead className="border-b border-border-subtle">
<tr>
<th className="pb-1 font-label-bold text-secondary uppercase text-[10px]">Metric</th>
<th className="pb-1 text-right font-label-bold text-secondary uppercase text-[10px]">Saved</th>
</tr>
</thead>
<tbody className="divide-y divide-border-subtle">
<tr>
<td className="py-1.5 text-secondary">Carbon Offset</td>
<td className="py-1.5 text-right font-bold text-reloop-green">1.4kg CO2</td>
</tr>
<tr>
<td className="py-1.5 text-secondary">Logistics Cost</td>
<td className="py-1.5 text-right font-bold text-reloop-green">₹450</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm mt-2">
<div className="flex flex-col gap-4">
<div className="flex items-center justify-between">
<div>
<p className="text-title-lg font-title-lg">In Stock</p>
<p className="text-body-sm text-secondary">Ships from ReLoop Jaipur Center.</p>
</div>
<div className="bg-surface-container-high rounded-full px-3 py-1 flex items-center gap-2">
<span className="text-label-bold">Qty: 1</span>
<span className="material-symbols-outlined text-[16px]">expand_more</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
<button className="w-full bg-primary-container hover:opacity-90 active:scale-95 transition-all text-amazon-dark font-label-bold py-3 rounded shadow-sm">
                Add to Cart
              </button>
<button className="w-full bg-[#FFA41C] hover:opacity-90 active:scale-95 transition-all text-amazon-dark font-label-bold py-3 rounded shadow-sm">
                Buy Now
              </button>
</div>
<div className="flex items-center gap-4 text-body-sm text-secondary">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[18px]">lock</span>
                Secure Transaction
              </div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[18px]">cached</span>
                7-Day Returns
              </div>
</div>
</div>
</div>

<div className="mt-4">
<h3 className="font-label-bold text-label-bold uppercase tracking-widest text-secondary mb-2">About this item</h3>
<ul className="list-disc pl-5 space-y-1 text-body-md text-on-surface-variant">
<li>Refurbished by ReLoop engineers using 100% genuine components.</li>
<li>High-fidelity 40W sound output with deep bass optimization.</li>
<li>IPX7 Waterproof rating intact (Pressure tested in ReLoop Labs).</li>
<li>Sustainable packaging: 100% recycled cardboard and zero-plastic padding.</li>
</ul>
</div>
</div>
</div>

<section className="mt-16 border-t border-border-subtle pt-8">
<h2 className="font-headline-md text-headline-md mb-6">Frequently Bought With</h2>
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

<div className="bg-white border border-border-subtle p-3 rounded hover:shadow-md transition-shadow cursor-pointer group">
<div className="aspect-square bg-surface-container-lowest rounded mb-2 overflow-hidden">
<img className="w-full h-full object-contain group-hover:scale-105 transition-transform" data-alt="A pair of sleek wireless earbuds in a compact charging case, displayed on a textured gray background. The lighting is bright and modern, highlighting the glossy finish of the case. Product is shown in a professional studio setting suitable for a high-end electronics ecommerce site." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFMvGCxtfteuRehjjqk7X_d1TgfJcTJdIgMsRxgFn412fQ_bOzENAHlmC2F1aQIlh74kYGbp02XGvD6V4LdW-s5ATY3aVgSLCfUaBdpl-h5w5uZy_fu7y_ChBbJr7S9Ynq0HWVTBDPE-LREN8bhvTlxexklwcbR4W5ywnwUOhWL6k2BSGJkGfqXHjrDu3CYWLIfj1YUdtZneDVRvSxSLJv6f4i3DuloVtivm8XonO60zMyD329mdMWwFCUWcMtL-aKOpUw4hQ8f3g"/>
</div>
<p className="text-body-sm font-medium line-clamp-2 mb-1">Eco-Charge Pro Wireless Dock</p>
<div className="flex text-primary-container mb-1">
<span className="material-symbols-outlined text-[12px]" >star</span>
<span className="material-symbols-outlined text-[12px]" >star</span>
<span className="material-symbols-outlined text-[12px]" >star</span>
<span className="material-symbols-outlined text-[12px]" >star</span>
</div>
<p className="font-bold text-body-md">₹1,299</p>
<div className="bg-surface-container mt-2 py-1 px-2 rounded-sm text-[10px] text-secondary flex items-center justify-between">
<span>Logistics Saved:</span>
<span className="text-reloop-green font-bold">₹80</span>
</div>
</div>

<div className="hidden md:block bg-white border border-border-subtle p-3 rounded hover:shadow-md transition-shadow cursor-pointer group">
<div className="aspect-square bg-surface-container-lowest rounded mb-2 overflow-hidden">
<img className="w-full h-full object-contain group-hover:scale-105 transition-transform" data-alt="A heavy-duty protective carrying case for portable speakers, made of durable ballistic nylon with a reinforced zipper. The case is shown in a neutral outdoor lifestyle setting, lit by natural soft daylight. The focus is on the rugged texture and quality stitching." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBpiJblJt3yI3IBbGvIq1f2i7q5i40w7Tqsvdh_ayOwCA8WSWuNqS7TuuLYdWazfv0krcmEeqKFo_VN-ruAzsnZuyxAH8nf4uuDFCnK4dKZaCRZADFw-YJm_thwTRH7tww2nztXNx1gwlqRQVrAfQ8SsWVIXu_VoXXWMVr6JT7CpCpaFAlwIRi_d6M4I6WngT3-HzNtD25rGUPIWYstuUVFk2IeyNkjkwg2sYn72bVoqEbhybTM9opN-qNINPVKQm7Ny40ini_eiA"/>
</div>
<p className="text-body-sm font-medium line-clamp-2 mb-1">ArmorGuard Speaker Case</p>
<div className="flex text-primary-container mb-1">
<span className="material-symbols-outlined text-[12px]" >star</span>
<span className="material-symbols-outlined text-[12px]" >star</span>
<span className="material-symbols-outlined text-[12px]" >star</span>
<span className="material-symbols-outlined text-[12px]" >star</span>
</div>
<p className="font-bold text-body-md">₹899</p>
<div className="bg-surface-container mt-2 py-1 px-2 rounded-sm text-[10px] text-secondary flex items-center justify-between">
<span>Logistics Saved:</span>
<span className="text-reloop-green font-bold">₹120</span>
</div>
</div>
</div>
</section>
</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
