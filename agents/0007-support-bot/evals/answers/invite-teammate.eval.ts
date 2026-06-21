import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "In-scope: invite teammate steps cite Team settings.",
  async test(t) {
    await t.send("How do I invite a teammate to my TaskFlow workspace?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("Invite member"));
    t.check(t.reply, includes("Settings"));
  },
});
