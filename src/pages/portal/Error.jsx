import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white text-center p-6">
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        whileHover={{ scale: 1.2, rotate: 10 }}
        className="text-emerald-400 mb-6"
      >
        <ShieldAlert size={90} />
      </motion.div>

      {/* Animated Message */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-300"
      >
        Our APIs are running on{" "}
        <motion.span
          whileHover={{ scale: 1.1, color: "#34D399" }}
          transition={{ duration: 0.2 }}
          className="text-emerald-400"
        >
          localhost
        </motion.span>{" "}
        for security reasons.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-3 text-gray-400 text-lg"
      >
        Please check our API responses and model outputs in the provided PPT.
      </motion.p>

      {/* Glowing Button */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(52, 211, 153, 0.8)" }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-emerald-600 rounded-lg shadow-lg 
                   transition-all hover:bg-emerald-500"
      >
        Blocked
      </motion.a>
    </div>
  );
};

export default ErrorPage;
