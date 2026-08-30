'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

type Axis = {
  id: number;
  category: '世界' | '運との付き合い' | 'サイン' | '信じ方';
  question: string;
  left: string;
  leftNote: string;
  right: string;
  rightNote: string;
  strong?: boolean;
};

const axes: Axis[] = [
  { id: 1, category: '世界', question: '同じ数字を何度も見たら？', left: '意味のある偶然', leftNote: '何かのサインかも', right: 'ただの偶然', rightNote: '意味は自分でつけるもの' },
  { id: 2, category: '世界', question: '不思議なことを動かしているのは？', left: '誰かの意志', leftNote: '神様や守護存在の導き', right: '宇宙の法則', rightNote: '見えないルールが働く', strong: true },
  { id: 3, category: '世界', question: 'いい行いをした人には？', left: 'いつか返ってくる', leftNote: '行いと運はつながっている', right: '運に善悪はない', rightNote: 'いい人にも悪いことは起きる' },
  { id: 4, category: '世界', question: 'つらい経験には目的がある？', left: '魂の成長になる', leftNote: '乗り越えるための課題', right: '人生は人生', rightNote: '全部を修行にしなくていい' },
  { id: 5, category: '世界', question: '人生が終わったあと、魂は？', left: 'また生まれ変わる', leftNote: '魂は何度も人生を経験する', right: 'この一生で完結', rightNote: '今の人生がすべて' },
  { id: 6, category: '世界', question: '古い木や大切な物に心はある？', left: '何にでも気配がある', leftNote: '自然や物にも魂を感じる', right: '人だけに心がある', rightNote: '人が気持ちを重ねている' },
  { id: 7, category: '世界', question: '神秘を感じるのはどこ？', left: 'いつもの日常', leftNote: '毎日の中に神秘はある', right: '特別な場所', rightNote: '神社や聖地に強く宿る' },
  { id: 8, category: '運との付き合い', question: 'ほしい未来に近づくには？', left: '自分で引き寄せる', leftNote: '意識や言葉で現実を動かす', right: '流れに委ねる', rightNote: '力まず、来たものを受け取る', strong: true },
  { id: 9, category: '運との付き合い', question: '運をよくしてくれるのは？', left: '自分で開運', leftNote: '習慣や行動でつかむ', right: '誰かのご加護', rightNote: '神様や先祖から授かる' },
  { id: 10, category: '運との付き合い', question: 'スピの感覚はどう身につく？', left: '生まれつき', leftNote: '持って生まれた才能や体質', right: 'あとから開花', rightNote: '経験や練習で目覚める' },
  { id: 11, category: '運との付き合い', question: 'イヤな空気を感じたら？', left: '悪いものを防ぐ', leftNote: '浄化やお守りで距離を置く', right: 'いったん受け入れる', rightNote: '意味や正体を見つめる' },
  { id: 12, category: '運との付き合い', question: '占いやスピに求めるものは？', left: '願いを叶える', leftNote: '恋愛や仕事をいい方向へ', right: '自分を知る', rightNote: '本当の気持ちを見つける', strong: true },
  { id: 13, category: '運との付き合い', question: '未来が気に入らなかったら？', left: '未来を変えにいく', leftNote: '占いや儀式で流れに介入する', right: '流れを見届ける', rightNote: '意味を読み、受け入れる' },
  { id: 14, category: 'サイン', question: '迷ったとき、より信じるのは？', left: '自分の直感', leftNote: '夢やひらめき、身体感覚', right: '外からのサイン', rightNote: 'カード、星、数字、偶然', strong: true },
  { id: 15, category: 'サイン', question: '見えないものを理解するなら？', left: '肌で感じる', leftNote: '空気や波動を頼りにする', right: 'ルールで読み解く', rightNote: '占術の体系を学んで読む' },
  { id: 16, category: 'サイン', question: '見えない存在とつながるなら？', left: '自分で直接感じる', leftNote: '自分の感覚で受け取りたい', right: '何かを通して感じる', rightNote: '占い師やカードを通して受け取る' },
  { id: 17, category: 'サイン', question: '占いの答えにほしいのは？', left: 'ハッキリした答え', leftNote: '具体的にどうすべきか知りたい', right: '考える余白', rightNote: '象徴を自分なりに解釈したい' },
  { id: 18, category: 'サイン', question: 'どっちの「わかる」がほしい？', left: '未来を先に知る', leftNote: 'この先に備えたい', right: 'あとから意味を知る', rightNote: 'なぜ起きたか納得したい' },
  { id: 19, category: 'サイン', question: 'メッセージはどう届く？', left: '言葉で届く', leftNote: 'お告げやフレーズが浮かぶ', right: '映像で届く', rightNote: '夢や色、イメージで見える' },
  { id: 20, category: '信じ方', question: 'いろんな占いや教えに出会ったら？', left: '一つを深く', leftNote: '信頼する道を極めたい', right: 'いいとこ取り', rightNote: '合う部分をミックスしたい' },
  { id: 21, category: '信じ方', question: '信じ方のスタイルは？', left: '昔からのやり方', leftNote: '伝統や正式な作法を大切にする', right: '自分なりのやり方', rightNote: '自分に合う形へ自由に変える' },
  { id: 22, category: '信じ方', question: '何かを信じ始めるタイミングは？', left: '体験してから', leftNote: '当たった、効いた実感が必要', right: 'ピンときたら', rightNote: '説明できなくても信じられる' },
  { id: 23, category: '信じ方', question: '占いやお参りを使う頻度は？', left: '毎日の相棒', leftNote: '日常的に頼りたい', right: '大事なときだけ', rightNote: '人生の節目で頼りたい' },
  { id: 24, category: '信じ方', question: 'スピを楽しむなら？', left: '一人で探求', leftNote: '静かに自分の世界を深めたい', right: '仲間と共有', rightNote: '同じ感覚の人と楽しみたい' },
  { id: 25, category: '信じ方', question: 'スピは自分にとって？', left: '楽しいエンタメ', leftNote: '気軽に占いや診断を楽しむ', right: '人生の指針', rightNote: '大切な決断にも取り入れる' },
  { id: 26, category: '信じ方', question: '自分のスピ観を人に話したい？', left: 'オープンに話す', leftNote: '好きなものとして共有したい', right: '自分だけのもの', rightNote: '心の中で静かに大切にしたい' },
];

