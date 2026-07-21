import { createInterface } from "node:readline/promises";
import { stdin, stderr } from "node:process";

/** Interactive input for `login`. Only ever constructed on an interactive TTY. */
export interface Prompter {
  line(question: string): Promise<string>;
  choice(question: string, choices: readonly string[]): Promise<string>;
}

export function stdioPrompter(): Prompter {
  async function line(question: string): Promise<string> {
    // Prompts go to stderr so `--json` keeps stdout to a single result object.
    const rl = createInterface({ input: stdin, output: stderr });
    try {
      return (await rl.question(question)).trim();
    } finally {
      rl.close();
    }
  }
  return {
    line,
    async choice(question: string, choices: readonly string[]): Promise<string> {
      for (;;) {
        const answer = (await line(`${question} [${choices.join("/")}]: `)).toLowerCase();
        const match = choices.find((choice) => choice.toLowerCase() === answer);
        if (match !== undefined) return match;
      }
    },
  };
}
