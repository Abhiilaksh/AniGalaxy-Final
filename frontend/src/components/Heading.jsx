
export function Heading({label,color}) {
    return <div className={`font-bold text-2xl sm:text-4xl pt-6 text-${color}`}>
      {label}
    </div>
}