import React, { useState } from "react";

const AVATAR_OPTIONS = [
  {
    label: "Intern 1",
    src: "/characters/Intern1.png",
  },
  {
    label: "Intern 2",
    src: "/characters/Intern2.png",
  },
  {
    label: "Intern 3",
    src: "/characters/Intern3.png",
  },
  {
    label: "Intern4",
    src: "/characters/Intern4.png",
  },
  {
    label: "Intern5",
    src: "/characters/Intern5.png",
  },
];

interface AvatarSelectorProps {
  avatar: string;
  setAvatar: (src: string) => void;
  onAvatarChange?: (src: string) => void;
  triggerClassName?: string;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatar,
  setAvatar,
  onAvatarChange,
  triggerClassName = "w-16 h-16 rounded-full border-4 border-green-400 shadow-[0_0_16px_4px_rgba(34,197,94,0.7)] cursor-pointer transition-all duration-300",
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (src: string) => {
    setAvatar(src);
    if (onAvatarChange) onAvatarChange(src);
    setShowModal(false);
  };

  return (
    <>
      <img
        src={avatar}
        alt="Player Avatar"
        className={triggerClassName}
        onClick={() => setShowModal(true)}
        tabIndex={0}
        style={{ userSelect: "none" }}
      />
      {/* Avatar Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center relative backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-6 text-white drop-shadow">
              Choose Your Avatar
            </h2>
            <div className="grid grid-cols-3 gap-8 w-full mb-2">
              {AVATAR_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all bg-white/80 hover:bg-white ${
                    avatar === option.src
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelect(option.src)}
                  type="button"
                >
                  <img
                    src={option.src}
                    alt={option.label}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200 mb-2"
                  />
                  <span className="font-semibold text-base text-blue-900">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              className="absolute top-3 right-5 text-white hover:text-gray-200 text-3xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarSelector;
