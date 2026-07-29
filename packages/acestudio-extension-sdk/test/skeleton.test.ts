import { expect, test } from "vitest";
import { defineExtension } from "@timedomain/acestudio-extension-sdk";
import { packageName as pagePackageName } from "@timedomain/acestudio-extension-sdk/page";

test("the process-side entry is importable", () => {
  expect(defineExtension).toBeTypeOf("function");
});

test("the page subpath is importable", () => {
  // Still a skeleton: the page side of the UI channel arrives with the UI slice.
  expect(pagePackageName).toBe("@timedomain/acestudio-extension-sdk/page");
});
