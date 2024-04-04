import { useReducer } from 'react';

export const actionTypes = {
  ACTIVATE_TIMER: 'ACTIVATE_TIMER',
  DEACTIVATE_TIMER: 'DEACTIVATE_TIMER',
  PAUSE_TIMER: 'PAUSE_TIMER',
  PLAY_RIVE: 'PLAY_RIVE',
  PAUSE_RIVE: 'PAUSE_RIVE',
  END_TIMER: 'FINAL_TIMER',
  VISIBLE: 'VISIBLE',
  HIDDEN: 'HIDDEN',
};

export const animationReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.PLAY_RIVE:
      return { ...state, loaded: true };
    case actionTypes.PAUSE_RIVE:
      return { ...state, loaded: false };
    case actionTypes.VISIBLE:
      return { ...state, visible: true };
    case actionTypes.HIDDEN:
      return { ...state, visible: false };
    case actionTypes.ACTIVATE_TIMER:
      return { ...state, playing: true, paused: false, endTimer: false };
    case actionTypes.PAUSE_TIMER:
      return { ...state, playing: false, paused: true, endTimer: false };
    case actionTypes.DEACTIVATE_TIMER:
      return { ...state, playing: false, paused: false, endTimer: false };
    case actionTypes.END_TIMER:
      return { ...state, playing: true, paused: false, endTimer: true };
    default:
      return state;
  }
};

export const useAnimationStateMachine = (initialState) => {
  const [state, dispatch] = useReducer(animationReducer, initialState);

  return { animationState: state, dispatch };
};
