import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "In-scope: Pro plan price from billing docs.",
  async test(t) {
    await t.send("How much does TaskFlow Pro cost per user?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("$12"));
  },
});
