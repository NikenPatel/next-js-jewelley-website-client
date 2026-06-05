This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## structure

jewelry-ecommerce/
│
├── public/
│ ├── images/
│ ├── icons/
│ ├── logos/
│ ├── banners/
│ └── favicon.ico
│
├── src/
│
│ ├── app/
│ │
│ │ ├── layout.tsx
│ │ ├── globals.css
│ │ ├── loading.tsx
│ │ ├── not-found.tsx
│ │
│ │ ├── (store)/
│ │ │
│ │ │ ├── layout.tsx
│ │ │ ├── page.tsx
│ │ │
│ │ │ ├── products/
│ │ │ │ ├── page.tsx
│ │ │ │ └── [slug]/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── categories/
│ │ │ │ ├── page.tsx
│ │ │ │ └── [slug]/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── collections/
│ │ │ │ ├── page.tsx
│ │ │ │ └── [slug]/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── cart/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── wishlist/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── checkout/
│ │ │ │ ├── page.tsx
│ │ │ │ ├── shipping/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── payment/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── success/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── search/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── offers/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── blogs/
│ │ │ │ ├── page.tsx
│ │ │ │ └── [slug]/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── about/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── contact/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── faq/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── privacy-policy/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── return-policy/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── terms-conditions/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ └── account/
│ │ │ ├── layout.tsx
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx
│ │ │ ├── profile/
│ │ │ │ └── page.tsx
│ │ │ ├── orders/
│ │ │ │ └── page.tsx
│ │ │ ├── addresses/
│ │ │ │ └── page.tsx
│ │ │ ├── wishlist/
│ │ │ │ └── page.tsx
│ │ │ ├── reviews/
│ │ │ │ └── page.tsx
│ │ │ └── settings/
│ │ │ └── page.tsx
│ │
│ │ ├── auth/
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ └── page.tsx
│ │ │ ├── forgot-password/
│ │ │ │ └── page.tsx
│ │ │ ├── reset-password/
│ │ │ │ └── page.tsx
│ │ │ ├── verify-email/
│ │ │ │ └── page.tsx
│ │ │ └── otp-verification/
│ │ │ └── page.tsx
│ │
│ │ └── admin/
│ │ │
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ │
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ │
│ │ ├── products/
│ │ │ ├── page.tsx
│ │ │ ├── add/
│ │ │ │ └── page.tsx
│ │ │ ├── [id]/
│ │ │ │ ├── page.tsx
│ │ │ │ └── edit/
│ │ │ │ └── page.tsx
│ │ │ ├── categories/
│ │ │ │ └── page.tsx
│ │ │ ├── subcategories/
│ │ │ │ └── page.tsx
│ │ │ ├── collections/
│ │ │ │ └── page.tsx
│ │ │ └── inventory/
│ │ │ └── page.tsx
│ │ │
│ │ ├── orders/
│ │ │ ├── page.tsx
│ │ │ ├── pending/
│ │ │ │ └── page.tsx
│ │ │ ├── processing/
│ │ │ │ └── page.tsx
│ │ │ ├── shipped/
│ │ │ │ └── page.tsx
│ │ │ ├── delivered/
│ │ │ │ └── page.tsx
│ │ │ ├── cancelled/
│ │ │ │ └── page.tsx
│ │ │ └── returns/
│ │ │ └── page.tsx
│ │ │
│ │ ├── customers/
│ │ │ ├── page.tsx
│ │ │ ├── reviews/
│ │ │ │ └── page.tsx
│ │ │ └── wishlist/
│ │ │ └── page.tsx
│ │ │
│ │ ├── vendors/
│ │ │ ├── page.tsx
│ │ │ ├── add/
│ │ │ │ └── page.tsx
│ │ │ └── payouts/
│ │ │ └── page.tsx
│ │ │
│ │ ├── coupons/
│ │ │ ├── page.tsx
│ │ │ └── add/
│ │ │ └── page.tsx
│ │ │
│ │ ├── media/
│ │ │ ├── gallery/
│ │ │ │ └── page.tsx
│ │ │ ├── banners/
│ │ │ │ └── page.tsx
│ │ │ └── videos/
│ │ │ └── page.tsx
│ │ │
│ │ ├── cms/
│ │ │ ├── homepage/
│ │ │ │ └── page.tsx
│ │ │ ├── about/
│ │ │ │ └── page.tsx
│ │ │ ├── contact/
│ │ │ │ └── page.tsx
│ │ │ └── policies/
│ │ │ └── page.tsx
│ │ │
│ │ ├── marketing/
│ │ │ ├── email-campaigns/
│ │ │ │ └── page.tsx
│ │ │ ├── sms-campaigns/
│ │ │ │ └── page.tsx
│ │ │ └── notifications/
│ │ │ └── page.tsx
│ │ │
│ │ ├── analytics/
│ │ │ ├── sales/
│ │ │ │ └── page.tsx
│ │ │ ├── products/
│ │ │ │ └── page.tsx
│ │ │ └── customers/
│ │ │ └── page.tsx
│ │ │
│ │ ├── users/
│ │ │ ├── admins/
│ │ │ │ └── page.tsx
│ │ │ └── staff/
│ │ │ └── page.tsx
│ │ │
│ │ ├── security/
│ │ │ ├── login-activity/
│ │ │ │ └── page.tsx
│ │ │ ├── access-logs/
│ │ │ │ └── page.tsx
│ │ │ └── settings/
│ │ │ └── page.tsx
│ │ │
│ │ └── settings/
│ │ ├── general/
│ │ │ └── page.tsx
│ │ ├── payment/
│ │ │ └── page.tsx
│ │ ├── shipping/
│ │ │ └── page.tsx
│ │ └── roles-permissions/
│ │ └── page.tsx
│
│ ├── components/
│ │
│ │ ├── ui/
│ │ │ ├── Button.tsx
│ │ │ ├── Input.tsx
│ │ │ ├── Select.tsx
│ │ │ ├── Textarea.tsx
│ │ │ ├── Checkbox.tsx
│ │ │ ├── Modal.tsx
│ │ │ ├── Drawer.tsx
│ │ │ ├── Loader.tsx
│ │ │ ├── Table.tsx
│ │ │ ├── Pagination.tsx
│ │ │ └── Badge.tsx
│ │
│ │ ├── common/
│ │ │ ├── Header.tsx
│ │ │ ├── Footer.tsx
│ │ │ ├── Sidebar.tsx
│ │ │ ├── Breadcrumb.tsx
│ │ │ ├── EmptyState.tsx
│ │ │ └── Seo.tsx
│ │
│ │ ├── store/
│ │ │ ├── ProductCard.tsx
│ │ │ ├── ProductGrid.tsx
│ │ │ ├── CartDrawer.tsx
│ │ │ ├── WishlistButton.tsx
│ │ │ ├── HeroBanner.tsx
│ │ │ └── CategoryCard.tsx
│ │
│ │ ├── admin/
│ │ │ ├── AdminSidebar.tsx
│ │ │ ├── AdminNavbar.tsx
│ │ │ ├── DashboardCard.tsx
│ │ │ ├── StatsCard.tsx
│ │ │ └── DataTable.tsx
│ │
│ │ └── charts/
│ │ ├── SalesChart.tsx
│ │ ├── RevenueChart.tsx
│ │ ├── OrdersChart.tsx
│ │ └── CustomerChart.tsx
│
│ ├── services/
│ │ ├── api.ts
│ │ ├── auth.service.ts
│ │ ├── product.service.ts
│ │ ├── category.service.ts
│ │ ├── cart.service.ts
│ │ ├── order.service.ts
│ │ ├── coupon.service.ts
│ │ ├── review.service.ts
│ │ └── analytics.service.ts
│
│ ├── store/
│ │ ├── index.ts
│ │ ├── provider.tsx
│ │ │
│ │ ├── slices/
│ │ │ ├── authSlice.ts
│ │ │ ├── userSlice.ts
│ │ │ ├── productSlice.ts
│ │ │ ├── categorySlice.ts
│ │ │ ├── cartSlice.ts
│ │ │ ├── wishlistSlice.ts
│ │ │ ├── orderSlice.ts
│ │ │ └── analyticsSlice.ts
│
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useCart.ts
│ │ ├── useWishlist.ts
│ │ ├── useProducts.ts
│ │ └── useOrders.ts
│
│ ├── lib/
│ │ ├── axios.ts
│ │ ├── auth.ts
│ │ └── permissions.ts
│
│ ├── types/
│ │ ├── user.types.ts
│ │ ├── product.types.ts
│ │ ├── category.types.ts
│ │ ├── order.types.ts
│ │ └── api.types.ts
│
│ ├── utils/
│ │ ├── constants.ts
│ │ ├── helpers.ts
│ │ ├── validations.ts
│ │ ├── currency.ts
│ │ ├── date.ts
│ │ └── permissions.ts
│
│ └── middleware.ts
│
├── .env.local
├── .env.example
├── next.config.ts
├── tsconfig.json
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
└── README.md

Route Structure

Store Frontend
/
├── /products
├── /categories
├── /collections
├── /cart
├── /wishlist
├── /checkout
├── /blogs
├── /about
├── /contact
└── /account

Admin Panel
/admin
├── /dashboard
├── /products
├── /orders
├── /customers
├── /vendors
├── /coupons
├── /media
├── /cms
├── /marketing
├── /analytics
├── /users
├── /security
└── /settings
