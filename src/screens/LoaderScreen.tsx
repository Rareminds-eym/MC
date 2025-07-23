import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeviceLayout } from "../hooks/useOrientation";

interface LoaderScreenProps {
  onComplete?: () => void;
}

function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}

const LoaderScreen: React.FC<LoaderScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { isMobile, isHorizontal } = useDeviceLayout();

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 2 + Math.random() * 3), 360);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        if (isAuthenticated()) {
          navigate("/home");
        } else {
          navigate("/auth");
        }
        if (onComplete) onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete, navigate]);

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center"
      style={{
        backgroundImage: `url('/backgrounds/LoaderBg.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        minWidth: '100vw',
      }}
    >
      <style>
        {`
        /* From Uiverse.io by Shoh2008 */
        .loader {
          width: 48px;
          height: 48px;
          background: #353535;
          display: block;
          margin: 20px auto;
          position: relative;
          box-sizing: border-box;
          animation: rotationBack 1s ease-in-out infinite reverse;
        }
        .loader::before {
          content: '';
          box-sizing: border-box;
          left: 0;
          top: 0;
          transform: rotate(45deg);
          position: absolute;
          width: 48px;
          height: 48px;
          background: #2e2e2e;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
        }
        .loader::after {
          content: '';
          box-sizing: border-box;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          background: rgb(0, 0, 0);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
        }
        @keyframes rotationBack {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        `}
      </style>
      <div
        className="z-20 text-6xl font-bold rounded-2xl mb-[16px]"
        style={{
          backgroundColor: "#164f5fa3",
          boxShadow: "0 4px 16px rgba(31, 38, 135, 0.3)",
          border: "1px solid rgba(59, 130, 246, 0.5)",
          borderRadius: "2rem",
          width: isMobile && isHorizontal ? "220px" : "320px",
          height: isMobile && isHorizontal ? "140px" : "200px",
          textAlign: "center",
          padding: isMobile && isHorizontal ? "12px" : "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "60%",
          left: "60%",
          transform: "translate(-50%, -100%)",
          color: "#0a2240",
        }}
      >
        <div
          className="mb-4"
          style={{
            fontSize: isMobile && isHorizontal ? "0.95rem" : "1.25rem",
            fontWeight: 600,
          }}
        >
          SYSTEM LOADING... {Math.min(Math.floor(progress), 100)}%
        </div>
        {/* Loader animation replaces Cog icon */}
        <span className="loader" style={{ display: "block", margin: "0 auto" }} />
        <div className="w-full bg-gray-200/30 rounded-full h-2 mt-4">
          <div
            className="bg-white text-xl rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoaderScreen;
