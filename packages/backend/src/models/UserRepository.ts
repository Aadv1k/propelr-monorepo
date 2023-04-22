import { MongoClient } from 'mongodb';
import { DBUser, DBFlow } from '../types/userRepository';
import { ATLAS } from '../common/const';

export default class {
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
      this.users.insertOne(user);
      return user;
    } catch (err) {
      return null;
    }
  }
  async deleteUserByEmail(email: string): Promise<boolean | null> {
    try {
      this.users.deleteOne({ email, })
      return true;
    } catch (err) {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<DBUser | null> {
    try {
      const user = this.users.findOne({ email, })
      return user;
    } catch (err) {
      return null;
    }
  }

  async getUsers(): Promise<Array<DBUser> | null> {
    try {
      const user = this.users.find({})
      return user;
    } catch (err) {
      return null;
    }
  }

  async pushFlow(flow: DBFlow): Promise<DBFlow | null> {
    try {
      const flw = this.flows.insertOne(flow);
      return flw;
    } catch (err) {
      return null;
    }
  }

  async deleteFlowByUserId(userId: string): Promise<boolean | null> {
    try {
      this.users.deleteOne({ userid: userId })
      return true;
    } catch (err) {
      return null;
    }
  }

  async getFlowsByUserId(userId: string): Promise<Array<DBFlow> | null> {
    try {
      const flows = this.flows.find({ userid: userId })
      return flows;
    } catch (err) {
      return null;
    }
  }

  async close() {
    await this.client.close();
  }
}
