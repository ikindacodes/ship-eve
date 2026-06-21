import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "In-scope: Free plan seat and project limits.",
  async test(t) {
    await t.send("What are the limits on the TaskFlow Free plan?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("3"));
    t.check(t.reply, includes("5"));
  },
});
