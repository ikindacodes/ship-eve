import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "In-scope: Slack integration path from integrations docs.",
  async test(t) {
    await t.send("How do I connect Slack to TaskFlow?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("Integrations"));
    t.check(t.reply, includes("Slack"));
  },
});
