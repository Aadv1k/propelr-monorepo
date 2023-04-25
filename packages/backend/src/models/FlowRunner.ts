import { Schedule, Flow } from '../types';
import * as cron from 'node-cron';

export default class FlowRunner {
  flows: {
    [key: string]: cron.ScheduledTask
  };

  constructor() {
    this.flows = {};
  }

  register(flow: Flow, cb: any) {
    this.flows[flow.id] = cron.schedule(FlowRunner.generateCronFromSchedule(flow.schedule), () => cb(flow), {
      scheduled: false
    });
  }

  stopFlowById(id: string) {
    if (!this.flows[id]) {
      throw Error(`${id} is not a registered job`)
    }
    this.flows[id].stop();
  }

  startFlowById(id: string) {
    if (!this.flows[id]) {
      throw Error(`${id} is not a registered job`)
    }
    this.flows[id].start();
  }
  
  public static generateCronFromSchedule(sch: Schedule): string {
    const { type, dayOfWeek, dayOfMonth, time } = sch;
    const [hour, minute] = time.split(':');

    switch (type as string) {
      case 'once':
        return `${minute} ${hour} * * *`;
      case 'daily':
        return `${minute} ${hour} * * *`;
      case 'weekly':
        return `${minute} ${hour} * * ${dayOfWeek}`;
      case 'monthly':
        return `${minute} ${hour} ${dayOfMonth} * ${dayOfWeek ?? "*"}`;
      default:
        throw new Error(`Invalid schedule type: ${type}`);
    }
  }
}

export const FLOW_RUNNER = new FlowRunner();
