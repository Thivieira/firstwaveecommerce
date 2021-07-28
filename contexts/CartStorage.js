import { createLocalStorageStateHook } from "use-local-storage-state";

const useCart = createLocalStorageStateHook("cart", { cart: [], total: 0 });

export default useCart;
