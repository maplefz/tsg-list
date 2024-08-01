import { createContext, useContext } from './vidstack-C6myozhB.js';

const mediaContext = createContext();
function useMediaContext() {
  return useContext(mediaContext);
}
function useMediaState() {
  return useMediaContext().$state;
}

export { mediaContext, useMediaContext, useMediaState };
