/**
 * Eve surface: channels (`agent/channels/eve.ts`)
 *
 * Channels are how users reach the agent. This file defines the default HTTP
 * "eve" channel used by the dev TUI and curl clients. The filename `eve.ts`
 * registers the channel; eve wires POST /eve/v1/session to your agent loop.
 *
 * The `auth` array is evaluated in order. `localDev()` allows unsigned local
 * requests; `vercelOidc()` and `placeholderAuth()` are production scaffolds.
 * This agent does not customize route auth — it uses the same stack as siblings.
 *
 * @see node_modules/eve/docs/channels/eve.mdx
 */
import { eveChannel } from "eve/channels/eve";
import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  auth: [localDev(), vercelOidc(), placeholderAuth()],
});
