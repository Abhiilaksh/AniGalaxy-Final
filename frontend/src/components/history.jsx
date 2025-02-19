import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimeCard } from "./AnimeCard";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
        <div className="relative pb-[56.25%] bg-gray-700"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-2 bg-gray-700 rounded w-full mt-2"></div>
        </div>
      </div>
    ))}
  </div>
);

const History = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [animeDetails, setAnimeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchAnimeDetails = async (animeId) => {
      try {
        const response = await fetch(
          `https://aniwatch-api-git-main-abhiilakshs-projects.vercel.app/api/v2/hianime/anime/${animeId}`
        );
        if (!response.ok) throw new Error(`Failed to fetch anime ${animeId}`);
        const data = await response.json();
        
        return {
          id: animeId,
          title: data.data.anime.info.name,
          poster: data.data.anime.info.poster,
        };
      } catch (error) {
        console.error(`Error fetching details for anime ${animeId}:`, error);
        return null;
      }
    };

    const loadHistory = async () => {
      try {
        const history = JSON.parse(localStorage.getItem("watchHistory") || "[]").reverse();
        setWatchHistory(history);

        const animeIds = [...new Set(history.map((item) => item.animeId))];

        const animeData = await Promise.all(animeIds.map(fetchAnimeDetails));

        setAnimeDetails(
          animeData.reduce((acc, anime) => {
            if (anime) acc[anime.id] = anime;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your watch history?")) {
      localStorage.removeItem("watchHistory");
      setWatchHistory([]);
      setAnimeDetails({});
    }
  }, []);

  const paginatedHistory = useMemo(() => {
    return watchHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [watchHistory, currentPage]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Watch History</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white text-center mt-10">
        Error: {error}. Please try again later.
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center pt-4 text-center">
  <img
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAhFBMVEUBAQEAAAD////8/PwFBQX5+fn29vbV1dXg4ODR0dHz8/Pl5eW6urro6Ojs7Ow+Pj5TU1N/f38TExO0tLSgoKBeXl6Xl5dra2uJiYnExMTKysqmpqY2Nja2trZLS0sbGxuQkJBnZ2d1dXUsLCwZGRkiIiI5OTlzc3NDQ0N9fX2srKxYWFimP/eyAAALXElEQVR4nO1dC3vqqhLNADEaY3xrfNRq3dZW////uwxEBWJsPd8NEJvVc9h9pJUs1gzDMMQgaPAEgH80ze+aBs/A/XjVp2nQoCK4F3d9mgbPwP141adp0KAiuBd3fZoGDSqCe3HXp2nwDNyPV32aBg0qgntx16dp8Azcj1d9mgYNKoJ7cd8Ufv0Sguu/PjWegLFrXwC/Chgwl/0pgfvxkoPGmNonn7rmnbICMMC15bpLvoKz87Edfn8f57vd9HweDNagGKY/cC9u4clZhxBKaRiGrVYct2ZIlvNeeWqGwJbkBkomPnXuBvfjBcJhqWQRsgIPeuWtsmDB9XRT1tjLyMETACSashbgo3/3QNzCwcNJIytqzLAcABOVK9oDL6XlfrxQVwwyTVmtvQgcPOiah8oKYE5VssKNR33zDFxZX6Fmh0MvybInZPTZgfREhZ8yOMSatMZ/2Qy5duQCWWQXikEUQFtzWp0AvNSWFXCypvFqLfi6QwNfCb5pZtha+0iWrfkOYExIOhthSICZPf0S/qFPh+QIf3chDbDnTomS9EOQYNghkjdoKcKiJPmrysKXgSGmYAgNk4PQFdNfnMFec1q0t5a/6l5PlpXFkKxrWqG9EX5eS+8xsZQmymKaZHiRj2F8tUARwbRFLxZGPuSsqGxSIC0futPC5SHzLPdgwbczfbLj1jhEtrQX58y9c13Rq7RCMkCyvPLydsaD21xIL0aGrmuGTl6TDZ8lO5rTIgv/XLwNZXGBDDV/RMlNW/I6NMpMERZeNM/nBh9EZUtZ6Mn/RbpDIuGx8OKwTnW2OvAH86XcwuYGVzyEGBSCLTgRbX3IjdUzQ7SiYX0tIw2xfYBAtzEYUN1W4755ycubIfdGa0pNssJijG5s8fDf6Yz8kpaFEQEYbdsmWZyLTLJ1mwhgHupkCULzi0r+fP6rL6MsXEaPThg6iQXPlYpUlxamIyL8/k2GuNsqZk0oDU+R41eK9PFWADZdzhZReAjJm8YBzprTkBhOPgG57LlPloxbrZFlxTtiTQzsOyoRYlE9RQ5uZnjZPtS8fGcja2pE7rBgGPx7//KZ4jXMUC6auSkuVBKEA9cjKX7VIaS6tELSOh0A7nRWpl4/s2hpLR6rfkSELpigK0K/pdI1B3X1h2xtiRaZCicXJ/P9pXBLreQ6nLedFr/m/EIOXk5n+IqfPcMjGes/TDrrFSIXXtuLbDBSq93W01kSxThlULG78XJgmA7Vln/kbNwnwD69w5b8pbS9TMbjcbKIeuFNeHyq6FsbdgsOXjaB2KXXyXorptqPoRnBEpmqMNQmPwRmdhL2NiE2dozoFLPH2jX8ktk9Q6Q6Y/Tyn2i6BzuGaFFZGBDhNr2ikRbJpOjUS/QiEZUxYujy+vUQmIWbsQ104IpFUbLEvQum/BzZWkgR3THHEkT57u1rgcGGKDRwSkZ6AI6rF4DVTTs/A4ndWAm1bJphIBYuUait/o4yPr9eIpKmMJPB6W/YEhcmoC4GXsIMcTsaMhKqfnqs1a0Bk+ti+EifEBaPWzfwescMOA/rnua0ooM2ZsKBoSUelr9VlrhoZeOYgVUzlGuVhXav6ZdhQHCZF7975DFd9MoVJd1R9b23D4Bv/ZZ39zuCtGaRzOU8sEDJWHdVSOlX0ne7ysKPvi6XDIK762DMyoyOy/hmavelFXbfdntR+vWKynrvane8KuuGCCKgv11eF4JmSMqZWq6m7yDniNdJl95gOq3k/jwGIjsqCgZHg9my3dOtkcbdTpINZEGhvPrlHDx+GBtjHYC7JQ1waWTuqj/92E5O47ckSU6T7XA+WI8uGa78N+D5vvhuhvyF9ZVy+8dFMAuYeXgz5ymwW3rqQllbzcO3fz56IkJ/JkMwMRvgZxcK7fXeAZAsXVm/+J38kLmesWfurMMWMGFFnyNLykdISrE7+zxZN0P+31gjKyqJs/xrHABYRwsxF1Cb/Qb7yoJ+S+VKLIE9kI2XygKzwi+ri65sAzV06KrpLNIa1IcsqxYo6paz8LotjQpr78FyN2pjhtxlxcoOPv/sDeqT47Q8QEzEDTc7pGQKjbLuDwyDo1KBJYo+oKxQDR589RfA4CtWA1L+6aTMCEW5Vh60B9fznOJLyCvorcOWhpksaNPq4Sml6aa0SoHlpwrEEvr6qCh2e9TWy5qhnAhhae6/l1cLASvNzQRyW9a+tuwNC7/vjnHghMbrB/Uvgajc/dxlp0XU7na77Wj5Nhue87PDgdXsjGVlMXhP5IaoMhVOHqwLkZLNqZMaexWt9mLWlyYZ5Op6MeePieN+Wy3tFlbYvcOVLPFALnZvKSnWzgh0x1Mm6GKysXUbFuQrbn6X6veMz2GbQ7EHIicKsM7EDkXJHhgKbLuG/JBnUH2Zgy0zlLULq1AvrEXmVsXH8+QTwWjWu1WrlSEd9+UEybx8ys9/AprgNDJFwr+K7poQhglZisUj9F695AWC+3BxlpurL3FoQO5kHVaxuD1l5w9rGwfAmJnKQmY/FyWeSoO8onX6BL1mqbZmKLaU16uUEGreujhewdQuQF4tPwzz8vffgc4O1h62VbGy2C5J71ggt6BhIUwSnv19Qlvlbr1IFb+0fbQUcVU8EjCKLiaj3l+IR8qLjw3hXI0690l5xBchyaHyW6ke3DwmBXvCwFQ8rKAwETLYtJ+xQInQ3rNYKlUuJ2RHC746pOFMFnKYF6+7eMT1Oa7430sfLZpqY4Zoh8bpEpF2/4ZAf9S02GyGTWp6t+s/JbOj/Na3rb20ageD6fVFeNImpOlOPnpMFRVy9RUVPDu9njmhofI3LiW8ksKkpAynZsrC5F2mZfswFt0UhSBihujGyIUVSV66XG2Hw2E2GUctQoh2eJjmRamvAO6zY7XqndIxFM9Sov8aLYrrG6RiMfxUc1mbWaelmiQW0oOtpXTFDp4HTpF6Z+m3TN4VfDtMKDVDV375dgO3B9+Jz2B0XnUvbHEpLvM0Re3NMMiPllzsiSYyU6D5dvHERPguuHZK4tk/mbe6dVTWmcJweXFY4kEZlvx71cri/5+vx9/aUykTw7djLz57umfnLpwu+5f6Pv2PilzzMRI+DZ8AZENUNpQlksn5HJdu3+9vezHQn3AuuCJkxkrWfEweWhligqxTnxKcX+ASPEQZwN1zboKSme6u8DDO8cHzGoQYgU3CeG+VqsqVi0y0Fh8HUXots6D6Jfwb+9AIsGi4A1ZM4Fx+I8id1+7D1pNV7Jghf52v4TrfwTLLQgWZ+tsMyFOZrbOgtCwikBXy7E4QUi2qHxG5E3PVExg/xUcjallBmZz/5Z+3+pB9G8PBHr7lEJiHzPlSJit/UM+r4+GoQKAXL2NoerJzuOR52JCvuO+yn8K+Z4SjnYO9oNw3MwxKX0ceHt8aa5zwS06cf1RZj4YK+mbsvgWLQbl/yiqDCAB0YYndRNf98hIsLzFVi0Vin4uXneqae6y5lsOi+Za+e5PzzQwhf5KKFpGOXiXt+f+G8f4CecGW6149gGMz1N/1iqR9yCsgfWycjhO3wp4+Fc60tKh3cDlUDKZ6PBp/5u8G4l5F3ikrgJWex0pqdDTFMgDftlYzw6nX7t2trmEdawudX5zD/7NmGMBRX0OXHk3xBQ6HCrcUDSv01rc7Vxbc3g9F7Km29383Qfoj8Jm/27dOO87riRLnw/cTXJqh3Jzeb+bZqROHmMhqzLAU7PoekVjUPN17/9YxLocq36CWjz+Hwltiedc4hXycWP5uraJHDR6gZvS4F3d9mgbPwP141adp0KAiuBd3fZoGz8D9eNWnadCgIrgXd32aBg0qgntx16dp8Azcj1d9mgYNKoJ7cdenafAM3I9XfZoGDSqCe3HXp2nwDNyPV32aBr/H/wDn0Hfe68XOmwAAAABJRU5ErkJggg=="
    alt=""
  />
  <div className="mt-2 md:mt-0 md:ml-4 px-8 lg:px-0">
    No watch history found. Start watching some anime!
  </div>
</div>

    );
  }

  return (
    <div className="container  px-2 py-8">
      <div className="flex justify-between items-center pl-4 mb-6">
        <h2 className="text-3xl font-bold text-white">Watch History</h2>
        <button
  onClick={clearHistory}
  className=" rounded px-4 py-2 bg-red-600/80  text-white rounded hover:bg-red-600 hover:bg-opacity-90 transition-colors"
>
  Clear History
</button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 ">
        {paginatedHistory.map((item, index) => (
          <AnimeCard
  key={index}
  title={animeDetails[item.animeId]?.title}
  image={animeDetails[item.animeId]?.poster}
  id={item.animeId}
  link={`/watch/${item.animeId}?ep=${item.episodeId}`}
/>
        ))}
      </div>

      {watchHistory.length > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-pink-500 rounded transition-colors ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600"
            }`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {Math.ceil(watchHistory.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * itemsPerPage >= watchHistory.length}
            className={`px-4 py-2 bg-pink-500 rounded transition-colors ${
              currentPage * itemsPerPage >= watchHistory.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-pink-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
