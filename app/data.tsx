import {
  FaBoxOpen,
  FaBullhorn,
  FaChartLine,
  FaCog,
  FaDollarSign,
  FaFileAlt,
  FaGem,
  FaGlobe,
  FaHome,
  FaImage,
  FaShieldAlt,
  FaShoppingBag,
  FaStar,
  FaStore,
  FaTags,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

export const categories = [
  {
    name: "Rings",
    image: "...",
  },
  {
    name: "Necklaces",
    image: "...",
  },
];

export const bestSellers = [
  {
    name: "Celeste Diamond Necklace",
    sku: "JN-401",
    price: "Rs. 86,500",
  },
];

export const arrivals = [
  {
    name: "Seraphina Pearl Drop",
    price: "Rs. 21,400",
  },
];

const AdminPanel = () => {
  return <div>Admin Content</div>;
};

export default AdminPanel;

export const UserPanel = () => {
  return <div>User Content</div>;
};

export const benefits = [
  {
    icon: "shipping",
    title: "Free Shipping",
    text: "Complimentary insured delivery on every fine jewellery order.",
  },
  {
    icon: "shield",
    title: "Secure Payments",
    text: "Protected checkout with trusted payment processing.",
  },
  {
    icon: "diamond",
    title: "Premium Quality",
    text: "Ethically sourced materials and meticulous craftsmanship.",
  },
  {
    icon: "return",
    title: "Easy Returns",
    text: "Simple returns for a smooth and confident shopping experience.",
  },
];

export const testimonials = [
  {
    name: "Mira Shah",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    text: "The necklace feels heirloom-worthy. Every detail arrived beautifully packaged and exceeded my expectations.",
  },
  {
    name: "Anaya Mehta",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    text: "Elegant, minimal, and luminous. My bridal earrings were absolutely perfect for my special day.",
  },
  {
    name: "Kiara Patel",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80",
    text: "The quality is exceptional, and the shopping experience felt truly premium from start to finish.",
  },
];

// dashboardMenuItems
export const menuItems = [
  {
    title: "Dashboard",
    icon: <FaHome />,
    children: [
      { label: "Overview", path: "/admin/dashboard" },
      { label: "Analytics", path: "/admin/dashboard/analytics" },
      { label: "Reports", path: "/admin/dashboard/reports" },
    ],
  },
  {
    title: "Products",
    icon: <FaBoxOpen />,
    children: [
      { label: "All Jewelry", path: "/admin/dashboard/products/allproduct" },
      { label: "Add Product", path: "/admin/dashboard/products/addproduct" },
      { label: "Categories", path: "/admin/dashboard/products/categories" },
      {
        label: "Subcategories",
        path: "/admin/dashboard/products/subcategories",
      },
      { label: "Collections", path: "/admin/dashboard/products/collections" },
      { label: "Product Reviews", path: "/admin/dashboard/products/reviews" },
      {
        label: "Inventory Management",
        path: "/admin/dashboard/products/inventory",
      },
      { label: "Product Tags", path: "/admin/dashboard/products/tags" },
    ],
  },
  {
    title: "Orders",
    icon: <FaShoppingBag />,
    children: [
      { label: "All Orders", path: "/admin/dashboard/orders" },
      { label: "Pending Orders", path: "/admin/dashboard/orders/pending" },
      { label: "Processing", path: "/admin/dashboard/orders/processing" },
      { label: "Shipped", path: "/admin/dashboard/orders/shipped" },
      { label: "Delivered", path: "/admin/dashboard/orders/delivered" },
    ],
  },
  {
    title: "Settings",
    icon: <FaCog />,
    children: [
      { label: "General Settings", path: "/admin/dashboard/settings/general" },
      { label: "Payment Gateways", path: "/admin/dashboard/settings/payments" },
      { label: "Shipping Methods", path: "/admin/dashboard/settings/shipping" },
      {
        label: "User Roles & Permissions",
        path: "/admin/dashboard/settings/roles",
      },
    ],
  },
];
