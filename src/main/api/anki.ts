import { getAnkiConnectVersion } from "../anki/ankiConnect";
import { toResult } from "./helper";

export async function isConnected(): Promise<boolean>{
    const res = await toResult( ()=> getAnkiConnectVersion() )
    return res.ok;
}