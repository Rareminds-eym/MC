// import React, { useEffect, useState } from "react";
// import { createLevel4Service, Level4GameData } from "./services/level4";

// // TODO: Replace with your actual Supabase credentials
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "YOUR_SUPABASE_URL";
// const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || "YOUR_SUPABASE_KEY";
// const level4Service = createLevel4Service(supabaseUrl, supabaseKey);

// interface Level4ScorePanelProps {
//   userId: string;
//   module: number;
// }

// const Level4ScorePanel: React.FC<Level4ScorePanelProps> = ({ userId, module }) => {
//   const [score, setScore] = useState<number>(0);
//   const [time, setTime] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       try {
//         const data: Level4GameData | null = await level4Service.getUserModuleData(userId, module);
//         if (data) {
//           setScore(data.score);
//           setTime(data.time?.[0] ?? 0); // Assuming time is an array
//         }
//       } catch (err) {
//         setScore(0);
//         setTime(0);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [userId, module]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="flex items-center justify-center gap-4 lg:mb-4 w-full">
//       {/* Left: Score and Time content */}
//       <div className="flex flex-col items-start justify-center">
//         <div className="mb-2">
//           <span className="text-sm lg:text-lg font-bold text-blue-700">Score</span>
//           <span className="block text-sm lg:text-2xl font-extrabold text-green-600">{score} / 30</span>
//         </div>
//         <div>
//           <span className="text-sm lg:text-lg font-bold text-blue-700">Time</span>
//           <span className="block text-sm lg:text-2xl  font-extrabold text-yellow-600">{time}</span>
//         </div>
//       </div>
//       {/* Right: Character image */}
//       <div className="flex-shrink-0">
//         <img
//           src="/Level4/chara1.webp"
//           alt="Character"
//           className="object-contain w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] rounded-lg"
//         />
//       </div>
//     </div>
//   );
// };

// export default Level4ScorePanel;
