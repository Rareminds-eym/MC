import React, { useRef, useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useDeviceLayout } from "../hooks/useOrientation";

// Avatar options for modal
const AVATAR_OPTIONS = [
  {
    label: "Aman",
    src: "/characters/Intern1.png",
  },
  {
    label: "Mike",
    src: "/characters/Intern2.png",
  },
  {
    label: "Joel",
    src: "/characters/Intern3.png",
  },
  {
    label: "Pranav",
    src: "/characters/Intern4.png",
  },
  {
    label: "Lakshya",
    src: "/characters/Intern5.png",
  },
  {
    label: "Faisal",
    src: "/characters/Intern6.png",
  },
  {
    label: "Lalit",
    src: "/characters/Intern7.png",
  },
  {
    label: "Tejas",
    src: "/characters/Intern8.png",
  },
  {
    label: "Niharika",
    src: "/characters/Intern9.png",
  }, 
  {
    label: "Shiney",
    src: "/characters/Intern10.png",
  }
];

const HomeScreen: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout
  const [profileOpen, setProfileOpen] = useState(false);
  const layout = useDeviceLayout();

  // Avatar selection state, default to Intern 1, load from localStorage if available
  const [avatar, setAvatar] = useState<string>(
    () => localStorage.getItem("selectedAvatar") || "/characters/Intern1.png"
  );
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedAvatar", avatar);
  }, [avatar]);

  const startGame = () => {
    navigate("/modules");
  };

  const continueGame = () => {
    navigate("/modules");
  };

  const viewScores = () => {
    navigate("/scores");
  };

  const viewInstructions = () => {
    navigate("/instructions");
  };

  const quitGame = () => {
    window.close();
  };

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    } else {
      // fallback: clear token and reload
      localStorage.removeItem("authToken");
    }
    navigate("/auth", { replace: true });
  };

  return (
    <div
      className={`min-h-screen w-screen relative bg-cover bg-center flex flex-col${
        layout.isMobile && layout.isHorizontal ? " px-2 py-2" : ""
      }`}
      style={{ backgroundImage: `url('/backgrounds/Homepagebg.webp')` }}
    >
      {/* Social Media Vertical Bar */}
      <div className="fixed top-1/2 left-0 z-40 -translate-y-1/2 flex flex-col gap-3 p-2 bg-white/10 rounded-r-2xl shadow-lg backdrop-blur-md border-l-4 border-green-400">
        {[
          {
            label: 'Instagram',
            icon: <Icon icon="mdi:instagram" width={28} height={28} />, // color handled below
            url: 'https://www.instagram.com/rareminds.uni?igsh=MTV6NTNwa3N6cmcycw==',
            color: 'hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-400',
          },
          {
            label: 'Facebook',
            icon: <Icon icon="mdi:facebook" width={28} height={28} />,
            url: 'https://www.facebook.com/profile.php?id=61576552526095',
            color: 'hover:bg-blue-700',
          },
          {
            label: 'LinkedIn',
            icon: <Icon icon="mdi:linkedin" width={28} height={28} />,
            url: 'https://www.linkedin.com/company/rareminds/',
            color: 'hover:bg-blue-800',
          },
        ].map((item, idx) => (
          <motion.a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 bg-white/80 border-2 border-green-300 shadow-md mb-1 hover:scale-110 ${item.color}`}
            title={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.08, type: 'spring' }}
            whileHover={{ scale: 1.18, rotate: 6 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="transition-colors duration-200 group-hover:text-white text-gray-700">
              {item.icon}
            </span>
          </motion.a>
        ))}
      </div>
      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className={`bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-2xl p-8 sm:p-6 w-full flex flex-col items-center relative backdrop-blur-md transition-all duration-300
              ${layout.isMobile && layout.isHorizontal ? 'max-w-md min-w-[340px] p-2' : 'max-w-3xl'}`}
          >
            <h2 className={`font-bold mb-6 text-white drop-shadow ${layout.isMobile && layout.isHorizontal ? 'text-lg' : 'text-2xl'}`}>
              Choose Your Avatar
            </h2>
            <div className={`grid grid-cols-4 w-full mb-2 ${layout.isMobile && layout.isHorizontal ? 'gap-4' : 'gap-12'}`}>
              {AVATAR_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all bg-white/80 hover:bg-white ${
                    layout.isMobile && layout.isHorizontal
                      ? 'p-2 min-w-[60px] min-h-[60px]'
                      : 'p-4'
                  } ${
                    avatar === option.src
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    setAvatar(option.src);
                    setShowAvatarModal(false);
                  }}
                  type="button"
                >
                  <img
                    src={option.src}
                    alt={option.label}
                    className={`${layout.isMobile && layout.isHorizontal ? 'w-14 h-14' : 'w-24 h-24'} rounded-full object-cover border border-gray-200 mb-2`}
                  />
                  <span className={`font-semibold text-blue-900 ${layout.isMobile && layout.isHorizontal ? 'text-xs' : 'text-base'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              className="absolute top-3 right-5 text-white hover:text-gray-200 text-3xl font-bold"
              onClick={() => setShowAvatarModal(false)}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Player avatar top right with dropdown */}
      <div
        className={`absolute top-4 right-4 z-30${
          layout.isMobile && layout.isHorizontal ? " scale-90" : ""
        }`}
      >
        <div className="relative">
          <img
            src={avatar}
            alt="Player Avatar"
            className="w-16 h-16 rounded-full border-4 border-green-400 shadow-[0_0_16px_4px_rgba(34,197,94,0.7)] cursor-pointer transition-all duration-300"
            onClick={() => setProfileOpen((v) => !v)}
            tabIndex={0}
            onBlur={() => setTimeout(() => setProfileOpen(false), 150)}
          />
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-green-200 rounded-xl shadow-lg py-4 px-5 flex flex-col items-center animate-fade-in z-40 backdrop-blur-md">
                <span className="font-bold text-lg text-blue-900 mb-3 text-center tracking-wide break-words break-all">
                  {user?.user_metadata?.full_name || user?.email || "Player"}
                </span>
              {/* Avatars button */}
              <Button
                size="sm"
                className="w-full mb-3"
                onClick={() => setShowAvatarModal(true)}
              >
                Avatars
              </Button>
              <Button size="sm" variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Lab game sound */}
      <audio ref={audioRef} src="/lab-game-sound.mp3" loop />
      {/* Title & Main content aligned */}
      <div
        className={`flex flex-col items-center justify-center flex-1 z-20${
          layout.isMobile && layout.isHorizontal ? " mt-2" : " mt-8"
        }`}
      >
        <motion.h1
          className={`relative text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center tracking-widest select-none ${
            layout.isMobile && layout.isHorizontal ? " text-2xl mb-2" : "mb-10"
          }`}
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
        >
          <span className="inline-block animate-bounce text-emerald-300 drop-shadow-lg mr-2">
            <Icon icon="mdi:cube-outline" width={38} height={38} />
          </span>
          <span
            className="bg-gradient-to-r from-green-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg shadow-green-200 px-2 rounded-lg border-b-4 border-green-400"
            style={{
              WebkitTextStroke: '2px #064e3b',
              // textStroke is not standard in React, so only WebkitTextStroke is used
              filter: 'drop-shadow(0 2px 4px #34d399)' // extra glow for outline
            }}
          >
            GMP QUEST
          </span>
          <span className="inline-block animate-bounce text-emerald-300 drop-shadow-lg ml-2" style={{ animationDelay: '0.2s' }}>
            <Icon icon="mdi:clipboard-check-outline" width={38} height={38} />
          </span>
          <span className="block text-base md:text-lg font-semibold text-emerald-200 mt-2 tracking-normal animate-fade-in-slow">
            Embark on your adventure!
          </span>
        </motion.h1>
        {/* items list */}
        <motion.div
          className={`relative flex flex-row justify-center items-center w-max max-w-3xl${
            layout.isMobile && layout.isHorizontal ? " gap-2" : ""
          }`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
        >
          <motion.ul
            className={`flex flex-col items-center z-20 list-none p-0 m-0${
              layout.isMobile && layout.isHorizontal ? " gap-1" : " gap-3"
            }`}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {[
              { label: "Start Game", onClick: startGame },
              { label: "Continue", onClick: continueGame },
              { label: "View Scores", onClick: viewScores },
              { label: "Instructions", onClick: viewInstructions },
              {
                label: "Quit Game",
                onClick: quitGame,
                variant: "danger" as const,
              },
            ].map((btn, idx) => (
              <motion.li
                key={btn.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.5 + idx * 0.07 }}
                className={`w-full ${
                  layout.isMobile && layout.isHorizontal ? " mb-1" : " mb-2"
                }`}
              >
                <Button
                  onClick={btn.onClick}
                  {...(btn.variant ? { variant: btn.variant } : {})}
                  className={
                    layout.isMobile && layout.isHorizontal
                      ? "px-0.5 py-0 !text-[14px] min-w-[60px] !h-9 !mb-2 rounded"
                      : "px-3 py-2 text-base min-w-[120px] !h-12 rounded-lg"
                  }
                >
                  {btn.label}
                </Button>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            className={`absolute z-20 w-max right-0 bottom-0 translate-x-[100%]${
              layout.isMobile && layout.isHorizontal ? "" : ""
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.0, delay: 0, type: "spring" }}
          >
            <img
              src="/characters/intern.png"
              alt="Scientist Character"
              className={
                layout.isMobile && layout.isHorizontal
                  ? "h-[220px] mb-0"
                  : "h-[380px] mb-0"
              }
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { HomeScreen };
