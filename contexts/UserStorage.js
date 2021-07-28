import { createLocalStorageStateHook } from "use-local-storage-state";

const useUserDetails = createLocalStorageStateHook("user", {
  account: {},
  address: {},
});

export default useUserDetails;
