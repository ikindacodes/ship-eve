import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Smoke test: agent completes a simple support turn.",
  async test(t) {
    await t.send("How do I invite a teammate?");
    t.completed();
    t.calledTool("search_docs");
  },
});
