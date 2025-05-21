import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // ✅ import AuthProvider
import MainLayout from "./layouts/MainLayout";
import Loader from "./components/Loader";

const Signup = lazy(() => import("./pages/Auth/Login"));
const Home = lazy(() => import("./pages/MainHeading/Home"));
const SingleHeading = lazy(() => import("./pages/MainHeading/AddHeading"));
const EditHeading = lazy(() => import("./pages/MainHeading/EditHeading"));
const SubHeading = lazy(() => import("./pages/SubHeading/SubHeading"));
const AddSubHeading = lazy(() => import("./pages/SubHeading/AddMainHeading"));
const EditSubHeading = lazy(() => import("./pages/SubHeading/EditMainHeading"));
const AddProducts = lazy(() => import("./pages/Product/AddProduct"));
const Products = lazy(() => import("./pages/Product/ViewProducts"));
const EditProduct = lazy(() => import("./pages/Product/EditProduct"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Addheading"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SingleHeading />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/editheading/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EditHeading />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subheading"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SubHeading />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/addsubHeading"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AddSubHeading />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/EditsubHeading"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EditSubHeading />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/addProduct"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AddProducts />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Products />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/EditProducts"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EditProduct />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
