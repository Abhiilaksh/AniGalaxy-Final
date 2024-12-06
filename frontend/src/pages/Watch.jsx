import { useParams } from "react-router-dom"
import { useState,useEffect } from "react";
export const Watch=()=>{
const {anime}=useParams();
return(
    <div>
        Watch {anime}
    </div>
)    
}