// import React, { useEffect, useState } from "react";
// import { companyLogo } from "../../assets/assets";
// import { motion, useMotionValue } from 'framer-motion'

// const CompanyLogoSlider = () => {
//   const ONE_SECOND = 1000;
//   const AUTO_DELAY = ONE_SECOND * 10;
//   const DRAG_BUFFER = 50;
//   const SPRING_OPTIONS = {
//     type: "spring",
//     mass: 3,
//     stiffness: 400,
//     damping: 50,
//   };

//   const logos = [
//     { src: companyLogo.appleLogo, idx: 1 },
//     { src: companyLogo.googleLogo, idx: 2 },
//     { src: companyLogo.hpLogo, idx: 3 },
//     { src: companyLogo.metaLogo, idx: 4 },
//     { src: companyLogo.microsoftLogo, idx: 5 },
//     { src: companyLogo.samsungLogo, idx: 6 },
//     { src: companyLogo.teslaLogo, idx: 7 },
//   ];
//   const [imgIndex, setImgIndex] = useState(0);
//   const dragX = useMotionValue(0);

//   useEffect(() => {
//     const intervalRef = setInterval(() => {
//       const x = dragX.get();

//       if (x === 0) {
//         setImgIndex((pv) => {
//           if (pv === logos.length - 1) {
//             return 0;
//           }
//           return pv + 1;
//         });
//       }
//     }, AUTO_DELAY);

//     return () => clearInterval(intervalRef);
//   }, []);

//   const onDragEnd = () => {
//     const x = dragX.get();

//     if (x <= -DRAG_BUFFER && imgIndex < logos.length - 1) {
//       setImgIndex((pv) => pv + 1);
//     } else if (x >= DRAG_BUFFER && imgIndex > 0) {
//       setImgIndex((pv) => pv - 1);
//     }
//   };


//   return (
//     <div className="relative overflow-hidden bg-offwhite py-8">
//       <motion.div
//         drag="x"
//         dragConstraints={{
//           left: 0,
//           right: 0,
//         }}
//         style={{
//           x: dragX,
//         }}
//         animate={{
//           translateX: `-${imgIndex * 100}%`,
//         }}
//         transition={SPRING_OPTIONS}
//         onDragEnd={onDragEnd}
//         className="flex cursor-grab active:cursor-grabbing"
//       >
//         {logos.map((logo, index) => (
//           <motion.div
//             key={logo.idx}
//             animate={{
//               scale: imgIndex === index ? 0.95 : 0.85,
//             }}
//             transition={SPRING_OPTIONS}
//             className="shrink-0 flex items-center"
//           >
//             <img
//               src={logo.src}
//               className="max-h-[150px] w-autoobject-contain"
//             />
//           </motion.div>
//         ))}
//       </motion.div>
//       <div className="mt-4 flex w-full justify-center gap-2">
//         {logos.map((logo,index) => {
//           return (
//             <button
//               key={logo.idx}
//               onClick={() => setImgIndex(index)}
//               className={`h-3 w-3 rounded-full transition-colors ${index === imgIndex ? "bg-CharcoalBlack" : "bg-neutral-500"
//                 }`}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CompanyLogoSlider;

import React, { useEffect, useState } from "react";
import { companyLogo } from "../../assets/assets";
import { motion } from "framer-motion";

const CompanyLogoSlider = () => {
  const ONE_SECOND = 1000;
  const AUTO_DELAY = ONE_SECOND * 5;
  const SPRING_OPTIONS = {
    type: "spring",
    mass: 1,
    stiffness: 100,
    damping: 20,
  };

  const logos = [
    companyLogo.appleLogo,
    companyLogo.hpLogo,
    companyLogo.samsungLogo,
    companyLogo.uspologo,
    companyLogo.levilogo,
    companyLogo.vanheusen,
    companyLogo.whirlpool
  ];

  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setImgIndex((prev) => (prev === logos.length - 1 ? 0 : prev + 1));
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, []);

  return (
    <div className="relative flex h-[150px] justify-center bg-offwhite mt-5 mb-2">
      <motion.img
        key={imgIndex}
        src={logos[imgIndex]}
        alt={`Logo ${imgIndex}`}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={SPRING_OPTIONS}
        className="max-h-[150px] max-w-[300px] object-contain p-5"
      />
    </div>
  );
};

export default CompanyLogoSlider;


