import { Heading } from "./Heading";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center pb-2">
          <Heading label="Index" />
        </div>
        
        <p className="text-center text-gray-300 pb-4">
          Search anime by alphabet A to Z.
        </p>

        <div className="w-full mx-auto grid grid-cols-9 md:flex md:justify-center md:flex-wrap gap-2 md:gap-3">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
            <a
              key={letter}
              href={`/a-z/${letter.toLowerCase()}`}
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg p-1 md:p-3 text-xs md:text-base transition-all duration-300 hover:scale-110 hover:text-white text-gray-300"
            >
              {letter}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;