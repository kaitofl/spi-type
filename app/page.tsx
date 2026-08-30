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
  { id: 1, category: '世界', question: '偶然の意味', left: '意味のある偶然', leftNote: '', right: 'ただの偶然', rightNote: '' },
  { id: 2, category: '世界', question: '神秘を動かすもの', left: '神様や守護存在の意志', leftNote: '', right: '宇宙の法則', rightNote: '', strong: true },
  { id: 3, category: '世界', question: '行いと運の関係', left: 'いつか返ってくる', leftNote: '', right: '運に善悪はない', rightNote: '' },
  { id: 4, category: '世界', question: 'つらい経験の意味', left: '魂の成長になる', leftNote: '', right: 'すべてに意味はない', rightNote: '' },
  { id: 5, category: '世界', question: '魂の行方', left: 'また生まれ変わる', leftNote: '', right: 'この一生で完結', rightNote: '' },
  { id: 6, category: '世界', question: '物や自然の魂', left: '何にでも気配がある', leftNote: '', right: '心があるのは人だけ', rightNote: '' },
  { id: 7, category: '世界', question: '神秘が宿る場所', left: '日常のどこにでも宿る', leftNote: '', right: '特別な場所に宿る', rightNote: '' },
  { id: 8, category: '運との付き合い', question: '未来のつくり方', left: '自分で引き寄せる', leftNote: '', right: '流れに委ねる', rightNote: '', strong: true },
  { id: 9, category: '運との付き合い', question: '運のもらい方', left: '自分で運を開く', leftNote: '', right: '誰かのご加護を受ける', rightNote: '' },
  { id: 10, category: '運との付き合い', question: 'スピ感覚の身につき方', left: '生まれつき持っている', leftNote: '', right: 'あとから開花する', rightNote: '' },
  { id: 11, category: '運との付き合い', question: 'イヤな気配への反応', left: '悪いものを防ぐ', leftNote: '', right: 'いったん受け入れる', rightNote: '' },
  { id: 12, category: '運との付き合い', question: 'スピを使う目的', left: '願いを叶えるため', leftNote: '', right: '自分を知るため', rightNote: '', strong: true },
  { id: 13, category: '運との付き合い', question: '未来との向き合い方', left: '未来を変えにいく', leftNote: '', right: '流れを見届ける', rightNote: '' },
  { id: 14, category: 'サイン', question: '答えの受け取り方', left: '自分の直感', leftNote: '', right: '外からのサイン', rightNote: '', strong: true },
  { id: 15, category: 'サイン', question: '神秘の理解方法', left: '肌で感じる', leftNote: '', right: 'ルールで読み解く', rightNote: '' },
  { id: 16, category: 'サイン', question: '見えない存在とのつながり方', left: '自分で直接つながる', leftNote: '', right: '何かを通してつながる', rightNote: '' },
  { id: 17, category: 'サイン', question: '占いに求める答え', left: 'ハッキリした答え', leftNote: '', right: '考える余白', rightNote: '' },
  { id: 18, category: 'サイン', question: '知りたい時間', left: '未来を先に知りたい', leftNote: '', right: 'あとから意味を知りたい', rightNote: '' },
  { id: 19, category: 'サイン', question: 'メッセージの形', left: '言葉で届く', leftNote: '', right: '映像で届く', rightNote: '' },
  { id: 20, category: '信じ方', question: '教えとの付き合い方', left: '一つを深く', leftNote: '', right: 'いいとこ取り', rightNote: '' },
  { id: 21, category: '信じ方', question: '信じ方のスタイル', left: '昔からのやり方', leftNote: '', right: '自分なりのやり方', rightNote: '' },
  { id: 22, category: '信じ方', question: '信じ始めるきっかけ', left: '体験してから信じる', leftNote: '', right: 'ピンときたら信じる', rightNote: '' },
  { id: 23, category: '信じ方', question: 'スピを使う頻度', left: '毎日の相棒', leftNote: '', right: '大事なときだけ', rightNote: '' },
  { id: 24, category: '信じ方', question: 'スピの楽しみ方', left: '一人で探求', leftNote: '', right: '仲間と共有', rightNote: '' },
  { id: 25, category: '信じ方', question: 'スピとの距離', left: '楽しいエンタメ', leftNote: '', right: '人生の指針', rightNote: '' },
  { id: 26, category: '信じ方', question: 'スピ観の見せ方', left: 'オープンに話す', leftNote: '', right: '自分だけのもの', rightNote: '' },
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
                  <div><b>A</b><strong>{axis.left}<em>タイプ</em></strong></div>
                  <div><b>B</b><strong>{axis.right}<em>タイプ</em></strong></div>
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
