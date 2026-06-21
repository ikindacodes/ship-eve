import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Out-of-scope: refuses third-party AWS refund request.",
  async test(t) {
    await t.send("Can you refund my AWS bill from last month?");
    t.completed();
    t.check(t.reply, includes("TaskFlow"));
    t.messageIncludes(/don't|does not|cannot|can't|outside|not able/i);
  },
});
