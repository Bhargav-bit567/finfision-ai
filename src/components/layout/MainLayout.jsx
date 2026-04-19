import AppSidebar from "./AppSidebar";
import Footer from "../landing/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <AppSidebar />
      
      <div className="page-content-wrapper">
        <main className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </main>
        <Footer onOpenTrading={() => navigate("/trade")} />
      </div>

      <div className="global-bg-layers">
        <div className="bg-layer circle-1" />
        <div className="bg-layer circle-2" />
        <div className="bg-layer noise" />
      </div>
    </div>
  );
};

export default MainLayout;
