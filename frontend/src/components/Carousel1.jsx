import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Typography, Button } from '@material-tailwind/react';
import { Play, Info } from 'lucide-react';
import { motion } from "motion/react"
const SlideShow = ({ animeData = [] }) => {
  const slides = animeData.slice(0, 11);

  return (

    <motion.div initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: .75}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} className="relative w-full" >
      <Carousel
        loop
        autoplay
        className="rounded-xl overflow-hidden"
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-8 left-2/4 z-50 flex -translate-x-2/4 gap-3">
            {Array.from({ length }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"}
                `}
              />
            ))}
          </div>
        )}
      >
        {slides.map((anime, index) => (
          <div
            key={index}
            className="relative h-[300px] sm:h-[500px] lg:h-[600px] xl:h-[700px]"
          >
            {/* Background Image with Blur Effect */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${anime.poster})`,
                
                
              }}
            />

           
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

            {/* Content Container */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  {/* Title */}
                  <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-4xl font-bold text-white mb-4 sm:mb-12 line-clamp-2 text-center sm:text-left">
                    {anime.name}
                  </h2>

                  {/* Description - Hidden on mobile
                  <div className="hidden sm:block mb-8">
                    <div 
                      className="text-white/90 text-sm sm:text-base lg:text-lg prose line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: anime.description 
                      }}
                    />
                  </div> */}

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center sm:justify-start">
                    <Link to={`/watch/${anime.id}`}>
                      <Button
                        size="lg"
                        
                        className="flex items-center gap-2 border-white text-white hover:bg-black/50 transition-colors p-4 bg-black/20 sm: bg-black/55"
                         >
                        <Play size={20} className='block sm:hidden' />

                        <span className="hidden sm:inline">Watch Now</span>
                      </Button>
                    </Link>
                    
                    <Link to={`/anime/${anime.id}`}>
                      <Button
                        size="lg"
                        
                        className="flex items-center gap-2 border-white text-white hover:bg-black/50 transition-colors p-4 bg-black/20 sm: bg-black/55"
                      >
                        <Info size={20} className='block sm:hidden text-white ' />
                        <span className="hidden sm:inline">More Info</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </motion.div>
  );
};

export default SlideShow;