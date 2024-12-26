import { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) { // Adjust this value to control when the button appears
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-black bg-opacity-50 text-white text-4xl font-extrabold px-5 py-2 rounded-full shadow-lg "
        style={{ zIndex: 999 }}
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTop;
