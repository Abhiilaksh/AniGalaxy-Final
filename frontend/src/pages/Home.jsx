let api = `${import.meta.env.VITE_ANIME_KEY}/home`;
export const Home=()=>{
    
    console.log("rendered")
    console.log(api);
    const respone=fetch(`${api}/home`)
   
    return (
        // latest episode animes
        <div>
            hello
        </div>
    )
}