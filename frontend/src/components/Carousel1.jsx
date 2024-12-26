import { Carousel, Typography, Button, IconButton } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const SlideShow = ({ animeData }) => {
  return (
    <div className="">
    <Carousel loop autoplay className="rounded-sm"
    navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4  flex -translate-x-2/4 gap-2">
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
     >
      {animeData.slice(1,10).map((anime, index) => (
        <div
          key={index}
          className="relative h-[275px] sm:h-[500px] lg:h-[600px] xl:h-[700px] "
        >
        
        <div
  className="absolute inset-0 z-0 bg-cover bg-center filter "
  style={{
    backgroundImage: `url(${anime.poster})`,
  }}
></div>



          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/[.25] md:bg-black/[.50] to-transparent "></div>

          <Link to={`/anime/${anime.id}`}>
            <div className="relative flex items-center justify-between h-full px-16 sm:pl-16">
              {/* Description Section */}
              <div className="text-left max-w-xl px-5 text-center ">
                <Typography
                  variant="h1"
                  color="white"
                  className="mb-4 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-4 sm:px-0"
                >
                  {anime.name}
                </Typography>
                <div className="hidden sm:block">
                <Typography
  variant="lead"
  color="white"
  className="mb-12 text-sm sm:text-md h-24 w-[500px] overflow-hidden text-ellipsis line-clamp-4  leading-relaxed"
>
  <div
    dangerouslySetInnerHTML={{ __html: anime.description }}
  />
</Typography>
                </div>
                <div className="hidden sm:block">
                  <Link to={`/watch/${anime.id}`}>
                    <Button
                      size=""
                      color="white"
                      className="text-xs sm:text-base lg:text-lg xl:text-xl p-2 sm:px-4 bg-amber-200 bg-opacity-80"
                    >
                      Watch
                    </Button>
                  </Link>
                  <Link to={`/anime/${anime.id}`}>
                    <Button
                      size="lg"
                      color="white"
                      className="text-xs sm:text-base lg:text-lg xl:text-xl ml-4 p-2 sm:px-4 bg-lime-300 bg-opacity-80"
                    >
                      Info
                    </Button>
                  </Link>
                </div>
              </div>

       

            </div>
          </Link>
        </div>
      ))}
    </Carousel>
    </div>
  );
};

export default SlideShow;