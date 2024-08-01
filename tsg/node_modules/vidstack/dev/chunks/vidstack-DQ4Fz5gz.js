import { createContext, useContext } from './vidstack-fG_Sx3Q9.js';

const mediaContext = createContext();
function useMediaContext() {
  return useContext(mediaContext);
}
function useMediaState() {
  return useMediaContext().$state;
}

export { mediaContext, useMediaContext, useMediaState };
