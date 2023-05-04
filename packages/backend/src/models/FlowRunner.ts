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
    const cronStr = FlowRunner.generateCronFromSchedule(flow.schedule)
    if (!cronStr) {
      return;
    }

    this.flows[flow.id] = cron.schedule(cronStr as string, () => cb(flow), {
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
  
  public static generateCronFromSchedule(sch: Schedule): string  | null{
    const { type, dayOfWeek, dayOfMonth, time } = sch;

    if (!time) return null;

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
        return null;
    }
  }
}

export const FLOW_RUNNER = new FlowRunner();
