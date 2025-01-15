import { Link } from "react-router-dom";

export const AnimeCard = ({ title, image,id }) => {
    return (
        <Link to={`/anime/${id}`}>
      <div className="flex flex-col justify-center items-center p-2 hover:scale-105 transition ease-in-out delay-150 w-full sm:w-48 md:w-56 lg:w-64">
        <div className="w-36 sm:w-48 h-48 sm:h-56 md:h-64 lg:h-64">
          <img src={image} alt={title} className="w-full h-full object-cover rounded-md shadow-md" />
        </div>
        <div className="mt-2 truncate w-36 text-center text-sm">{title}</div>
      </div>
      </Link>
    );
  };
  