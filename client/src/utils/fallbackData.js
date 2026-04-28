import React from 'react';

const FALLBACK_IMAGES = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-ZDxxHri9f2uZ58gUxPK_TvX7kWD6dNOzUtSusDH3Ado_2SQJgJYYgHrO3QfKAqqZpRAPuWJf2sMfNotluSfMmyFYGp3cx_cTaUVCN4HgcmeG5aUbzXr4F0-UMHyw0_CDCDNJ-7rpwCRWy6Au8z0L556B1Q79P9C6q-Bwiiang2FbW5j2Ca4FL4dNxWuHjCRRRtVLQAAjiE4DDvRYR0DdlnK-v7GHkSm8RhhwqYyb8Eo7a_HSHcTLU6D7bWLH4GFPHj9tXupyFQ',
  cat1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3PHGZb9E27B2VWn0J-t4CJQhSoG6CIEvojmN4jDyj_brznaYdya-SMFEZC_1xMaa35y27EGpEc-tup2OARGNsksMsc7Mma4rPo59u37Qtj-On99rfwVINN6H-6gNuCQ0-xxAypEtJxj7rFsVi1SM3HYtEpZ3rbBw_i2-IrKNjShTjmu1aKwkskG0bMTG_crUBa8-uwbbOYbyzK1eLoFk_UmX_Il78DRKOBnotmxXfdtR8S4fS4rUjWBrXyYl5AhMqpvZ56chKGA',
  cat2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfrti1sf1KmSKAOIr34NSoNW5o_CO2snk_NPp811DL9Xzfn-BmtSAujsZv9swjG4dHY0YTg0IZIO6oh61nJ2RfxE03QrAqlJwJOO5uFX9zyWfFLl3eemPgjoptlxWxJl0JWDRQsyGdvEsrkryXBOiwNbu9lCXng6puJOZZs5YJ3odoB2YRRa6CX3y6qMw27tEbIx_bJU_tadihkLs2rg3GBm-MUtQq4u-4QJohBfNNH5jPaukRb6yZ65V7KhBqbCZineMBvUZpQg',
  cat3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1UiPQUKX68M8KN9hBdEeSqbJ-IYfZ7XJm0Mc6W7fACbALycqHcxFRXUFyqd9kbrivJNuOiHuYEzat5TriIODed_Vk8rjWTSGb1xtTQH_pbasJwBXPGgkTSLlP7uAoX6hAyQ-JQLa9Ai6tEks2j4BhgyfcVouFGkSn-xg9ltUOjFWXwWn2d_XJvlYhsk7RIRNJPLviSrPwmUNFKNZbopsH6wq7FkmQMgMRZ0pKSpHeKpuhLO0VbcSVHZaw7ec5zgV6YIPMHPTTIg',
  product1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8JoyjEhv-Y5cMyha72qCK8LKg-OsEM-LFNvWOwyNEQ6t-KMqmriNlIkVVTKjTNuIgcvCNrcVQsPksXbuzOTju9CdO1S4qNmOLcvORPQls9YVU4DzdAgeT7KNye5WqIicSrsW2arnlZPPmr7M3mYWy0LpD3yeAHKRFcGGbucg4my0JXOVnFMg8p1QtBQqzNK-sPDWY4h5kOEEhVIz1gej9QaxDgjWc3pyMLIuIPspTQwsKZaXAAwsoQecU6ZpZ3f_Ogv7jgVTCIg',
  product2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1_A5BXLxhc6FiQZx8o9UeUyvZdzjpJpMZP8DGzpzLzYO8YeBMmMY17MCLMMT3HdLsDVJiREHV2Ltc2_7qNKmZ0frKRovIn92qik5hzCm3BG67ValchjXzxhuIrybh8PkYxi2JZoG8VFeSpAVNyFpw5AvBDqQ_DuN5Hog-MOBEwExCXW7RQxz5Jtq5Od9vHv117VHgHs0H2YDOFr2XKET1vn_ANbvuYC95HMfXDCrpBgSYIdwV9WrtbgfMnDtACPQWzlMmn0YsKw',
  product3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKzuI4EuRRoj9JaGfdetOPg4RQWSE1CRUIHaF2lxTjGRnZMRPRVO5nIaTrJCoO6hFTvt30YMVS0o_58gtPvauqh2lIWnEJemFmCmeyrbUb_h8CFTmu0Yh4D8t41Sp-6qmB520_Ude9HP7dcsN3vzjMQA7YAhH14uCFXPJf9KSMIJcQelv3B6BNvaSvkKNtIB5_Bwqyo7VS0bJZnk3xI_tpD0fLhCiWJWBi7jx-_S44sz_47Qm1Pb5jKFLSy-Iq4I3R92TwZ_-uDQ',
  product4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqhLqn_7kty8rokih8Ui2P1Le-Qjghv1Q3f9-D4yXbXKAJU-oYkGKCVeuo4wflRlaFAV7vPlfYXOFQrYCLIVsHq_vKQ9MnmVM1kpoukX8Vyn-Hie8CHsvlhLHYArJ6XK76ykuzb3GsD0uN3NSHhMO88rpXG0hH9GbJRz9qpOokm3b0_HbA7ex4NWO3_5xM5k3ymC80riygnpZ2BAiVm0xvgq0j4Xp_BsEXFovZHhlQDp8B9-mxqa1VA_CrI0RZM4aHwKtZ9c1-gg',
  placeholder: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKzuI4EuRRoj9JaGfdetOPg4RQWSE1CRUIHaF2lxTjGRnZMRPRVO5nIaTrJCoO6hFTvt30YMVS0o_58gtPvauqh2lIWnEJemFmCmeyrbUb_h8CFTmu0Yh4D8t41Sp-6qmB520_Ude9HP7dcsN3vzjMQA7YAhH14uCFXPJf9KSMIJcQelv3B6BNvaSvkKNtIB5_Bwqyo7VS0bJZnk3xI_tpD0fLhCiWJWBi7jx-_S44sz_47Qm1Pb5jKFLSy-Iq4I3R92TwZ_-uDQ'
};

