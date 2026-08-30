'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, Copy, RotateCcw, Sparkles } from 'lucide-react';

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
    scene: '初めて任された大きな仕事。締切は一か月後で、進め方は自由と言われた。',
    prompt: '帰宅中、頭を占めているのは？',
    a: 'うまくやれたら、一気に成長できそう',
    b: '失敗しそうな場面を、先に洗い出したい',
  },
  {
    dimension: 'outlook',
    scene: '気になる人を初デートに誘ったら、「その日、たぶん行ける！」と返事が来た。',
    prompt: '当日まで、どちらの気持ちに近い？',
    a: 'きっと会える。行きたい場所を考える',
    b: 'まだ未確定。キャンセルも想定しておく',
  },
  {
    dimension: 'outlook',
    scene: '住んだことのない街への転勤が決まった。現地に知り合いは一人もいない。',
    prompt: '引っ越し前に強く感じるのは？',
    a: 'どんな出会いや生活になるか楽しみ',
    b: '環境が合わなかったときのことが心配',
  },
  {
    dimension: 'fate',
    scene: '来週、友達に誘われて、普段なら行かない交流会へ参加することになった。',
    prompt: 'そこで大切な人に出会うとしたら？',
    a: '誰に話しかけるかで、未来が分かれる',
    b: '会うべき人なら、自然と出会うことになる',
  },
  {
    dimension: 'fate',
    scene: 'やりたい仕事の会社と、安定した会社。二社から内定をもらい、明日までに選ぶ。',
    prompt: '選んだあとの未来をどう考える？',
    a: 'どちらを選ぶかで、別の未来になる',
    b: 'どちらを選んでも、本来の道へたどり着く',
  },
  {
    dimension: 'fate',
    scene: '長く付き合っている恋人から、「一緒に海外で暮らさない？」と提案された。',
    prompt: '返事を決める前、未来をどう思う？',
    a: 'この返事で、人生の道が大きく分かれる',
    b: '返事も含めて、進む道はすでに決まっている',
  },
  {
    dimension: 'flow',
    scene: '同じ週に財布を落とし、スマホも壊れ、仕事でもミスをした。',
    prompt: '週末に思うのは？',
    a: 'そろそろ良いことが来て釣り合う',
    b: '流れを変えない限り、悪い方へ続く',
  },
  {
    dimension: 'flow',
    scene: '抽選で旅行券が当たり、翌日には仕事で大きなチャンスが来た。',
    prompt: '二つの幸運をどう感じる？',
    a: '運を使いすぎた。反動がありそう',
    b: 'いい運が、次のいい運を呼んでいる',
  },
  {
    dimension: 'flow',
    scene: '三か月連続で仕事がうまくいき、周りからも評価されている。',
    prompt: 'この先をどう予想する？',
    a: 'そろそろ勢いは落ち着きそう',
    b: 'この勢いで、さらにうまくいきそう',
  },
  {
    dimension: 'agency',
    scene: '最近、仕事も恋愛も空回り。何をしてもうまくいかない。',
    prompt: '次の休日、どう過ごす？',
    a: '部屋を片づけ、新しい場所へ出かける',
    b: '無理に動かず、流れが変わるのを待つ',
  },
  {
    dimension: 'agency',
    scene: 'ずっと行きたかったライブが完売。公式の追加販売もなさそう。',
    prompt: 'あなたならどうする？',
    a: '譲り先やキャンセル枠を自分で探す',
    b: '縁があればチケットが巡ってくると待つ',
  },
  {
    dimension: 'agency',
    scene: '転職したいけれど、求人サイトにピンとくる会社が一つもない。',
    prompt: '次に取りそうな行動は？',
    a: '気になる会社へ、自分から連絡してみる',
    b: '自分に合う話が来るタイミングを待つ',
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
  PBER: { name: '幸運の旅人', catchphrase: '寄り道の先で、いい縁に出会う。', description: '未来の分岐を楽しみながら、やって来るタイミングを信じるタイプ。無理に支配せず、流れの変化を味方につけます。' },
  PBCM: { name: '上昇気流メーカー', catchphrase: 'ひとつの幸運から、次の幸運を起こす。', description: '良い流れは自分の行動で大きくできると考えるタイプ。小さなチャンスを見逃さず、人生に勢いをつくります。' },
  PBCR: { name: 'シンクロサーファー', catchphrase: '来た波に乗れば、未来はもっと面白くなる。', description: '偶然の流れを軽やかに受け取り、そのたびに未来を更新するタイプ。幸運が連鎖する瞬間を直感的につかみます。' },
  PDEM: { name: '運命チューナー', catchphrase: '決められた物語も、いい音に整えられる。', description: '大きな運命の流れを信じつつ、日々の行動でコンディションを整えるタイプ。現実感と信念のバランスが魅力です。' },
  PDER: { name: '祝福の案内人', catchphrase: '必要な幸運は、必要なときに届く。', description: '人生には意味のある流れがあり、最後にはきちんと整うと信じるタイプ。穏やかな安心感を周囲にも分け与えます。' },
  PDCM: { name: '約束されたスター', catchphrase: '運命の追い風を、自分でさらに強くする。', description: '自分には進むべき道があり、良い流れは連鎖すると信じるタイプ。決めたことを現実にする推進力があります。' },
  PDCR: { name: '天命ドリーマー', catchphrase: 'すべては、最高の未来につながっている。', description: '縁もタイミングも大きな物語の一部だと感じるタイプ。流れを信じる力が強く、幸運の連鎖に自然と乗っていきます。' },
  NBEM: { name: '厄除け戦略家', catchphrase: '悪い未来を読んで、先回りで変えていく。', description: 'リスクを見つける力と、流れを整える行動力を持つタイプ。慎重さを武器にして、未来の分岐を安全な方へ導きます。' },
  NBER: { name: '兆しの観測者', catchphrase: '焦らず見極めれば、流れはまた整う。', description: '悪い兆しに早く気づきながら、運の波が戻る瞬間を待てるタイプ。静かな観察力で、無理のない道を選びます。' },
  NBCM: { name: '悪運ブレイカー', catchphrase: '嫌な連鎖は、自分のところで断ち切る。', description: '悪い流れを敏感に察知し、行動によって未来を変えるタイプ。危機に強く、停滞した空気を動かす突破役です。' },
  NBCR: { name: '嵐読みナビゲーター', catchphrase: '流れを読めば、嵐の中にも道はある。', description: '運の連鎖と変化の兆しを鋭く読むタイプ。受け取ったサインを頼りに、危険を避けながら新しい道を探します。' },
  NDEM: { name: '宿命リバランサー', catchphrase: '決まった試練にも、整え方はきっとある。', description: '避けられない出来事を受け止めつつ、自分にできる備えを重ねるタイプ。崩れたバランスを現実的に立て直します。' },
  NDER: { name: '静寂の守護者', catchphrase: '今は耐えるとき。流れが戻るまで静かに守る。', description: '運命の波と帳尻を信じ、慎重にタイミングを待つタイプ。軽率に動かず、大切なものを守り抜く強さがあります。' },
  NDCM: { name: '運命に抗う騎士', catchphrase: '決められた悪い流れなら、自分で打ち破る。', description: '運命の存在を感じながらも、望まない連鎖には行動で立ち向かうタイプ。強い覚悟で状況を変える反骨の人です。' },
  NDCR: { name: '深淵のオラクル', catchphrase: '見えない流れを読み、来るべき時を待つ。', description: '人生の背後にある大きな筋書きと、運の連鎖を深く感じるタイプ。表面に惑わされず、静かに兆しを読み取ります。' },
};

