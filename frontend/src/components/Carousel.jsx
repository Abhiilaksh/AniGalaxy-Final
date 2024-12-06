import { Carousel, Typography, Button,IconButton } from "@material-tailwind/react";


const SlideShow = ({ animeData }) => {
  return (
    <Carousel loop autoplay className="rounded-xl"
    navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4"
        >   <div className="ml-[-27px] sm:ml-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          </div>
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4"
        >
            <div className="mr-[-35px] sm:mr-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
          </div>
        </IconButton>
      )}>
      {animeData.map((anime, index) => (
        <div key={index} className="relative h-80 sm:h-[500px] lg:h-[600px] xl:h-[700px] h-[400px]">
          <img
            src={anime.poster}
            alt={anime.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-start bg-black/[.55] pl-8 sm:pl-16">
            <div className="text-left max-w-xl px-6">
              <Typography
                variant="h1"
                color="white"
                className="mb-4 text-xl sm:text-3xl md:text-4xl lg:text-5xl pb-4"
              >
                {anime.name}
              </Typography>
              {/* Hide description on smaller screens */}
              <div className="hidden sm:block">
              <Typography
                variant="lead"
                color="white"
                className="mb-12 opacity-80  text-sm sm:text-md h-24 w-[500px] overflow-hidden text-ellipsis line-clamp-4 font-semibold leading-relaxed "
              >
                {anime.description}
              </Typography>
              </div>
              <Button
                size="lg"
                color="white"
                className="text-sm sm:text-base lg:text-lg xl:text-xl p-2 sm:px-4 " 
              >
                Watch
              </Button>
              <Button
                size="lg"
                color="white"
                className="text-sm sm:text-base lg:text-lg xl:text-xl ml-4 p-2 sm:px-4" 
              >
                Info
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default SlideShow;
