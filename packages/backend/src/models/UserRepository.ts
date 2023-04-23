import { MongoClient } from 'mongodb';
import { DBUser, DBFlow } from '../types/userRepository';
import { ATLAS } from '../common/const';

export default class UserRepo {
  client: MongoClient;
  flows: any;
  users: any;
  db: any;

  constructor() {
    this.client = new MongoClient(
      `mongodb+srv://${ATLAS.USER}:${ATLAS.PASSWORD}@propelr-dev.bvw8txe.mongodb.net/?retryWrites=true&w=majority`,
    );
    this.db = null;
    this.flows = null;
    this.users = null;
  }

  async init() {
    try {
      await this.client.connect();
      this.db = this.client.db('UserDB');
      this.flows = this.db.collection('flows');
      this.users = this.db.collection('users');
    } catch (err) {
      console.error(err);
    }
  }

  async pushUser(user: DBUser): Promise<DBUser | null> {
    try {
      await this.users.insertOne(user);
      return user;
    } catch (err) {
      return null;
    }
  }
  async deleteUserByEmail(email: string): Promise<boolean | null> {
    try {
      await this.users.deleteOne({ email, })
      return true;
    } catch (err) {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<DBUser | null> {
    try {
      const user = await this.users.findOne({ email, })
      return user;
    } catch (err) {
      return null;
    }
  }

  async getUsers(): Promise<Array<DBUser> | null> {
    try {
      const user = await this.users.find({}).toArray();
      return user;
    } catch (err) {
      return null;
    }
  }

  async pushFlow(flow: DBFlow): Promise<DBFlow | null> {
    try {
      const flw = await this.flows.insertOne(flow);
      return flw;
    } catch (err) {
      return null;
    }
  }

  async flowExists(flowid: string): Promise<boolean> {
    const flw = await this.flows.findOne({ id: flowid });
    if (flw) return true;
    return false;
  }

  async getFlowById(flowid: string): Promise<DBFlow | null>  {
    try {
      const flw = await this.flows.findOne({ id: flowid });
      return flw;
    } catch (err) {
      return null;
    }
  }

  async deleteFlowById(flowid: string): Promise<any | null> {
    try {
      const deleted = await this.flows.deleteOne({ id: flowid })
      if (deleted.deletedCount === 0) {
        return null;
      } 
      return { 
        id: flowid
      };
    } catch (err) {
      return null;
    }
  }

  async deleteFlowByUserId(userId: string): Promise<boolean | null> {
    try {
      await this.users.deleteOne({ userid: userId })
      return true;
    } catch (err) {
      return null;
    }
  }

  async getFlowsByUserId(userId: string): Promise<Array<DBFlow> | null> {
    try {
      const flows = await this.flows.find({ userid: userId }).toArray();
      return flows;
    } catch (err) {
      return null;
    }
  }

  async close() {
    await this.client.close();
  }
}

export const USER_DB = new UserRepo();