const dimensionOrder: Dimension[] = ['outlook', 'fate', 'flow', 'agency'];

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
            <Sparkles aria-hidden="true" />
            <span>スピタイプ診断</span>
          </a>
          <span className="header-note">16 SPIRITUAL TYPES</span>
        </header>

        <section className="hero" id="top">
          <div className="orb" aria-hidden="true"><span /></div>
          <div className="hero-content">
            <p className="kicker">12 QUESTIONS · 16 TYPES</p>
            <h1>運命を、<br />どう信じてる？</h1>
            <p className="hero-copy">運・偶然・未来の捉え方から、あなたの「スピタイプ」を診断します。</p>
            <button className="primary-button" type="button" onClick={() => setStarted(true)}>
              診断をはじめる <ArrowRight aria-hidden="true" />
            </button>
            <span className="time-note">全12問・約2分</span>
          </div>
        </section>

        <section className="axis-preview" aria-label="診断する4つの軸">
          <p className="kicker dark">FOUR AXES</p>
          <h2>4つの運命観から、<br />あなたを読み解く。</h2>
          <div className="preview-list">
            <div><span>01</span><strong>ポジティブ</strong><i>↔</i><strong>ネガティブ</strong></div>
            <div><span>02</span><strong>分岐</strong><i>↔</i><strong>既定</strong></div>
            <div><span>03</span><strong>帳尻</strong><i>↔</i><strong>連鎖</strong></div>
            <div><span>04</span><strong>開運</strong><i>↔</i><strong>受運</strong></div>
          </div>
        </section>

        <footer><strong>スピタイプ診断</strong><span>正解ではなく、あなたの感じ方を選んでください。</span></footer>
      </main>
    );
  }

  if (result) {
    return (
      <main className="result-shell">
        <header className="quiz-header">
          <span className="brand"><Sparkles aria-hidden="true" />スピタイプ診断</span>
          <span>RESULT</span>
        </header>

        <section className="result-hero">
          <div className="result-glow" aria-hidden="true" />
          <p className="result-eyebrow">あなたのスピタイプは</p>
          <div className="type-code">{result.code}</div>
          <h1>{result.name}</h1>
          <p className="result-catch">{result.catchphrase}</p>
        </section>

        <section className="result-detail">
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
      <header className="quiz-header">
        <button type="button" className="back-button" onClick={goBack} aria-label="前へ戻る"><ChevronLeft /></button>
        <span className="brand"><Sparkles aria-hidden="true" />スピタイプ診断</span>
        <span>{String(step + 1).padStart(2, '0')} / {questions.length}</span>
      </header>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

      <section className="question-stage" key={step}>
        <div className="question-copy">
          <span className="question-number">SCENE {String(step + 1).padStart(2, '0')}</span>
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
