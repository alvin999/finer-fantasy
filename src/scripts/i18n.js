const ui = {
    'zh-TW': {
        'anim.play': '播放萃取過程',
        'anim.pause': '暫停',
        'anim.replay': '重新播放',
        'anim.ready': '準備就緒',
        'anim.done': '萃取完成 ✓',
        'char.soft': '柔和',
        'char.balanced': '均衡',
        'char.strong': '強烈',
        'note.soft': '酸明、Body 輕',
        'note.balanced': '甜酸醇平衡',
        'note.strong': '鮮明、醇厚',
        'narrative.low': '<strong>WD {wd} — 低流量</strong>：水流緩，壓力爬升慢，峰值 <em>{peak} bar</em>，高壓維持 <em>{dur} 秒</em>。風味溫和、甜感明顯，Body 較低。',
        'narrative.medium': '<strong>WD {wd} — 中等流量</strong>：曲線平衡，峰值 <em>{peak} bar</em>，高壓維持 <em>{dur} 秒</em>。甜感、酸度與醇厚度取得較佳平衡。',
        'narrative.high': '<strong>WD {wd} — 高流量</strong>：迅速追上粉餅阻力，峰值 <em>{peak} bar</em>，高壓持續 <em>{dur} 秒</em>。萃取效率高，風味鮮明強烈。',
        'narrative.vibe': ' <strong>Vibration Pump</strong> 最高可達 {maxP} bar，曲線略有震動特性。',
        'narrative.rotary': ' <strong>Rotary Pump</strong> 定壓 {maxP} bar，曲線穩定平滑。',
        'narrative.headspace': ' <br><br>較大的 <strong>Headspace ({hs}mm)</strong> 增加了注水填滿時間，形成了約 {delay} 秒的自然預浸效果，延緩了壓力爬升。',
        'legend.puck': '假想粉餅阻力',
        'legend.actual': '實際萃取壓力',
        'legend.limit': '機器上限',
        'compare.heavy': '重填壓',
        'compare.normal': '標準',
        'compare.uneven': '佈粉不均',
        'concept.wd60': 'WD 60  低流量',
        'concept.wd80': 'WD 80  基準',
        'concept.wd100': 'WD 100  高流量',
        'info.method.normal': '<strong>標準手法</strong>：WDT 佈粉 + 輕填壓，粉餅均勻，阻力曲線平滑穩定。',
        'info.method.heavy': '<strong>重填壓</strong>：粉餅結構緊密，初期阻力略高。差異不如 WD 值明顯。',
        'info.method.uneven': '<strong>佈粉不均</strong>：偏流（Channeling）導致阻力提前崩潰。',
    },
    'en': {
        'anim.play': 'Play Extraction',
        'anim.pause': 'Pause',
        'anim.replay': 'Replay',
        'anim.ready': 'Ready',
        'anim.done': 'Extraction Done ✓',
        'char.soft': 'Soft',
        'char.balanced': 'Balanced',
        'char.strong': 'Strong',
        'note.soft': 'Crisp, light body',
        'note.balanced': 'Sweet & balanced',
        'note.strong': 'Vivid, thick body',
        'narrative.low': '<strong>WD {wd} — Low Flow</strong>: Slow flow, slow pressure rise, peak <em>{peak} bar</em>, high pressure for <em>{dur}s</em>. Mild flavor, clear sweetness, lower body.',
        'narrative.medium': '<strong>WD {wd} — Medium Flow</strong>: Balanced curve, peak <em>{peak} bar</em>, high pressure for <em>{dur}s</em>. Balance of sweetness, acidity, and body.',
        'narrative.high': '<strong>WD {wd} — High Flow</strong>: Quickly hits puck resistance, peak <em>{peak} bar</em>, maintained for <em>{dur}s</em>. High efficiency, vivid and intense flavor.',
        'narrative.vibe': ' <strong>Vibration Pump</strong> reaches up to {maxP} bar, with slight vibration characteristics.',
        'narrative.rotary': ' <strong>Rotary Pump</strong> constant {maxP} bar, stable and smooth curve.',
        'narrative.headspace': ' <br><br>Larger <strong>Headspace ({hs}mm)</strong> increases fill time, creating a natural pre-infusion of ~{delay}s, delaying pressure rise.',
        'legend.puck': 'Imaginary Puck Resistance',
        'legend.actual': 'Actual Extraction Pressure',
        'legend.limit': 'Machine Limit',
        'compare.heavy': 'Heavy',
        'compare.normal': 'Normal',
        'compare.uneven': 'Uneven',
        'concept.wd60': 'WD 60 Low Flow',
        'concept.wd80': 'WD 80 Base',
        'concept.wd100': 'WD 100 High Flow',
        'info.method.normal': '<strong>Normal Method</strong>: WDT + light tamping, uniform puck, smooth and stable resistance.',
        'info.method.heavy': '<strong>Heavy Tamping</strong>: Dense structure, slightly higher initial resistance. Difference less than WD.',
        'info.method.uneven': '<strong>Uneven</strong>: Channeling causes early collapse.',
    },
    'ja': {
        'anim.play': '抽出プロセスを再生',
        'anim.pause': '一時停止',
        'anim.replay': 'もう一度再生',
        'anim.ready': '準備完了',
        'anim.done': '抽出完了 ✓',
        'char.soft': 'マイルド',
        'char.balanced': 'バランス',
        'char.strong': '力強い',
        'note.soft': '酸味が鮮やか、軽いボディ',
        'note.balanced': '甘みと酸味の調和',
        'note.strong': '鮮烈、厚みのあるボディ',
        'narrative.low': '<strong>WD {wd} — 低流量</strong>：流れが穏やかで、圧力の上昇が遅くなります。ピークは <em>{peak} bar</em>、高圧維持は <em>{dur} 秒</em>。味わいはマイルドで甘みが際立ち、ボディは控えめです。',
        'narrative.medium': '<strong>WD {wd} — 標準流量</strong>：バランスの取れた曲線です。ピークは <em>{peak} bar</em>、高圧維持は <em>{dur} 秒</em>。甘み、酸味、コクのバランスが最も良くなります。',
        'narrative.high': '<strong>WD {wd} — 高流量</strong>：パウダー抵抗に素早く追いつきます。ピークは <em>{peak} bar</em>、高圧維持は <em>{dur} 秒</em>。抽出効率が高く、鮮やかで力強い味わいになります。',
        'narrative.vibe': ' <strong>バイブレーションポンプ</strong>は最大 {maxP} barに達し、曲線にはわずかな振動特性が見られます。',
        'narrative.rotary': ' <strong>ロータリーポンプ</strong>は定壓 {maxP} barで、曲線は安定して滑らかです。',
        'narrative.headspace': ' <br><br>広い <strong>ヘッドスペース ({hs}mm)</strong> により注水完了までの時間が延び、約 {delay} 秒の自然な蒸らし効果が生まれ、圧力の上昇が遅れます。',
        'legend.puck': '仮想パウダー抵抗',
        'legend.actual': '実際の抽出圧力',
        'legend.limit': 'マシンの上限',
        'compare.heavy': '強タンピング',
        'compare.normal': '標準',
        'compare.uneven': '不均一',
        'concept.wd60': 'WD 60 低流量',
        'concept.wd80': 'WD 80 基準',
        'concept.wd100': 'WD 100 高流量',
        'info.method.normal': '<strong>標準的な手法</strong>：WDT + 軽めのタンピング。パウダーが均一で、抵抗曲線は滑らかで安定します。',
        'info.method.heavy': '<strong>強いタンピング</strong>：構造が密になり、初期抵抗がわずかに高くなります。WD値ほどの影響はありません。',
        'info.method.uneven': '<strong>均一でない</strong>：チャネリングにより、抵抗が早期に崩壊します。',
    }
};

const defaultLang = 'zh-TW';
let currentLang = defaultLang;

export function initI18n() {
    const htmlLang = document.documentElement.lang;
    if (htmlLang && ui[htmlLang]) {
        currentLang = htmlLang;
    }
}

export function t(key, params = {}) {
    let str = (ui[currentLang] && ui[currentLang][key]) || ui[defaultLang][key] || key;
    
    for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, v);
    }
    
    return str;
}
