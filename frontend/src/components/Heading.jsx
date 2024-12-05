
export function Heading({label,color}) {
    return <div className={`font-bold text-4xl pt-6 text-${color}`}>
      {label}
    </div>
}