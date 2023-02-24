import { Args } from "../index";
import forHandle from "./for";

export default async function handle(args: Args) {
  forHandle(args, false);
}
