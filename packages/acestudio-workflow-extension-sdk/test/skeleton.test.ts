import { expect, test } from "vitest";
import { defineExtension } from "@timedomain/acestudio-workflow-extension-sdk";
import { connectChannel } from "@timedomain/acestudio-workflow-extension-sdk/page";

test("the process-side entry is importable", () => {
  expect(defineExtension).toBeTypeOf("function");
});

test("the page subpath is importable on its own", () => {
  // Separately importable is the point: a page bundle reaches the channel without
  // pulling in the process side, which is Node-only.
  expect(connectChannel).toBeTypeOf("function");
});