const categories = ['すべて', '世界', '運との付き合い', 'サイン', '信じ方'] as const;

export default function Home() {
  const [category, setCategory] = useState<(typeof categories)[number]>('すべて');

  const filteredAxes = useMemo(
    () => (category === 'すべて' ? axes : axes.filter((axis) => axis.category === category)),
    [category],
  );

  return (
    <main className="min-h-screen">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="スピタイプ診断 トップへ">
          <Sparkles aria-hidden="true" />
          <span>スピタイプ診断</span>
        </a>
        <span className="header-note">軸アイデアノート</span>
      </header>

      <section className="intro" id="top">
        <p className="kicker">16タイプをつくる、軸候補</p>
        <h1>スピの違いを、<br />超わかりやすく。</h1>
        <p className="intro-text">
          正解を決める診断じゃない。<br />「自分はこっちかも」で選んでみよう。
        </p>
        <a className="jump-link" href="#axis-list">
          候補を見る <ChevronDown aria-hidden="true" />
        </a>
      </section>

      <section className="guide" aria-label="この資料の見方">
        <span>見かた</span>
        <p><strong>26本を4カテゴリに整理。</strong> 人によって答えが分かれそうな4本を探すための資料です。</p>
      </section>

      <section className="axis-section" id="axis-list">
        <div className="axis-heading">
          <div>
            <p className="kicker dark">AXIS IDEAS</p>
            <h2>どっちに近い？</h2>
          </div>
          <span>{axes.length}候補</span>
        </div>

        <div className="category-tabs" role="tablist" aria-label="カテゴリで絞り込む">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
              <span>{item === 'すべて' ? axes.length : axes.filter((axis) => axis.category === item).length}</span>
            </button>
          ))}
        </div>

        <div className="axis-list">
          {filteredAxes.map((axis) => (
              <article className="axis-item" key={axis.id}>
                <div className="axis-meta">
                  <span>{String(axis.id).padStart(2, '0')}</span>
                  <span>{axis.category}</span>
                  {axis.strong && <span className="strong-label">推し軸</span>}
                </div>
                <h3>{axis.question}</h3>
                <div className="axis-choices">
                  <div>
                    <strong>{axis.left}</strong>
                    <span>{axis.leftNote}</span>
                  </div>
                  <b>OR</b>
                  <div>
                    <strong>{axis.right}</strong>
                    <span>{axis.rightNote}</span>
                  </div>
                </div>
              </article>
          ))}
        </div>
      </section>

      <section className="why-section">
        <p className="kicker light">WHY THESE FOUR?</p>
        <h2>迷ったら、<br />この4本から。</h2>
        <p>人によって分かれやすく、診断結果にもキャラが出そうな暫定ベスト。</p>
        <ol>
          {axes.filter((axis) => axis.strong).map((axis) => (
            <li key={axis.id}>
              <span>{String(axis.id).padStart(2, '0')}</span>
              <strong>{axis.left}<br />↔ {axis.right}</strong>
            </li>
          ))}
        </ol>
      </section>

      <footer>
        <strong>スピタイプ診断</strong>
        <span>どちらが正しいかではなく、どちらに心が動くか。</span>
      </footer>

    </main>
  );
}
