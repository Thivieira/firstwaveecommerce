import { createLocalStorageStateHook } from "use-local-storage-state";

const useFavorites = createLocalStorageStateHook("favorites", []);

export default useFavorites;
