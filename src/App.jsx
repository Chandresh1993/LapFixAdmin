import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // ✅ import AuthProvider
import MainLayout from "./layouts/MainLayout";
import Loader from "./components/Loader";

const Signup = lazy(() => import("./pages/Auth/Login"));
const Home = lazy(() => import("./pages/Heading/Home"));
const SingleHeading = lazy(() => import("./pages/Heading/AddHeading"));
const EditHeading = lazy(() => import("./pages/Heading/EditHeading"));
const SubHeading = lazy(() => import("./pages/SubHeading/SubHeading"));
const AddSubHeading = lazy(() => import("./pages/SubHeading/AddMainHeading"));
const EditSubHeading = lazy(() => import("./pages/SubHeading/EditMainHeading"));
const AddProducts = lazy(() => import("./pages/Product/AddProduct"));
const Products = lazy(() => import("./pages/Product/ViewProducts"));
const EditProduct = lazy(() => import("./pages/Product/EditProduct"));
const AddSecoundHeading = lazy(() =>
  import("./pages/SecoundHeading/AddSecoundHeading")
);
const EditSecoundHeading = lazy(() =>
  import("./pages/SecoundHeading/EditSecoundHeading")
);

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
              path="/addSecoundHeading"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AddSecoundHeading />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/editSecoundHeading"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EditSecoundHeading />
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
              path="/addsubHeading/:id"
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
