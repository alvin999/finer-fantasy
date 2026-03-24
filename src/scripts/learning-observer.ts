import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
    drawPuckCurve, 
    drawWDChart, 
    drawDurChart, 
    drawHSChart, 
    drawABChart 
} from "./learning-utils";

// 我們需要一種方式在客戶端獲取翻譯，或者直接傳遞 labels
export const setupLearningObserver = (labels?: string[]) => {
    gsap.registerPlugin(ScrollTrigger);

    // ── PROGRESS ──
    const handleScroll = () => {
        const progEl = document.getElementById("prog");
        if (progEl) {
            const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progEl.style.width = pct + "%";
        }
        
        const sections = document.querySelectorAll("section");
        sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                document.querySelectorAll(".dot").forEach((d) => d.classList.remove("active"));
                const dots = document.querySelectorAll(".dot");
                if (dots[i]) dots[i].classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", handleScroll);

    document.querySelectorAll(".dot").forEach((d) => {
        d.addEventListener("click", () => {
            const target = (d as HTMLElement).dataset.target;
            if (target) document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
        });
    });

    // ── GSAP ANIMATIONS ──
    // Hero Reveal
    gsap.to(".kicker, .hero-h, .hero-sub, .scroll-arrow", { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        stagger: 0.15, 
        ease: "power3.out" 
    });

    const heroTl = gsap.timeline({ 
        scrollTrigger: { 
            trigger: "#hero", 
            start: "top top", 
            end: "bottom top", 
            scrub: 1, 
            onRefresh: (self) => { 
                if (self.progress === 0) gsap.set(".hero-h, .hero-sub, .kicker, .scroll-arrow", { opacity: 1, y: 0 }); 
            }
        }
    });
    heroTl.to(".hero-h", { y: -100, opacity: 0, scale: 0.9 }, 0);
    heroTl.to(".hero-sub, .kicker, .scroll-arrow", { y: -50, opacity: 0 }, 0.2);
    heroTl.to(".hero-ring", { scale: 1.5, opacity: 0, stagger: 0.1 }, 0);

    // Section Specific Animations
    const sections = [
        { id: "#s1", viz: (p: number) => { const pl = (window as any).remotionGauge; if (pl) pl.seekTo(Math.round(p * 300)); }},
        { id: "#s2", viz: (p: number) => { 
            gsap.set(".wdrop", { y: p * 60, opacity: p < 0.8 ? 0.6 : 0 });
            gsap.set(".cdrip", { y: Math.max(0, (p - 0.4) * 30), opacity: p > 0.4 ? 0.7 : 0 });
            gsap.set("#cup-fill", { height: p * 40, y: -p * 25 });
            
            const stop2Offset = Math.min(100, p * 150); 
            gsap.set("#stop2", { attr: { offset: `${stop2Offset}%` } });
            gsap.set("#stop1", { attr: { offset: `${Math.max(0, stop2Offset - 20)}%` } });

            const puckColor = gsap.utils.interpolate("#4a250d", "#6d3a1a", p);
            gsap.set("#stop3", { attr: { "stop-color": puckColor } });

            const arrowOpacity = 0.7 * (1 - p * 0.5);
            const arrowGlow = Math.max(0, 2 * (1 - p));
            gsap.set("#resist-arrows line", { 
                strokeOpacity: arrowOpacity,
                scaleY: 1 - p * 0.3,
                transformOrigin: "center bottom"
            });
            gsap.set("#glow feGaussianBlur", { attr: { stdDeviation: arrowGlow } });
        }},
        { id: "#s3", viz: (p: number) => drawPuckCurve(p) },
        { id: "#s4", viz: (p: number) => drawWDChart(p) },
        { id: "#s5", viz: (p: number) => drawDurChart(p) },
        { id: "#s6", viz: (p: number) => { gsap.set("#wd-hi-fill", { scaleY: p }); gsap.set("#wd-lo-fill", { scaleY: p * 0.8 }); }},
        { id: "#s6b", viz: (p: number) => drawHSChart(p) },
        { id: "#s7", viz: (p: number) => { 
            gsap.set("#tamp-h-curve, #tamp-l-curve", { strokeDashoffset: 200 * (1 - p) });
        }},
        { id: "#s8", viz: (p: number) => drawABChart(p, labels) }
    ];

    sections.forEach(s => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: s.id, start: "top 85%", end: "top 15%", scrub: 1 }});
        tl.to(`${s.id} .tag`, { opacity: 1, x: 0 }, 0.1);
        tl.to(`${s.id} .line`, { opacity: 1, scaleX: 1 }, 0.2);
        tl.to(`${s.id} .big-text`, { opacity: 1, y: 0 }, 0.3);
        if (document.querySelector(`${s.id} .sub-text`))
            tl.to(`${s.id} .sub-text`, { opacity: 1, y: 0 }, 0.4);
        tl.to({}, { onUpdate: function() { s.viz(this.progress()); }, duration: 1 }, 0);
    });

    // Ending Reveal
    gsap.to(".end-title, .end-sub, .end-rule", { 
        scrollTrigger: { trigger: "#ending", start: "top 85%", end: "top 40%", scrub: 1 }, 
        opacity: 1, 
        y: 0 
    });
};
