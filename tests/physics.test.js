import { puckResistance, actualPressure } from '../src/physics.js';

describe('Coffee Physics Simulation', () => {
    test('puckResistance should decrease over time', () => {
        const r0 = puckResistance(0, 'normal');
        const r30 = puckResistance(30, 'normal');
        expect(r30).toBeLessThan(r0);
    });

    test('puckResistance with heavy tamping should be higher', () => {
        const rNormal = puckResistance(5, 'normal');
        const rHeavy = puckResistance(5, 'heavy');
        expect(rHeavy).toBeGreaterThan(rNormal);
    });

    test('actualPressure should reach near max pump pressure for high WD', () => {
        const p = actualPressure(10, 100, 'normal', 'rotary');
        expect(p).toBeGreaterThan(8.5);
        expect(p).toBeLessThan(9.5);
    });

    test('actualPressure for vibe pump should have slight oscillation noise', () => {
        const p1 = actualPressure(5, 80, 'normal', 'vibe');
        const p2 = actualPressure(5.01, 80, 'normal', 'vibe');
        // Since sin(t*2.8) is noise, we check if logic is different from rotary
        const pRotary = actualPressure(5, 80, 'normal', 'rotary');
        expect(p1).not.toBe(pRotary);
    });
});
