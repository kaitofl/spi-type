'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

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
  { id: 1, category: '世界', question: '偶然の意味', left: '意味のある偶然', leftNote: '偶然の一致にもサインや意味を感じる', right: 'ただの偶然', rightNote: '偶然は偶然で、意味はあとからつける' },
  { id: 2, category: '世界', question: '神秘を動かすもの', left: '神様や守護存在の意志', leftNote: '神様や守護存在が出来事を導くと思う', right: '宇宙の法則', rightNote: '人格ではなく、見えない法則が働くと思う', strong: true },
  { id: 3, category: '世界', question: '行いと運の関係', left: 'いつか返ってくる', leftNote: '善い行いは巡って自分に返ると思う', right: '運に善悪はない', rightNote: '運の良し悪しと人の善悪は別だと思う' },
  { id: 4, category: '世界', question: 'つらい経験の意味', left: '魂の成長になる', leftNote: 'つらい経験も魂を育てる課題だと思う', right: 'すべてに意味はない', rightNote: 'すべての苦しみに意味があるとは思わない' },
  { id: 5, category: '世界', question: '魂の行方', left: 'また生まれ変わる', leftNote: '魂は何度も別の人生を経験すると思う', right: 'この一生で完結', rightNote: '魂や人生は今の一度で完結すると思う' },
  { id: 6, category: '世界', question: '物や自然の魂', left: '何にでも気配がある', leftNote: '自然や物にも魂や気配が宿ると感じる', right: '心があるのは人だけ', rightNote: '心や意識を持つのは人間だと思う' },
  { id: 7, category: '世界', question: '神秘が宿る場所', left: '日常のどこにでも宿る', leftNote: '普通の毎日の中にも神秘を感じる', right: '特別な場所に宿る', rightNote: '神社や聖地など特別な場所で強く感じる' },
  { id: 8, category: '運との付き合い', question: '未来のつくり方', left: '自分で引き寄せる', leftNote: '意識や言葉で望む現実を引き寄せる', right: '流れに委ねる', rightNote: '力まず、大きな流れに任せる方がうまくいく', strong: true },
  { id: 9, category: '運との付き合い', question: '運のもらい方', left: '自分で運を開く', leftNote: '習慣や行動を変えて自分で運をよくする', right: '誰かのご加護を受ける', rightNote: '神様や先祖に守られ、運を授かる' },
  { id: 10, category: '運との付き合い', question: 'スピ感覚の身につき方', left: '生まれつき持っている', leftNote: '感覚の鋭さは生まれつき決まると思う', right: 'あとから開花する', rightNote: '経験や練習によってあとから目覚めると思う' },
  { id: 11, category: '運との付き合い', question: 'イヤな気配への反応', left: '悪いものを防ぐ', leftNote: '浄化やお守りで悪い気配を遠ざける', right: 'いったん受け入れる', rightNote: '拒まず、気配の意味や正体を見つめる' },
  { id: 12, category: '運との付き合い', question: 'スピを使う目的', left: '願いを叶えるため', leftNote: '恋愛や仕事など、望む結果を得るために使う', right: '自分を知るため', rightNote: '自分の本音や性質を理解するために使う', strong: true },
  { id: 13, category: '運との付き合い', question: '未来との向き合い方', left: '未来を変えにいく', leftNote: '占いや儀式を使って未来の流れを変える', right: '流れを見届ける', rightNote: '起きる流れを読み、そのまま受け入れる' },
  { id: 14, category: 'サイン', question: '答えの受け取り方', left: '自分の直感', leftNote: '夢やひらめきなど、自分の内側を信じる', right: '外からのサイン', rightNote: 'カードや数字など、外に現れた印を信じる', strong: true },
  { id: 15, category: 'サイン', question: '神秘の理解方法', left: '肌で感じる', leftNote: '空気・波動・身体の反応で理解する', right: 'ルールで読み解く', rightNote: '占星術やカードのルールを学んで理解する' },
  { id: 16, category: 'サイン', question: '見えない存在とのつながり方', left: '自分で直接つながる', leftNote: '自分の感覚で存在や世界と直接つながる', right: '何かを通してつながる', rightNote: '占い師やカードなどの媒介を通してつながる' },
  { id: 17, category: 'サイン', question: '占いに求める答え', left: 'ハッキリした答え', leftNote: '未来や行動について具体的な答えがほしい', right: '考える余白', rightNote: '象徴を受け取り、自分で意味を考えたい' },
  { id: 18, category: 'サイン', question: '知りたい時間', left: '未来を先に知りたい', leftNote: 'これから何が起きるかを先に知りたい', right: 'あとから意味を知りたい', rightNote: '起きた出来事の意味をあとから理解したい' },
  { id: 19, category: 'サイン', question: 'メッセージの形', left: '言葉で届く', leftNote: 'お告げやフレーズとして言葉が浮かぶ', right: '映像で届く', rightNote: '夢・色・映像などイメージとして見える' },
  { id: 20, category: '信じ方', question: '教えとの付き合い方', left: '一つを深く', leftNote: '一つの宗教や占術を深く信じたい', right: 'いいとこ取り', rightNote: '複数の教えから合う部分だけ取り入れたい' },
  { id: 21, category: '信じ方', question: '信じ方のスタイル', left: '昔からのやり方', leftNote: '古くから続く教えや正式な作法を守りたい', right: '自分なりのやり方', rightNote: '自分に合う形へ自由にアレンジしたい' },
  { id: 22, category: '信じ方', question: '信じ始めるきっかけ', left: '体験してから信じる', leftNote: '当たった・効いたという体験をしてから信じる', right: 'ピンときたら信じる', rightNote: '説明できなくても直感でピンときたら信じる' },
  { id: 23, category: '信じ方', question: 'スピを使う頻度', left: '毎日の相棒', leftNote: '今日の運勢など、日常的にスピを使う', right: '大事なときだけ', rightNote: '転職や恋愛など、大きな節目だけ頼る' },
  { id: 24, category: '信じ方', question: 'スピの楽しみ方', left: '一人で探求', leftNote: '一人で静かに自分の世界を深めたい', right: '仲間と共有', rightNote: '同じ感覚を持つ仲間と一緒に楽しみたい' },
  { id: 25, category: '信じ方', question: 'スピとの距離', left: '楽しいエンタメ', leftNote: '占いや診断を気軽な遊びとして楽しむ', right: '人生の指針', rightNote: '大切な決断にもスピの考えを取り入れる' },
  { id: 26, category: '信じ方', question: 'スピ観の見せ方', left: 'オープンに話す', leftNote: '好きなものとして自分の考えを人に話したい', right: '自分だけのもの', rightNote: '個人的で大切なものとして心にしまいたい' },
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
          <span>スピタイプ軸ノート</span>
        </a>
        <span className="header-note">26 AXIS PATTERNS</span>
      </header>

      <section className="intro" id="top">
        <p className="kicker">16タイプをつくる、軸候補</p>
        <h1>スピの軸の<br />パターンを整理</h1>
      </section>

      <section className="guide" aria-label="この資料の見方">
        <span>見かた</span>
        <p><strong>26本を4カテゴリに整理。</strong> 人によって答えが分かれそうな4本を探すための資料です。</p>
      </section>

      <section className="axis-section" id="axis-list">
        <div className="axis-heading">
          <p className="kicker dark">AXIS PATTERNS</p>
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
                  {axis.strong && <span className="strong-label">有力候補</span>}
                </div>
                <h3>{axis.question}</h3>
                <div className="axis-choices">
                  <div><b>A</b><div><strong>{axis.left}<em>タイプ</em></strong><span>{axis.leftNote}</span></div></div>
                  <div><b>B</b><div><strong>{axis.right}<em>タイプ</em></strong><span>{axis.rightNote}</span></div></div>
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
