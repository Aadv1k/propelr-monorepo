export interface DBUser {
  id: string,
  email: string,
  password: string,
}

export enum DBReceivers {
  whatsapp = "whatsapp",
  gmail = "gmail",
  outlook = "outlook",
  telegram = "telegram",
  discord = "discord"
} 

export interface DBFlow {
  id: string,
  userid: string,
  query: string,
  vars: Array<string>,
  receiver?: {
    name: DBReceivers,
    country?: string,
    contactAddr: string | number, 
  }
}
