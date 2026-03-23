// 應用程式全局狀態管理
export const state = {
    currentWD: 80,
    currentMethod: 'normal',
    currentMachine: 'rotary',
    synessoMethod: 'normal',
    animFrame: null,
    animProgress: 0,
    isPlaying: false,
    headspace: 2.0,
    syn: { p1: 4, p24: 6, p3: 9 }
};

export const PUMP_MAX = { rotary: 9, vibe: 12 };
export const TOTAL_TIME = 30;
export const N = 300;
export const STAGE_DUR = [0.15, 0.18, 0.42, 0.25]; // preinfusion, ramp-up, peak, ramp-down
