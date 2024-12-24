import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader } from "../components/Spinner";
const animeKey = import.meta.env.VITE_ANIME_KEY;
import { AnimeCard } from "../components/AnimeCard";

export const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [favouriteAnimes, setFavouriteAnimes] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const scrollContainerRef = useRef(null);
    const [showScrollButtons, setShowScrollButtons] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const container = scrollContainerRef.current;
            if (container) {
                setShowScrollButtons(container.scrollWidth > container.clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [favouriteAnimes]);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            navigate("/");
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/signup");
                return;
            }

            try {
                const response = await fetch("https://anigalaxy-final-1.onrender.com/api/v1/user/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                    setFormData(data.user);
                    await fetchAnimeDetails(data.user.favouriteAnime);
                } else {
                    navigate("/signup");
                }
            } catch (error) {
                console.error("Error:", error);
                navigate("/signup");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchAnimeDetails = async (animeIds) => {
            try {
                const animePromises = animeIds.map(async (id) => {
                    const response = await fetch(`${animeKey}anime/${id}`);
                    if (response.ok) {
                        const result = await response.json();
                        return result?.data?.anime?.info || null;
                    }
                    return null;
                });
        
                const animeDetails = await Promise.all(animePromises);
                setFavouriteAnimes(animeDetails.filter(Boolean));
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("https://anigalaxy-final-1.onrender.com/api/v1/user/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUserData(updatedUser.user);
                setEditMode(false);
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
            {userData && (
                <div className="text-center w-full max-w-2xl px-4">
                    {editMode ? (
                        <form onSubmit={handleEditProfile} className="space-y-4 w-full">
                            <div>
                                <label className="block text-white">First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleInputChange}
                                    className="p-2 rounded bg-gray-200 text-black w-full"
                                    disabled={isUpdating}
                                />
                            </div>
                            <div>
                                <label className="block text-white">Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleInputChange}
                                    className="p-2 rounded bg-gray-200 text-black w-full"
                                    disabled={isUpdating}
                                />
                            </div>
                            <div>
                                <label className="block text-white">Email:</label>
                                <input
                                    type="email"
                                    name="username"
                                    value={formData.username || ""}
                                    onChange={handleInputChange}
                                    className="p-2 rounded bg-gray-200 text-black w-full"
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button 
                                    type="submit" 
                                    className="bg-green-500 text-white px-4 py-2 rounded w-full flex items-center justify-center"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Updating......' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="bg-red-500 text-white px-4 py-2 rounded w-full"
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-white">Welcome, {userData.firstName}</h1>
                            <p className="text-gray-400">Email: {userData.username}</p>
                           
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-pink-500 text-white px-4 py-2 rounded w-full"
                                >
                                    Logout
                                </button>
                            </div>
                            <div className="my-4">
                                <h2 className="text-lg font-semibold text-white">Favourite Anime:</h2>
                                <div className="relative">
                                    {showScrollButtons && (
                                        <>
                                            <button 
                                                onClick={() => scroll('left')}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                                            >
                                                <ChevronLeft className="text-white" />
                                            </button>
                                            <button 
                                                onClick={() => scroll('right')}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                                            >
                                                <ChevronRight className="text-white" />
                                            </button>
                                        </>
                                    )}
                                    <ul
                                        ref={scrollContainerRef}
                                        className="flex overflow-x-auto mt-4 scrollbar-hide no-scrollbar px-8 gap-4"
                                    >
                                        {favouriteAnimes.map((anime) => ( 
                                            <li key={anime.id}>
                                                <AnimeCard
                                                    title={anime.name}
                                                    image={anime.poster}
                                                    id={anime.id}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};