import { createLocalStorageStateHook } from "use-local-storage-state";

const useCart = createLocalStorageStateHook("cart", []);

export default useCart;
