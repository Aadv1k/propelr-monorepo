import { createContext } from "react";

type GlobalUser = [globalUser: any | null, setGlobalUser: any | null]
const ctx: GlobalUser =  [null, null];

const UserContext = createContext(ctx);
export default UserContext; 
