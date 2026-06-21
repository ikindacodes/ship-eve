import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "In-scope: project export mentions CSV from project menu.",
  async test(t) {
    await t.send("How can I export a TaskFlow project to CSV?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("CSV"));
    t.check(t.reply, includes("Export"));
  },
});
