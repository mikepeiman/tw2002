import { writable } from "svelte/store"


// if(typeof window !== "undefined") {
//   galaxy = writable(localStorage.getItem("galaxy"))
// } else {
//   galaxy = writable([])
// }

const createWritableStore = (key, startValue) => {
  const { subscribe, set } = writable(startValue);
  
	return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }
      
      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}

export let galaxy = writable('galaxy', []) 