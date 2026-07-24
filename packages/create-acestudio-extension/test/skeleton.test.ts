import { expect, test } from "vitest";
import { packageName } from "@timedomain/create-acestudio-extension";

test("the package skeleton is importable", () => {
  expect(packageName).toBe("@timedomain/create-acestudio-extension");
});
