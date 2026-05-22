import { Routes, Route } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout.jsx';
import Overview from './admin/Overview.jsx';
import AdminProducts from './admin/Products.jsx';
import AdminOrders from './admin/Orders.jsx';
import AdminUsers from './admin/Users.jsx';
import AdminCoupons from './admin/Coupons.jsx';

export default function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Overview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="coupons" element={<AdminCoupons />} />
      </Route>
    </Routes>
  );
}
