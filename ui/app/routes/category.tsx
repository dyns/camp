import type { Route } from "./+types/home";
import { Category } from "../category/category";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Category Name here" },
    { name: "description", content: "This is a category like items to bring, or more narrowly smores items, or reservation planning, or location finding" },
  ];
}

export default function Home() {
  return <Category />;
}
