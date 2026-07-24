import { expect, test } from "vitest";
import { packageName } from "@timedomain/acestudio-bridge-core";

test("the package skeleton is importable", () => {
  expect(packageName).toBe("@timedomain/acestudio-bridge-core");
});
