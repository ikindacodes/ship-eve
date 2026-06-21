import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "In-scope: GitHub integration connect flow.",
  async test(t) {
    await t.send("How do I link a GitHub repo to TaskFlow?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("GitHub"));
  },
});
