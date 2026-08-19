import { MenuItem } from "@/types";

export const mockMenuItems: MenuItem[] = [
  {
    id: "prod-1",
    name: "Grilled Mediterranean Sea Bass",
    description: "Fresh catch fillet served with charred asparagus and lemon beurre blanc.",
    price: 28.5,
    category: "Mains",
    isPopular: true,
  },
  {
    id: "prod-2",
    name: "Truffle Herb Fries",
    description: "Crisp hand-cut potatoes tossed in white truffle oil and rosemary.",
    price: 9.0,
    category: "Sides",
    isPopular: true,
  },
  {
    id: "prod-3",
    name: "Wild Mushroom Risotto",
    description: "Creamy Arborio rice with porcini mushrooms and aged parmesan.",
    price: 22.0,
    category: "Mains",
  },
  {
    id: "prod-4",
    name: "Sparkling Citrus Cooler",
    description: "House-crafted blood orange soda with fresh mint and sparkling spring water.",
    price: 6.5,
    category: "Drinks",
  },
];
