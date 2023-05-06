import server from './server';
import { PORT } from './common/const';
import { USER_DB } from './models/UserRepository';

import { Flow, FlowState } from "./types";
import { FLOW_RUNNER } from "./models/FlowRunner";
import executeFlow from "./common/executeFlow";

async function startFlowsAfterInit() {
  let flows = await USER_DB.RAW_getFlows({});
  flows.forEach((flow: Flow) => {
    if (flow.schedule.type === "none") return;
    FLOW_RUNNER.register(flow, (f: any) => {
      executeFlow(f);
    })
    if (flow.status === FlowState.RUNNING) FLOW_RUNNER.startFlowById(flow.id);
  })
}

server.listen(PORT, async () => {
  await USER_DB.init();
  await startFlowsAfterInit();

  console.log(`listening at http://localhost:${PORT}`);
});
