import { useState, useEffect } from "react";

export const ResumeWatching = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem('episodeHistory');
        if (storedHistory) {
            try {
                // Parse and update the state only if parsing is successful
                const parsedHistory = JSON.parse(storedHistory);
                
                // Check if the parsed history is an array
                if (Array.isArray(parsedHistory)) {
                    setHistory(parsedHistory);
                } 
            } catch (error) {
                console.error("Error parsing episodeHistory:", error);
            }
        }
    }, []);

    return (
        <div>
            <h2>Resume Watching</h2>
            {/* Render the history if it has content */}
            {history.length > 0 ? (
                <ul>
                    {history.map((episode, index) => (
                        <li key={index}>
                            <a href={`/watch/${episode}`} target="_blank" rel="noopener noreferrer">
                                {episode}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No episodes found in history.</p>
            )}
        </div>
    );
};
