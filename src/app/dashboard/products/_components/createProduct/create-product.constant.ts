export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 500 : -500,
    opacity: 0,
  }),
};

export const colors = [
  { name: "Red", value: "red", class: "bg-red-500" },
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Green", value: "green", class: "bg-green-500" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-500" },
  { name: "Black", value: "black", class: "bg-black" },
  { name: "White", value: "white", class: "bg-white border border-gray-200" },
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Orange", value: "orange", class: "bg-orange-500" },
];
