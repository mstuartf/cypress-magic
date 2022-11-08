import { read, utils } from "xlsx";

export const readSpreadsheet = (file: File): Promise<string[][]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      const bstr = (e.target as FileReader).result;
      const wb = read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = utils.sheet_to_json(ws, { header: 1 }) as (
        | string
        | number
      )[][];
      /* Replace empty slots with empty strings (to match CSVReader api) */
      const final = data.map((row) => {
        // Can't use a nested map as Array.map ignores empty slots
        const mapped: string[] = [];
        for (let i = 0; i < row.length; i++) {
          let val = i in row ? row[i] : "";
          if (typeof val === "number") {
            val = val.toString();
          }
          mapped.push(val);
        }
        return mapped;
      });
      resolve(final);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  });
