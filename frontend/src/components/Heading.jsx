
export function Heading({label,size}) {
    return <div className={`font-bold text-${size} sm:text-[35px] pt-6 `}>
      {label}
    </div>
}