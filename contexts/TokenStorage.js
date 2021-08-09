import { createLocalStorageStateHook } from "use-local-storage-state";

const useToken = createLocalStorageStateHook("token", null);

export default useToken;
