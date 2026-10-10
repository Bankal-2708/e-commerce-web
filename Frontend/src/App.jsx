import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';


const Logo = lazy(() => import('./components/onboarding/Logo'));
const StepOne = lazy(() => import('./components/onboarding/StepOne'));
const StepTwo = lazy(() => import('./components/onboarding/StepTwo'));
const StepThree = lazy(() => import('./components/onboarding/StepThree'));
const AuthScreen = lazy(() => import('./components/auth/AuthScreen'));
const Home = lazy(() => import('./components/Home/Home'));
const ShopList = lazy(() => import('./components/Home/Pages/shopList'));
const Profile = lazy(() => import('./components/Home/Pages/profileSet.jsx'));
const Wardrobe = lazy(() => import('./components/Home/Pages/wardrobe.jsx'));
const TryOn = lazy(() => import('./components/Home/Pages/tryOn.jsx'));
const Planner = lazy(() => import('./components/Home/Pages/planner.jsx'));
const BrandPortal = lazy(() => import('./components/Home/Pages/brandPortal.jsx'));
const AddProduct = lazy(() => import('./components/Home/Pages/addProduct.jsx'));
const EditProduct = lazy(() => import('./components/Home/Pages/editProduct.jsx'));
const FashionProfile = lazy(() => import('./components/Home/Pages/fashionProfile.jsx'));
const Cart = lazy(() => import('./components/Home/Pages/Cart.jsx'));
const ProductDetails = lazy(() => import('./components/Home/Pages/productDetail.jsx'));


function PageLoader() {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <div>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Logo />} />
          <Route path="/step-one" element={<StepOne />} />
          <Route path="/step-two" element={<StepTwo />} />
          <Route path="/step-three" element={<StepThree />} />
          <Route path="/authscreen" element={<AuthScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shopList" element={<ShopList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/fashionProfile" element={<FashionProfile />} />
          <Route path="/brand-portal" element={<BrandPortal />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/editProduct/:id" element={<EditProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;