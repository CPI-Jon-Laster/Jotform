# AGENT INSTRUCTIONS

This repository contains a Pipedream-style workflow for uploading resumes to JobDiva using JotForm submissions. Each step in the workflow lives in its own directory with an `entry.js` file, and the overall order is defined in `workflow.yaml`.

## Development Guidelines

* **Keep the existing file and folder structure.** When adding new steps, create a new subdirectory with its own `entry.js` and update `workflow.yaml` accordingly.
* **Write modular code.** Each step should be self-contained and export its logic via `defineComponent` as shown in the current scripts. Avoid tightly coupling steps together.
* **Use Node.js ES6 syntax**, matching the style of the current code base (e.g., `import`/`export`, async/await, environment variables for secrets).
* **Do not rename or move existing files** unless absolutely necessary.
* **Document environment variables** and any setup steps in `README.md` when needed.
* **Keep commit messages short and focused.**

There are no automated tests yet, so no test commands are required. Ensure that any new code fits within this structure and maintains modularity.
