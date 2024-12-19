import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import { format as prettierFormat } from "prettier/standalone";

export const format = (code: string) => {
  return prettierFormat(code.trim(), {
    parser: "babel",
    semi: true,
    singleQuote: false,
    plugins: [parserBabel, parserEstree],
  });
};
