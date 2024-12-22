
export function InputBox({label, placeholder, onChange,color,type}) {
    return <div>
      <div className={`text-sm font-medium text-left py-2 text- ${color}`}>
        {label}
      </div>
      <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border-2 rounded-lg border-slate-500 text-black" type={type} />
    </div>
}