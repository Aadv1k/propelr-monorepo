import { MongoClient } from "mongodb";
import { DBUser, DBFlow } from "../types/userRepository";

export default class {
  client: MongoClient;
  flows: any;
  users: any;
  db: any;

  constructor() {
    this.client = new MongoClient("");
    this.db = null;
    this.flows = null;
    this.users = null;
  }

  async init() {
    try {
      await this.client.connect();
      this.db = this.client.db("UserDB");
      this.flows = this.db.collection("flows");
      this.users = this.db.collection("users");
    } catch (err) {
      console.error(err);
    }
  }

  async pushUser(user: DBUser): Promise<DBUser | null> { /* TODO */ return null; };
  async deleteUserByEmail(email: string): Promise<DBUser | null> { /* TODO */ return null; };
  async getUserByEmail(email: string): Promise<DBUser | null> { /* TODO */ return null; };

  async pushFlow(flow: DBFlow): Promise<DBFlow | null> { /* TODO */ return null; };
  async deleteFlowByUserId(userId: string): Promise<DBFlow | null> { /* TODO */ return null; };
  async getFlowByUserId(userId: string): Promise<DBFlow | null> { /* TODO */ return null; };
}
