import { defineEval } from "eve/evals";

export default defineEval({
  description: "Greeting: no doc search for hello.",
  async test(t) {
    await t.send("Hello!");
    t.completed();
    t.notCalledTool("search_docs");
  },
});
