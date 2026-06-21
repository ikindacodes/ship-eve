import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Format: replies include Answer and Source sections.",
  async test(t) {
    await t.send("Where do I download TaskFlow invoices?");
    t.completed();
    t.calledTool("search_docs");
    t.check(t.reply, includes("Answer"));
    t.check(t.reply, includes("Source"));
    t.check(t.reply, includes("Invoices"));
  },
});
