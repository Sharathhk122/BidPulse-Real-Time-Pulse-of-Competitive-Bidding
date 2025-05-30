import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellerDashboard from "./pages/SellerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CreateAuction from "./pages/CreateAuction";
import AuctionDetails from "./pages/AuctionDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import ErrorBoundary from "./pages/ErrorBoundary";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="flex flex-col min-h-screen">
            <Toaster position="top-right" />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/createauction" element={<CreateAuction />} />
                <Route path="/auctions/:id" element={<AuctionDetails />} />

                <Route
                  path="/seller-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["seller", "admin"]}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />

<Route
  path="/create-auction"
  element={
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <ErrorBoundary>
        <CreateAuction />
      </ErrorBoundary>
    </ProtectedRoute>
  }
/>

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