const FALLBACK_CATEGORIES = [
  { _id: 'cat-1', name: 'The Atelier', slug: 'atelier', image: FALLBACK_IMAGES.cat1, description: 'Bespoke arrangements crafted by master florists.' },
  { _id: 'cat-2', name: 'Occasions', slug: 'occasions', image: FALLBACK_IMAGES.cat2, description: 'Flowers for every special moment.' },
  { _id: 'cat-3', name: 'Subscriptions', slug: 'subscriptions', image: FALLBACK_IMAGES.cat3, description: 'Fresh blooms delivered regularly.' },
  { _id: 'cat-4', name: 'Exotics', slug: 'exotics', image: FALLBACK_IMAGES.product2, description: 'Rare and tropical finds.' }
];

const FALLBACK_PRODUCTS = [
  { _id: 'fp-1', name: 'The Juliet', description: 'Blush & Burgundy Roses', price: 85, mrp: 110, rating: 4.9, reviewCount: 148, badge: 'Romantic', unit: 'per bunch', images: [FALLBACK_IMAGES.product1], category: { name: 'Roses', _id: 'cat-1' }, stock: 250, isAvailable: true },
  { _id: 'fp-2', name: 'The Solstice', description: 'Tropical Protea Mix', price: 110, mrp: 140, rating: 4.8, reviewCount: 92, badge: 'bestseller', unit: 'per bunch', images: [FALLBACK_IMAGES.product2], category: { name: 'Tropical', _id: 'cat-4' }, stock: 180, isAvailable: true },
  { _id: 'fp-3', name: 'Phalaenopsis', description: 'Potted White Orchid', price: 65, mrp: 85, rating: 4.7, reviewCount: 56, badge: 'new', unit: 'per piece', images: [FALLBACK_IMAGES.product3], category: { name: 'Orchids', _id: 'cat-2' }, stock: 120, isAvailable: true },
  { _id: 'fp-4', name: 'The Dune', description: 'Dried Botanical Mix', price: 95, mrp: 125, rating: 4.9, reviewCount: 83, badge: 'Everlasting', unit: 'per piece', images: [FALLBACK_IMAGES.product4], category: { name: 'Dried', _id: 'cat-3' }, stock: 45, isAvailable: true }
];

const FALLBACK_BANNERS = [
  { _id: 'fb-1', title: 'Curated nature for the modern home.', subtitle: 'Elevate your space with seasonal, sustainably sourced stems arranged by master florists. Delivered fresh to your door.', image: FALLBACK_IMAGES.hero, link: '/shop', discountPercent: 0, isActive: true }
];

export { FALLBACK_IMAGES, FALLBACK_CATEGORIES, FALLBACK_PRODUCTS, FALLBACK_BANNERS };
