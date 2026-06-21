import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "In-scope: SSO limited to Enterprise plan.",
  async test(t) {
    await t.send("Does TaskFlow support SAML SSO on the Pro plan?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("Enterprise"));
  },
});
