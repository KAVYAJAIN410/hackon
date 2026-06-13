import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';

const PRODUCTS = [
  {
    id: 1,
    title: 'Refurbished Smart LED TV 32-inch',
    price: 8499,
    grade: 'Grade A+',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLumSMkVK2dvC2GyNjcKHHBumMMnDdaiEwVZe_T_q2NeGBAXYsbz4v2PDetRwdO1-3LV6VtITNGD585AQIiVP_wTXW8RL9yHPbxVJUW3sbjW4ArRGDdnpaMTWU1jXyyDMGBZBiq7rfqgSb924A64qnZC0Hb2zFdvVuaX725nuUfJFt3Gr7PVIck2mvjTD1cckhNxtjl7EVx2ZTl9fYWbZp99zwyzJAoD4nr_QHlNuJ-2JC3gHfS99IsbqlQ',
    baseValue: 8000,
    logisticsCost: 499,
    savesCO2: 15
  },
  {
    id: 2,
    title: 'Pre-owned Premium Smartphone 128GB',
    price: 12250,
    grade: 'Grade B',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLv8a4N-AkZrmBK-9XAM4dlXlcyNJiDjP5uX_1u6DF4dMrT-oh2RUIVOBeI4ZLWA0EZoikRCedudraJ7sdPBvYfSwxpg9ox88nNW02G51HAdgR9lM6p91Fz4GOD9xoS_li6NeMj4v9Ddmi92oQZAPThK-TuyZIjVwGkB-TbTIY7LFKeSYZEHgEJfCERP8GUO3D93eKaNV0kpZgUBghNMVAid20We_FsaamkmI_BQpYSAL-WSaPvYhYMjjYE',
    baseValue: 11900,
    logisticsCost: 350,
    savesCO2: 5
  },
  {
    id: 3,
    title: 'Noise Cancelling Wireless Headphones',
    price: 2999,
    grade: 'Grade A',
    image: '',
    baseValue: 2800,
    logisticsCost: 199,
    savesCO2: 1.2
  },
  {
    id: 4,
    title: 'Vortex Pro Running Shoes (Size 10)',
    price: 1899,
    grade: 'Grade A',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFGirbZJW46PBxGRy3HBNENopXo5rzSo5cPq4aiYiTUKR_U373Jt-p4ySMvgCmLKY0hu8zvxYomotyKS2kMofBNhgbwQltERFFo13k3g_C8o2Q8OWdrKy_3XvHwf3MoUoW_tpDue7cyJxYs8WWPsRayRLagZ_ptgdoo83Didy8gA_uCbk-_h4bE61qiBuVUc_wRzvoh3-UN9Mr0Htyl8BZQDYltj7mqCpGGFZQv9-8O6ogztGx3lld-tOU7MQejYVaJIcikWzDl2g',
    baseValue: 2499,
    logisticsCost: 65,
    savesCO2: 1.2
  },
  {
    id: 5,
    title: 'Minimalist Quartz Watch',
    price: 3599,
    grade: 'Grade A+',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgeShRAhiKeTlrxkc4QXpMEyiIyiUctjjGvXFpIaVDpQnZuCOzNHMhySUz5T5dmH4gzmMPSEo7Pkro2JvGeBV_FqffX6QdoYCjK0n7TTwSB2LdBN6UK7q5W_TD8ORurYNq94x_z7tmT_Fx1H7znzYHHKj4y3GqzwgwnIdCW2Z5jKhawnCDHLMJI1lF8As2hb8oP6UKp0BlUvONdCfojsa-udGWiEQHK79pRYwpWcq89Gnezeq6ckAS-JfVB0IsSd6ND3dmzrJhB54',
    baseValue: 4500,
    logisticsCost: 130,
    savesCO2: 0.8
  },
  {
    id: 6,
    title: 'Noise-Cancelling Studio Pro Headphones',
    price: 4999,
    grade: 'Grade B',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDzB_KOFhQcU1x4CaXXBe6c91gck89GfBlm9wI50hfo4B90TAMGtw8N2j7pBpJvSBv_p_bLJBP437fbkD7HSxzMBK1pbokaRAmAhBk53UeuODhVMu-p7SX_xkSnF4RHeVaJM5_BoEzE_6OPUhhm1_fclzIh0beY_MCbFUaG3bqpvo-qrHN2vaLO6Lr6bCRA7WncHn3aejUojQUCOy6sovJHg73e6X2i7x89RK_qrW_cq7co7ZeEBtUe1SERORSnUqxDQLAJuDXt-E',
    baseValue: 6000,
    logisticsCost: 65,
    savesCO2: 0.5
  }
];

export default function ProductGrid() {
  const [isLoading, setIsLoading] = useState(false);
  const [products] = useState(PRODUCTS);

  if (isLoading) {
    return (
      <section className="flex-grow">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="flex-grow">
        <EmptyState
          icon="inventory_2"
          title="No products available in your area right now"
          description="Check back soon — new certified refurbished products are listed daily from Amazon returns near you."
          action={{ label: 'Browse All Categories', to: '/marketplace' }}
        />
      </section>
    );
  }

  return (
    <section className="flex-grow">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
