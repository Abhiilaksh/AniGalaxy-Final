import { useState, useEffect } from "react";
import { Heading } from "./Heading";
import { InputBox } from "./InputBox";
import { jwtDecode } from "jwt-decode";

export const AnimeDiscussion = ({ animeId }) => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const validateTokenAndFetchComments = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decoded = jwtDecode(token);
                    setIsLoggedin(true);
                    setUsername(decoded.name);
                }

                const response = await fetch(
                    `https://api.anigalaxy.xyz/api/v1/anime/comment?animeId=${animeId}`
                );
                
                if (response.status === 403) {
                    // Token is invalid, remove it from localStorage and redirect to login
                    localStorage.removeItem("token");
                    navigate("/signin");
                    return;
                  }
                if (!response.ok) {
                    throw new Error(`Failed to fetch comments: ${response.statusText}`);
                }
                
                const { comments: fetchedComments } = await response.json();
                setComments(Array.isArray(fetchedComments) ? fetchedComments : []);
            } catch (err) {
                console.error("Error:", err);
                setError(err.message || "Failed to load comments");
            } finally {
                setIsLoading(false);
            }
        };

        validateTokenAndFetchComments();
    }, [animeId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const trimmedComment = newComment.trim();
        
        if (!trimmedComment) return;

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You need to log in first.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            
            const response = await fetch("https://api.anigalaxy.xyz/api/v1/anime/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    animeId,
                    name: username,
                    comment: trimmedComment,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit comment: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Add the new comment to the existing comments
            if (data.comment) {
                setComments(prevComments => [data.comment, ...prevComments]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Submit error:", err);
            setError(err.message || "Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && comments.length === 0) {
        return (
            <div className="flex items-center justify-center p-4" role="status">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
                <span className="ml-2">Loading comments...</span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl sm:mx-auto mr-8  p-4 ">
            <Heading label="Discussion" />
            
            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
                    {error}
                </div>
            )}
            
            {isLoggedin ? (
                <div className="w-full max-w-lg">
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <InputBox
                            label="Comment"
                            placeholder="Share your thoughts..."
                            color="white"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={isSubmitting}
                            aria-label="Comment input"
                        />
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-pink-100 text-black rounded hover:bg-pink-200 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={isSubmitting || !newComment.trim()}
                        >
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </button>
                    </form>
                </div>
            ) : (
                <p className="text-gray-600 mb-4 ">Please log in to post a comment.</p>
            )}

            <div className="mt-6 space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <article 
                            key={comment._id} 
                            className="p-4 bg-white rounded-lg shadow-sm border"
                        >
                            <header className="mb-2">
                                <h3 className="font-bold text-gray-900">
                                    {comment.name || "Anonymous"}
                                </h3>
                            </header>
                            <p className="text-gray-700">{comment.comment}</p>
                        </article>
                    ))
                ) : (
                    <p className="text-gray-600  italic">
                        No comments yet. Be the first to comment!
                    </p>
                )}
            </div>
        </div>
    );
};

export default AnimeDiscussion;