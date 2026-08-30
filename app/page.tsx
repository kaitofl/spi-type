'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, Copy, RotateCcw } from 'lucide-react';

type Dimension = 'outlook' | 'fate' | 'flow' | 'agency';
type ChoiceValue = -1 | 1;

type Question = {
  dimension: Dimension;
  prompt: string;
  scene: string;
  a: string;
  b: string;
};

type AxisResult = {
  code: string;
  label: string;
  short: string;
};

type TypeResult = {
  name: string;
  catchphrase: string;
  description: string;
};

const questions: Question[] = [
  {
    dimension: 'outlook',
    scene: 'バイト先で急に「来月からSNS担当やってみない？」。やり方は自由。',
    prompt: '帰り道、頭に浮かぶのは？',
    a: 'バズったら楽しそう。まず企画を考える',
    b: '炎上やスベるパターンを先に潰したい',
  },
  {
    dimension: 'outlook',
    scene: '気になる人を誘ったら、「来週たぶん空いてる！」と返事がきた。',
    prompt: 'どっちの気持ちに近い？',
    a: '会えそう。行きたい場所を探しはじめる',
    b: 'まだ未確定。流れる可能性も考えておく',
  },
  {
    dimension: 'outlook',
    scene: '春から知らない街でひとり暮らし。現地の友達はゼロ。',
    prompt: '引っ越し前、強いのは？',
    a: '新しい出会いと生活へのワクワク',
    b: '街や人に馴染めるかという不安',
  },
  {
    dimension: 'fate',
    scene: '今週末、友達の友達ばかりのイベントへ行くことになった。',
    prompt: '運命の人がそこにいるとしたら？',
    a: '誰に話しかけるかで、未来が変わる',
    b: '縁があるなら、自然と会う流れになる',
  },
  {
    dimension: 'fate',
    scene: 'やりたいけど不安定な道と、安心だけど少し退屈な道。明日までに決める。',
    prompt: '選んだ先の未来は？',
    a: '選択次第で、まったく別の人生になる',
    b: 'どっちを選んでも、行くべき場所へ着く',
  },
  {
    dimension: 'fate',
    scene: '恋人から「一緒に海外ワーホリ行かない？」。答えはまだ出ていない。',
    prompt: 'これからの未来をどう思う？',
    a: 'この返事で、人生のルートが分かれる',
    b: '答えも含めて、進むルートは決まっている',
  },
  {
    dimension: 'flow',
    scene: 'スマホを割る、推しのライブに落選、バイトでもミス。同じ週に全部きた。',
    prompt: '今の運、どうなってる？',
    a: 'ここまで悪いなら、そろそろ揺り戻す',
    b: 'この空気を変えないと、まだ続きそう',
  },
  {
    dimension: 'flow',
    scene: '推しのライブで神席を引き、その翌日に自分の投稿がバズった。',
    prompt: '二連続の幸運、どう感じる？',
    a: '運を使いすぎた。反動がちょっと怖い',
    b: 'いま完全に波がきてる。この先もいけそう',
  },
  {
    dimension: 'flow',
    scene: '投稿が三本連続で伸びて、フォロワーも一気に増えている。',
    prompt: '次の投稿はどうなりそう？',
    a: 'そろそろ数字は落ち着きそう',
    b: 'この流れで、次もさらに伸びそう',
  },
  {
    dimension: 'agency',
    scene: '最近、恋愛もバイトも空回り。なんとなく全部うまくいかない。',
    prompt: '休みの日、どうする？',
    a: '部屋や髪型を変えて、新しい場所へ行く',
    b: 'いまは無理せず、流れが変わるまで休む',
  },
  {
    dimension: 'agency',
    scene: 'どうしても行きたい推しのライブが完売。公式の追加販売もなさそう。',
    prompt: 'あなたならどうする？',
    a: '譲り先やキャンセル枠を自分で探す',
    b: '縁があればチケットが巡ってくると待つ',
  },
  {
    dimension: 'agency',
    scene: '気になるクリエイターチームがあるけど、いまはメンバーを募集していない。',
    prompt: 'それでも入りたいなら？',
    a: '自分からDMして、できることを伝える',
    b: '募集や声がかかるタイミングを待つ',
  },
];

