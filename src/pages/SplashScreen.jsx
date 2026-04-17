import { useEffect } from "react";
import { motion } from "framer-motion";
import NovaRaizLogo from "../components/layout/NovaRaizLogo";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 1700);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white"
      >
        <div className="mx-auto mb-6 flex justify-center">
          <div className="rounded-full p-2 bg-white/10 backdrop-blur-sm shadow-[0_0_40px_rgba(255,255,255,0.18)]">
            <NovaRaizLogo size="large" />
          </div>
        </div>

        <div className="text-3xl font-black tracking-wide">
          Nova Raiz Jiu-jitsu
        </div>

        <div className="text-red-100 mt-2">
          Disciplina, evolução e constância no tatame
        </div>

        <div className="mt-8 w-56 h-2 rounded-full bg-white/15 overflow-hidden mx-auto">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="h-full w-full bg-white"
          />
        </div>
      </motion.div>
    </div>
  );
}