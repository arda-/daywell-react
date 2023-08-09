import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";


// Create your SyncedStore store
export const store = syncedStore({ 
  displayOrder: [],
//   taskCollection: {},
});

// Get the Yjs document and sync automatically using y-webrtc
const doc = getYjsDoc(store);
export const webrtcProvider = new WebrtcProvider("syncedstore-plain", doc);

export const disconnect = () => webrtcProvider.disconnect();
export const connect = () => webrtcProvider.connect();