const axisDefinitions: Record<Dimension, { positive: AxisResult; negative: AxisResult }> = {
  outlook: {
    positive: { code: 'P', label: 'ポジティブ', short: '出来事の先に、良い可能性を見つける' },
    negative: { code: 'N', label: 'ネガティブ', short: '悪い可能性を先読みし、自分を守る' },
  },
  fate: {
    positive: { code: 'B', label: '分岐', short: '選択や出来事によって、未来は変わる' },
    negative: { code: 'D', label: '既定', short: '起きることには、決められた流れがある' },
  },
  flow: {
    positive: { code: 'E', label: '帳尻', short: '運は上がり下がりしながら釣り合う' },
    negative: { code: 'C', label: '連鎖', short: '良い流れも悪い流れも、勢いで続いていく' },
  },
  agency: {
    positive: { code: 'M', label: '開運', short: '行動によって、自分で運を動かせる' },
    negative: { code: 'R', label: '受運', short: '運はタイミングや縁として届けられる' },
  },
};

const typeResults: Record<string, TypeResult> = {
  PBEM: { name: '未来錬金術師', catchphrase: 'どんな出来事も、次の幸運の材料に。', description: '未来は選び直せて、運は自分で整えられると考えるタイプ。失敗さえも前向きに再利用できる、しなやかな開運上手です。' },
  PBER: { name: 'ラッキートリッパー', catchphrase: '寄り道の先で、いい縁に出会う。', description: '未来の分岐を楽しみながら、やって来るタイミングを信じるタイプ。無理に支配せず、流れの変化を味方につけます。' },
  PBCM: { name: '上昇気流メーカー', catchphrase: 'ひとつの幸運から、次の幸運を起こす。', description: '良い流れは自分の行動で大きくできると考えるタイプ。小さなチャンスを見逃さず、人生に勢いをつくります。' },
  PBCR: { name: 'シンクロサーファー', catchphrase: '来た波に乗れば、未来はもっと面白くなる。', description: '偶然の流れを軽やかに受け取り、そのたびに未来を更新するタイプ。幸運が連鎖する瞬間を直感的につかみます。' },
  PDEM: { name: '運命チューナー', catchphrase: '決められた物語も、いい音に整えられる。', description: '大きな運命の流れを信じつつ、日々の行動でコンディションを整えるタイプ。現実感と信念のバランスが魅力です。' },
  PDER: { name: '祝福の案内人', catchphrase: '必要な幸運は、必要なときに届く。', description: '人生には意味のある流れがあり、最後にはきちんと整うと信じるタイプ。穏やかな安心感を周囲にも分け与えます。' },
  PDCM: { name: 'コメットスター', catchphrase: '運命の追い風を、自分でさらに強くする。', description: '自分には進むべき道があり、良い流れは連鎖すると信じるタイプ。決めたことを現実にする推進力があります。' },
  PDCR: { name: '天命ドリーマー', catchphrase: 'すべては、最高の未来につながっている。', description: '縁もタイミングも大きな物語の一部だと感じるタイプ。流れを信じる力が強く、幸運の連鎖に自然と乗っていきます。' },
  NBEM: { name: '厄除けストラテジスト', catchphrase: '悪い未来を読んで、先回りで変えていく。', description: 'リスクを見つける力と、流れを整える行動力を持つタイプ。慎重さを武器にして、未来の分岐を安全な方へ導きます。' },
  NBER: { name: '兆しウォッチャー', catchphrase: '焦らず見極めれば、流れはまた整う。', description: '悪い兆しに早く気づきながら、運の波が戻る瞬間を待てるタイプ。静かな観察力で、無理のない道を選びます。' },
  NBCM: { name: '悪運ブレイカー', catchphrase: '嫌な連鎖は、自分のところで断ち切る。', description: '悪い流れを敏感に察知し、行動によって未来を変えるタイプ。危機に強く、停滞した空気を動かす突破役です。' },
  NBCR: { name: '嵐読みナビゲーター', catchphrase: '流れを読めば、嵐の中にも道はある。', description: '運の連鎖と変化の兆しを鋭く読むタイプ。受け取ったサインを頼りに、危険を避けながら新しい道を探します。' },
  NDEM: { name: '宿命バランサー', catchphrase: '決まった試練にも、整え方はきっとある。', description: '避けられない出来事を受け止めつつ、自分にできる備えを重ねるタイプ。崩れたバランスを現実的に立て直します。' },
  NDER: { name: '月影ガーディアン', catchphrase: '今は耐えるとき。流れが戻るまで静かに守る。', description: '運命の波と帳尻を信じ、慎重にタイミングを待つタイプ。軽率に動かず、大切なものを守り抜く強さがあります。' },
  NDCM: { name: '運命反逆ナイト', catchphrase: '決められた悪い流れなら、自分で打ち破る。', description: '運命の存在を感じながらも、望まない連鎖には行動で立ち向かうタイプ。強い覚悟で状況を変える反骨の人です。' },
  NDCR: { name: '深淵オラクル', catchphrase: '見えない流れを読み、来るべき時を待つ。', description: '人生の背後にある大きな筋書きと、運の連鎖を深く感じるタイプ。表面に惑わされず、静かに兆しを読み取ります。' },
};

