export const AnimeCard=(name,type,poster)=>{
    return(
        <div className="flex flex-col">
            {name}
            {type}
            <img src={poster} alt={name} />
</div>
    )
}