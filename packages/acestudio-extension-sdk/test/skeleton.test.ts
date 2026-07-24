import { expect, test } from "vitest";
import { packageName } from "@timedomain/acestudio-extension-sdk";
import { packageName as pagePackageName } from "@timedomain/acestudio-extension-sdk/page";

test("the package skeleton is importable", () => {
  expect(packageName).toBe("@timedomain/acestudio-extension-sdk");
});

test("the page subpath is importable", () => {
  expect(pagePackageName).toBe("@timedomain/acestudio-extension-sdk/page");
});