const dimensionOrder: Dimension[] = ['outlook', 'fate', 'flow', 'agency'];
const typeEntries = Object.entries(typeResults);

function MysticSigil({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? 'mystic-sigil compact' : 'mystic-sigil'} viewBox="0 0 640 640" aria-hidden="true">
      <defs>
        <linearGradient id="sigil-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c7ff45" />
          <stop offset=".48" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#4de7ff" />
        </linearGradient>
      </defs>
      <circle cx="320" cy="320" r="244" />
      <circle cx="320" cy="320" r="174" />
      <circle cx="320" cy="320" r="76" />
      <path d="M320 42 391 248 604 320 391 392 320 598 249 392 36 320 249 248Z" />
      <path className="sigil-accent" d="m320 170 42 108 108 42-108 42-42 108-42-108-108-42 108-42Z" />
      <path d="M111 190c115 32 303 32 418 0M111 450c115-32 303-32 418 0" />
      <g className="sigil-dots">
        <circle cx="320" cy="76" r="5" /><circle cx="564" cy="320" r="5" />
        <circle cx="320" cy="564" r="5" /><circle cx="76" cy="320" r="5" />
      </g>
    </svg>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ChoiceValue[]>([]);
  const [copied, setCopied] = useState(false);

  const completed = answers.length === questions.length;
  const result = useMemo(() => {
    if (!completed) return null;

    const scores: Record<Dimension, number> = { outlook: 0, fate: 0, flow: 0, agency: 0 };
    questions.forEach((question, index) => { scores[question.dimension] += answers[index]; });

    const axes = dimensionOrder.map((dimension) =>
      scores[dimension] > 0 ? axisDefinitions[dimension].positive : axisDefinitions[dimension].negative,
    );
    const code = axes.map((axis) => axis.code).join('');
    return { code, axes, ...typeResults[code] };
  }, [answers, completed]);

  function answer(value: ChoiceValue) {
    const next = [...answers.slice(0, step), value];
    setAnswers(next);
    setStep(step + 1);
  }

  function goBack() {
    if (step === 0) {
      setStarted(false);
      return;
    }
    setStep(step - 1);
    setAnswers(answers.slice(0, step - 1));
  }

  function restart() {
    setStarted(false);
    setStep(0);
    setAnswers([]);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function shareResult() {
    if (!result) return;
    const text = `私のスピタイプは「${result.name}」でした。\n${result.catchphrase}\n#スピタイプ診断`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'スピタイプ診断', text, url: window.location.href });
        return;
      } catch {
        // Sharing was cancelled, so leave the result as-is.
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (!started) {
    return (
      <main className="landing-shell">
        <header className="site-header">
          <a href="#top" className="brand" aria-label="スピタイプ診断 トップへ">
            <span className="brand-mark">S↗</span>
            <span>SPIRIT<br />TYPE</span>
          </a>
          <span className="header-note">運命の信じ方を<br />キャラ化する診断</span>
        </header>

        <section className="hero" id="top">
          <div className="hero-sigil"><MysticSigil /></div>
          <div className="hero-stamp" aria-hidden="true">16<br /><small>ARCHETYPES</small></div>
          <div className="hero-content">
            <p className="kicker">YOUR FATE HAS A VIBE</p>
            <h1>あなたの運命、<br /><em>どのキャラ？</em></h1>
            <p className="hero-copy">恋愛、推し、バイト、偶然。12問で“運の信じ方”を16タイプに。</p>
            <button className="primary-button" type="button" onClick={() => setStarted(true)}>
              自分のキャラを召喚する <ArrowRight aria-hidden="true" />
            </button>
            <span className="time-note">12 QUESTIONS / 2 MIN / FREE</span>
          </div>
        </section>

        <section className="axis-preview" aria-label="診断する4つの軸">
          <p className="kicker dark">WHAT MAKES YOUR TYPE?</p>
          <h2>未来の読み方は、<br /><em>4つでできてる。</em></h2>
          <div className="preview-list">
            <div><span>01 / MOOD</span><strong>ポジティブ</strong><i>VS</i><strong>ネガティブ</strong></div>
            <div><span>02 / FATE</span><strong>分岐</strong><i>VS</i><strong>既定</strong></div>
            <div><span>03 / FLOW</span><strong>帳尻</strong><i>VS</i><strong>連鎖</strong></div>
            <div><span>04 / POWER</span><strong>開運</strong><i>VS</i><strong>受運</strong></div>
          </div>
        </section>

        <section className="type-teaser">
          <div className="teaser-heading">
            <p className="kicker">16 FATE CHARACTERS</p>
            <h2>誰が、<br />出る？</h2>
            <p>全16体。答え終わるまで、自分のキャラはわからない。</p>
          </div>
          <div className="character-grid">
            {typeEntries.map(([code, type]) => (
              <div className="character-tile" key={code}>
                <img src={`/types/${code}.png`} alt="" loading="lazy" />
                <span>{code}</span>
                <strong>{type.name}</strong>
              </div>
            ))}
          </div>
          <button className="summon-button" type="button" onClick={() => { setStarted(true); window.scrollTo({ top: 0 }); }}>
            診断してキャラを見る <ArrowRight aria-hidden="true" />
          </button>
        </section>

        <footer><strong>SPIRIT TYPE</strong><span>信じ方に、正解もハズレもない。</span></footer>
      </main>
    );
  }

  if (result) {
    return (
      <main className="result-shell">
        <header className="quiz-header">
          <span className="brand"><span className="brand-mark">S↗</span>SPIRIT TYPE</span>
          <span>SUMMONED</span>
        </header>

        <section className="result-hero">
          <div className="result-sigil"><MysticSigil /></div>
          <div className="result-character">
            <img src={`/types/${result.code}.png`} alt={result.name} />
          </div>
          <p className="result-eyebrow">YOUR FATE CHARACTER</p>
          <div className="type-code">TYPE / {result.code}</div>
          <h1>{result.name}</h1>
          <p className="result-catch">{result.catchphrase}</p>
        </section>

        <section className="result-detail">
          <span className="detail-label">CHARACTER PROFILE</span>
          <p className="result-description">{result.description}</p>
          <div className="result-axes">
            {result.axes.map((axis, index) => (
              <div key={axis.code}>
                <span>0{index + 1}</span>
                <strong>{axis.label}</strong>
                <p>{axis.short}</p>
              </div>
            ))}
          </div>
          <button className="share-button" type="button" onClick={shareResult}>
            <Copy aria-hidden="true" />{copied ? 'コピーしました' : '結果をシェアする'}
          </button>
          <button className="restart-button" type="button" onClick={restart}>
            <RotateCcw aria-hidden="true" />もう一度診断する
          </button>
        </section>
      </main>
    );
  }

  const question = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <main className="quiz-shell">
      <div className="quiz-sigil"><MysticSigil compact /></div>
      <header className="quiz-header">
        <button type="button" className="back-button" onClick={goBack} aria-label="前へ戻る"><ChevronLeft /></button>
        <span className="brand"><span className="brand-mark">S↗</span>SPIRIT TYPE</span>
        <span>{String(step + 1).padStart(2, '0')} / {questions.length}</span>
      </header>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

      <section className="question-stage" key={step}>
        <div className="question-copy">
          <span className="question-number">Q.{String(step + 1).padStart(2, '0')} / FOLLOW YOUR VIBE</span>
          <h1>{question.scene}</h1>
          <p className="question-prompt">{question.prompt}</p>
        </div>
        <div className="answer-list">
          <button type="button" onClick={() => answer(1)}>
            <span>A</span><strong>{question.a}</strong><ArrowRight aria-hidden="true" />
          </button>
          <button type="button" onClick={() => answer(-1)}>
            <span>B</span><strong>{question.b}</strong><ArrowRight aria-hidden="true" />
          </button>
        </div>
        <p className="answer-note">考えすぎず、直感に近い方を選んでください。</p>
      </section>
    </main>
  );
}
