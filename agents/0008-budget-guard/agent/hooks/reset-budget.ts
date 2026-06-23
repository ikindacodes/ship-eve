import { resetBudgetForTurn } from "#lib/budget.js";
import { defineHook } from "eve/hooks";

export default defineHook({
  events: {
    async "turn.started"() {
      resetBudgetForTurn();
    },
  },
});
