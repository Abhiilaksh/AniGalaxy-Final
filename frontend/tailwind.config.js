import withMT from "@material-tailwind/react/utils/withMT";
import lineClamp from "@tailwindcss/line-clamp";
import scrollbar from "tailwind-scrollbar";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [lineClamp, scrollbar],
});
