export const Theme = {
    amber: '#f0b84a',
    caramel: '#b8671e',
    chestnut: '#5a2d0f',
    espresso: '#3d1f0d',
    muted: '#8b7355',
    bg: '#1a1412',
    text: '#f2ece0',
};

export const Physics = {
    puckResistance: (frame: number, durationInFrames: number) => {
        const start = 15.0; // 從 sample.html 的邏輯建議值
        const end = 6.0;
        const t = frame / durationInFrames;
        // 使用 sample.html 的 0.55 次方，提供更平滑的衰減感
        return start - (start - end) * Math.pow(t, 0.55);
    }
};
