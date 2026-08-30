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
    scene: '朝、窓辺に白い羽が落ちていた。その直後、大事な予定が急に変更になった。',
    prompt: 'この偶然、どっちに感じる？',
    a: 'もっといい流れへ向かうサイン',
    b: '何かに気をつけろという警告',
  },
  {
    dimension: 'fate',
    scene: '初対面なのに、「前にも会った気がする」と強く感じる人がいた。',
    prompt: 'まだ次の約束はない。どう思う？',
    a: 'ここから連絡するかで、二人の未来が変わる',
    b: '必要な縁なら、また会うようにできている',
  },
  {
    dimension: 'flow',
    scene: 'お守りをなくす、鏡が割れる、カラスが何度も鳴く。悪いサインが重なった。',
    prompt: '今の運をどう考える？',
    a: '悪い運をまとめて使った。次は上向く',
    b: '悪い気が連鎖している。断ち切る必要がある',
  },
  {
    dimension: 'agency',
    scene: '最近、部屋の空気が重い。観葉植物まで急に元気がなくなった。',
    prompt: 'まずどうする？',
    a: '掃除や塩風呂で、自分から気を入れ替える',
    b: 'いまは休む時期。自然に変わるのを待つ',
  },
  {
    dimension: 'outlook',
    scene: '最近、レシートや時計で「222」を何度も見る。',
    prompt: 'ゾロ目が伝えているのは？',
    a: 'もうすぐ、いい変化が始まる',
    b: 'いまの選択を見直した方がいい',
  },
  {
    dimension: 'fate',
    scene: '別々の占い師から、「半年後に大きな転機が来る」と同じことを言われた。',
    prompt: 'まだ予定は何もない。未来は？',
    a: 'これからの選択次第で、転機の形は変わる',
    b: '半年後に起きることは、すでに決まっている',
  },
  {
    dimension: 'flow',
    scene: '新月の夜に願いを書いた。翌日、ずっと欲しかった話が舞い込んできた。',
    prompt: 'この幸運の続きは？',
    a: '叶った分、どこかで運の帳尻が合う',
    b: 'いい波に乗った。次の幸運も呼び込む',
  },
  {
    dimension: 'agency',
    scene: '夢の中に、知らない神社の赤い鳥居が何度も出てくる。',
    prompt: 'その神社をどうする？',
    a: '場所を調べて、自分から実際に行ってみる',
    b: '必要な時に導かれるまで、いったん待つ',
  },
  {
    dimension: 'outlook',
    scene: '旅行の前夜、目的地でひとり迷子になる夢を見た。',
    prompt: '目覚めた直後、どう受け取る？',
    a: '予定外の出会いがある予感',
    b: '旅先のトラブルを知らせる予告',
  },
  {
    dimension: 'fate',
    scene: '半年後、知らない土地で暮らす自分の姿が、急にリアルに浮かんできた。',
    prompt: 'まだ何も決めていない。これは？',
    a: '行動次第で叶う、いくつかある未来の一つ',
    b: 'すでに決まっている未来を先に見た',
  },
  {
    dimension: 'flow',
    scene: '同じ神社で、三回続けて「大吉」を引いた。',
    prompt: '三回目のおみくじを見て思うのは？',
    a: 'かなり運を使った。そろそろ落ち着きそう',
    b: '強い運気に入った。この先も続きそう',
  },
  {
    dimension: 'agency',
    scene: 'どうしても叶えたい願いがある。今夜は満月。',
    prompt: '月を見ながら、どちらをする？',
    a: '願いを言葉にして、自分から未来を引き寄せる',
    b: '感謝を伝えて、叶うタイミングを天に委ねる',
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
  PBEM: { name: '幸運の錬金術師', catchphrase: 'どんな出来事も、次の幸運の材料に。', description: '未来は選び直せて、運は自分で整えられると考えるタイプ。失敗さえも前向きに再利用できる、しなやかな開運上手です。' },
  PBER: { name: '星追い旅人', catchphrase: '寄り道の先で、いい縁に出会う。', description: '未来の分岐を楽しみながら、やって来るタイミングを信じるタイプ。無理に支配せず、流れの変化を味方につけます。' },
  PBCM: { name: '開運プロデューサー', catchphrase: 'ひとつの幸運から、次の幸運を起こす。', description: '良い流れは自分の行動で大きくできると考えるタイプ。小さなチャンスを見逃さず、人生に勢いをつくります。' },
  PBCR: { name: '引き寄せ招き猫', catchphrase: '来た波に乗れば、未来はもっと面白くなる。', description: '偶然の流れを軽やかに受け取り、そのたびに未来を更新するタイプ。幸運が連鎖する瞬間を直感的につかみます。' },
  PDEM: { name: '運命の調律師', catchphrase: '決められた物語も、いい音に整えられる。', description: '大きな運命の流れを信じつつ、日々の行動でコンディションを整えるタイプ。現実感と信念のバランスが魅力です。' },
  PDER: { name: '月夜の案内人', catchphrase: '必要な幸運は、必要なときに届く。', description: '人生には意味のある流れがあり、最後にはきちんと整うと信じるタイプ。穏やかな安心感を周囲にも分け与えます。' },
  PDCM: { name: '願いの船長', catchphrase: '運命の追い風を、自分でさらに強くする。', description: '自分には進むべき道があり、良い流れは連鎖すると信じるタイプ。決めたことを現実にする推進力があります。' },
  PDCR: { name: '生まれつきスター', catchphrase: 'すべては、最高の未来につながっている。', description: '縁もタイミングも大きな物語の一部だと感じるタイプ。流れを信じる力が強く、幸運の連鎖に自然と乗っていきます。' },
  NBEM: { name: 'お守り職人', catchphrase: '悪い未来を読んで、先回りで変えていく。', description: 'リスクを見つける力と、流れを整える行動力を持つタイプ。慎重さを武器にして、未来の分岐を安全な方へ導きます。' },
  NBER: { name: '兆し探偵', catchphrase: '焦らず見極めれば、流れはまた整う。', description: '悪い兆しに早く気づきながら、運の波が戻る瞬間を待てるタイプ。静かな観察力で、無理のない道を選びます。' },
  NBCM: { name: '厄払い隊長', catchphrase: '嫌な連鎖は、自分のところで断ち切る。', description: '悪い流れを敏感に察知し、行動によって未来を変えるタイプ。危機に強く、停滞した空気を動かす突破役です。' },
  NBCR: { name: '嵐待ち黒猫', catchphrase: '流れを読めば、嵐の中にも道はある。', description: '運の連鎖と変化の兆しを鋭く読むタイプ。受け取ったサインを頼りに、危険を避けながら新しい道を探します。' },
  NDEM: { name: '運命の裁判官', catchphrase: '決まった試練にも、整え方はきっとある。', description: '避けられない出来事を受け止めつつ、自分にできる備えを重ねるタイプ。崩れたバランスを現実的に立て直します。' },
  NDER: { name: '守護騎士', catchphrase: '今は耐えるとき。流れが戻るまで静かに守る。', description: '運命の波と帳尻を信じ、慎重にタイミングを待つタイプ。軽率に動かず、大切なものを守り抜く強さがあります。' },
  NDCM: { name: '宿命ブレイカー', catchphrase: '決められた悪い流れなら、自分で打ち破る。', description: '運命の存在を感じながらも、望まない連鎖には行動で立ち向かうタイプ。強い覚悟で状況を変える反骨の人です。' },
  NDCR: { name: '深夜の占い師', catchphrase: '見えない流れを読み、来るべき時を待つ。', description: '人生の背後にある大きな筋書きと、運の連鎖を深く感じるタイプ。表面に惑わされず、静かに兆しを読み取ります。' },
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
        <div className="question-visual">
          <img
            src={`/questions/q${String(step + 1).padStart(2, '0')}.webp`}
            alt=""
            aria-hidden="true"
          />
          <span>VISION / {String(step + 1).padStart(2, '0')}</span>
        </div>
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
