
export function Heading({label,color ,size}) {
    return <div className={`font-bold text-${size} sm:text-4xl pt-6 text-${color}`}>
      {label}
    </div>
}