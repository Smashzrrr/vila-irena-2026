import { describe, expect, it } from "vitest";
import en from "@/dictionaries/en.json";
import hr from "@/dictionaries/hr.json";
import de from "@/dictionaries/de.json";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Collect every leaf path, including array lengths, so structures must match. */
function keyPaths(value: Json, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return [
      `${prefix}[length=${value.length}]`,
      ...value.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`)),
    ];
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

describe("dictionary parity", () => {
  const enPaths = keyPaths(en as Json).sort();

  it("hr.json has exactly the same keys as en.json", () => {
    expect(keyPaths(hr as Json).sort()).toEqual(enPaths);
  });

  it("de.json has exactly the same keys as en.json", () => {
    expect(keyPaths(de as Json).sort()).toEqual(enPaths);
  });
});
