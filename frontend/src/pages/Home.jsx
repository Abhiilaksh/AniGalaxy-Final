import SlideShow from "../components/Carousel";
import { useEffect, useState } from "react";

export const Home = () => {
    const [slide, setSlide] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://aniwatch-api-abhiilakshs-projects.vercel.app/api/v2/hianime/home");
                const data = await response.json();
                setSlide(data.data.spotlightAnimes);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <SlideShow animeData={slide} />
        </div>
    );
};