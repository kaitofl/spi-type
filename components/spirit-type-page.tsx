'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, Copy, Heart, RotateCcw, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  axesForCode as currentAxesForCode,
  methodIsTied,
  methodTieBreakQuestion,
  questions as currentQuestions,
  resultCode,
  typeEntries as currentTypeEntries,
  typeResults as currentTypeResults,
  type ScoreKey,
} from '@/lib/spirit-data';

type Dimension = 'outlook' | 'fate' | 'flow' | 'agency';
type ChoiceValue = -1 | 1;

type Question = {
  dimension: Dimension;
  image: string;
  prompt: string;
  yesValue: ChoiceValue;
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
  tendencies: string[];
  strength: string;
  blindspot: string;
  advice: string;
  matches: { code: string; reason: string }[];
  rituals: { title: string; detail: string }[];
};

const assetBase = typeof window !== 'undefined' && window.location.pathname.startsWith('/spi-type')
  ? '/spi-type'
  : '';
const assetPath = (path: string) => `${assetBase}${path}`;

const _legacyQuestions: Question[] = [
  {
    dimension: 'outlook',
    image: assetPath('/questions/q01-tarot.webp'),
    prompt: 'ゾロ目を見ると、警告よりも幸運のサインだと感じる？',
    yesValue: 1,
  },
  {
    dimension: 'fate',
    image: assetPath('/questions/q02-tarot.webp'),
    prompt: '人生の大きな流れは、生まれる前から決まっていると思う？',
    yesValue: -1,
  },
  {
    dimension: 'flow',
    image: assetPath('/questions/q03-tarot.webp'),
    prompt: '良い運気は、次の幸運を引き寄せると思う？',
    yesValue: -1,
  },
  {
    dimension: 'agency',
    image: assetPath('/questions/q04-tarot.webp'),
    prompt: '願いは、強く意図することで現実に近づくと思う？',
    yesValue: 1,
  },
  {
    dimension: 'outlook',
    image: assetPath('/questions/q05-tarot.webp'),
    prompt: '嫌な予感は、未来からの警告だと思う？',
    yesValue: -1,
  },
  {
    dimension: 'fate',
    image: assetPath('/questions/q06-tarot.webp'),
    prompt: '本当に縁がある人とは、離れてもまた出会うと思う？',
    yesValue: -1,
  },
  {
    dimension: 'flow',
    image: assetPath('/questions/q07-tarot.webp'),
    prompt: '悪いことが続くのは、悪い気が連鎖しているからだと思う？',
    yesValue: -1,
  },
  {
    dimension: 'agency',
    image: assetPath('/questions/q08-tarot.webp'),
    prompt: '浄化やお祓いで、運の流れは変えられると思う？',
    yesValue: 1,
  },
  {
    dimension: 'outlook',
    image: assetPath('/questions/q09-tarot.webp'),
    prompt: '偶然起きたうれしい出来事には、意味があると思う？',
    yesValue: 1,
  },
  {
    dimension: 'fate',
    image: assetPath('/questions/q10-tarot.webp'),
    prompt: '占いで示された未来も、自分の選択で変えられると思う？',
    yesValue: 1,
  },
  {
    dimension: 'flow',
    image: assetPath('/questions/q11-tarot.webp'),
    prompt: '幸運を使いすぎると、少し反動が来ると思う？',
    yesValue: 1,
  },
  {
    dimension: 'agency',
    image: assetPath('/questions/q12-tarot.webp'),
    prompt: '必要なチャンスは、ふさわしいタイミングで運ばれてくると思う？',
    yesValue: -1,
  },
];

const axisDefinitions: Record<Dimension, { positive: AxisResult; negative: AxisResult }> = {
  outlook: {
    positive: { code: 'P', label: '希望を見つける', short: '出来事の先に、良い可能性を見つける' },
    negative: { code: 'N', label: '兆しに備える', short: '悪い可能性を先読みし、自分を守る' },
  },
  fate: {
    positive: { code: 'B', label: '道を選ぶ', short: '選択や出来事によって、未来は変わる' },
    negative: { code: 'D', label: '導きを信じる', short: '起きることには、決められた流れがある' },
  },
  flow: {
    positive: { code: 'E', label: 'めぐりを感じる', short: '運は上がり下がりしながら釣り合う' },
    negative: { code: 'C', label: '流れをつなぐ', short: '良い流れも悪い流れも、勢いで続いていく' },
  },
  agency: {
    positive: { code: 'M', label: '自らひらく', short: '行動によって、自分で運を動かせる' },
    negative: { code: 'R', label: '訪れを待つ', short: '運はタイミングや縁として届けられる' },
  },
};

const _legacyTypeResults: Record<string, TypeResult> = {
  PBEM: {
    name: '希望の錬金術師', catchphrase: 'どんな出来事も、次の幸運の材料に。',
    description: '未来は何度でも選び直せて、運は自分の手で整えられると考えるタイプ。うまくいかない日にも「ここから何を持ち帰れる？」と発想を切り替え、失敗さえ次の幸運の材料に変えていきます。立ち直る速さと、現実を少しずつ良くする工夫があなたの魔法です。',
    tendencies: ['落ち込んでも、次の一手を考えると元気が戻る', '偶然をヒントとして拾い、自分なりの意味に変える', '誰かの悩みに、明るく現実的な解決策を出せる'],
    strength: '逆境を経験値に変える「回復力」。空気が重い場でも、小さな希望と具体策を見つけられます。',
    blindspot: '何でも前向きに変換しようとして、悲しみや疲れを置き去りにしがち。元気になる前の休息も必要です。',
    advice: '答えを出す前に「今は整える日」と決める余白を。行動する日と、感情を味わう日を分けるほど運の精度が上がります。',
    matches: [{ code: 'NBER', reason: '静寂の兆し読みの観察力が、あなたの楽観にちょうどいい慎重さをくれます。' }, { code: 'PBCM', reason: 'ひらめきを勢いに変えられる二人。企画や旅を一緒に始めると最強。' }],
    rituals: [{ title: '朝の「よかった探し」', detail: '昨日の小さな幸運を3つ書き、今日育てたいものを1つ選ぶ。' }, { title: '失敗の錬金メモ', detail: '嫌だったことを「学び・手放すもの・次に試すこと」に分解する。' }, { title: '玄関のリセット', detail: '靴を揃えて空気を入れ替え、外から入る運の通り道をつくる。' }],
  },
  PBER: {
    name: '余白の旅人', catchphrase: '寄り道の先で、いい縁に出会う。',
    description: '未来にはいくつもの道があり、必要な縁はちょうどいい時に訪れると信じるタイプ。計画通りに進まないことさえ、新しい景色に出会うための寄り道として楽しめます。力みすぎず、それでも好奇心の扉は開けておく。その軽やかさが運を連れてきます。',
    tendencies: ['予定変更を「面白くなるかも」と受け止めやすい', '人や場所との不思議な縁を大切にする', '選択肢が多いほど想像力が膨らみ、元気になる'],
    strength: '変化への柔軟さと、縁を受け取る素直さ。思いがけない出会いから可能性を広げます。',
    blindspot: '流れを信じるあまり、決断を先送りすることも。自由でいることと、選ばないことは別物です。',
    advice: '迷ったら「今月だけ試す」と期限を決めて小さく選択を。仮決定が、新しい星への航路になります。',
    matches: [{ code: 'NBCM', reason: '厄断ちの祓い手の決断力が、迷いがちなあなたの背中を気持ちよく押します。' }, { code: 'PBCR', reason: '偶然を楽しめる者同士。ノープランの旅で忘れられない縁を引き寄せます。' }],
    rituals: [{ title: '行き先を決めない散歩', detail: '一度だけ直感で角を曲がり、目に入った店や景色を味わう。' }, { title: '縁のログ', detail: '最近よく聞く名前や場所をメモし、三度重なったら調べてみる。' }, { title: '新月の選択肢ノート', detail: '叶えたい未来をひとつに絞らず、3通りの形で書いておく。' }],
  },
  PBCM: {
    name: '幸運の魔法使い', catchphrase: 'ひとつの幸運から、次の幸運を起こす。',
    description: '良い流れは、見つけて、育てて、広げられると考えるタイプ。小さな成功の熱が冷めないうちに次の一手を打ち、周囲まで巻き込みながら人生に勢いをつくります。願うだけで終わらず、幸運が起きやすい舞台そのものを設計できる人です。',
    tendencies: ['うまくいった方法を再現し、さらに大きくするのが得意', '人の強みを見つけ、役割や場をつくりたくなる', '気分が乗ると驚くほどの速さで物事を進める'],
    strength: 'チャンスを連鎖させる企画力と実行力。周りの運気まで底上げする華があります。',
    blindspot: '勢いがある時ほど予定を詰め込み、運を育てる前に消耗しがち。休む設計もプロデュースの一部です。',
    advice: '新しいことを始めるたび「やめること」をひとつ決めて。余白があるほど、本命の幸運が長く続きます。',
    matches: [{ code: 'NDER', reason: '静寂の守護者が足元を守ってくれるため、安心して大胆な一手を打てます。' }, { code: 'PBEM', reason: 'アイデアと改善力が循環する関係。一緒なら失敗すら次の企画になります。' }],
    rituals: [{ title: '吉報の即アクション', detail: '嬉しい連絡が来たら、24時間以内に小さな次の一手を打つ。' }, { title: '朝一番の窓開け', detail: '部屋の空気を動かしながら、今日広げたい流れを声に出す。' }, { title: '満月の棚卸し', detail: '増やす願いだけでなく、続けなくていい予定を手放す。' }],
  },
  PBCR: {
    name: '追い風の招き手', catchphrase: '来た波に乗れば、未来はもっと面白くなる。',
    description: '偶然や人から届く好意を素直に受け取り、その流れに乗るほど未来が開いていくタイプ。頑張って引き寄せようとしなくても、楽しそうにしている姿そのものが次の幸運を呼びます。「なんとなく気になる」を信じられる、生まれつきの受信上手です。',
    tendencies: ['誘いやプレゼントから予想外の展開が始まりやすい', '場の空気を読み、今どこに勢いがあるか直感でわかる', '好きなことを楽しんでいる時に人や情報が集まる'],
    strength: '幸運を受け取る無邪気さと、波に乗る反射神経。人の厚意を喜びに変えられます。',
    blindspot: '楽しい流れを止めたくなくて、違和感まで見逃すことがあります。誘いを断るのも運を選ぶ行為です。',
    advice: '「楽しそう」に加えて「明日の自分も喜ぶ？」を確認して。受け取るものを選ぶほど、本物の縁が濃くなります。',
    matches: [{ code: 'NDEM', reason: '宿命の調停者の堅実さが、あなたの勢いを安全な幸運へ整えます。' }, { code: 'PBER', reason: '二人とも偶然の達人。寄り道や紹介から面白い未来が生まれます。' }],
    rituals: [{ title: 'ありがとうの即返し', detail: '小さな好意にもその場で喜びを伝え、幸運の循環を止めない。' }, { title: '直感の三色信号', detail: '誘いを緑・黄・赤でメモし、黄なら一晩寝てから返事をする。' }, { title: 'お気に入りの招き場所', detail: '部屋の一角に好きな物だけを飾り、良い気分の起点をつくる。' }],
  },
  PDEM: {
    name: '運命の調律師', catchphrase: '決められた物語も、いい形に整えられる。',
    description: '人生には大きな流れがあると感じながらも、その中で自分にできる調整を丁寧に重ねるタイプ。起きる出来事を無理に否定せず、体調、環境、習慣を整えて最高の状態で迎えます。受容と行動を両立できる、静かな現実派です。',
    tendencies: ['起きたことの意味を考えつつ、まず足元を整える', 'ルーティンや道具にこだわるほど力を発揮する', '人の状態の微妙なズレに気づき、自然に調整できる'],
    strength: '運命に振り回されない安定感。変えられないことの中にも、変えられる部分を見つけます。',
    blindspot: '整えることに集中しすぎて、本当は嫌な流れまで受け入れてしまうこともあります。',
    advice: '「これは調整する問題？ 離れる問題？」と問いかけて。調律できない場所から離れる決断も立派な開運です。',
    matches: [{ code: 'NBCR', reason: '影守りの黒猫の鋭い察知力を、あなたが落ち着いた行動に翻訳できます。' }, { code: 'PDER', reason: '運命への信頼が共通言語。穏やかで長く続く関係を育てられます。' }],
    rituals: [{ title: '音と香りの調律', detail: '朝に一曲とひとつの香りを選び、その日の心の基準音をつくる。' }, { title: '週一の道具磨き', detail: '毎日使う靴やスマホを整え、行動を支えるものに感謝する。' }, { title: '月末の違和感チェック', detail: '続ける・調整する・離れるの3列で、今の環境を書き出す。' }],
  },
  PDER: {
    name: '月待ちの導き手', catchphrase: '必要な幸運は、必要なときに届く。',
    description: '人生には意味のあるリズムがあり、遅れているように見える時も最後には整うと信じるタイプ。焦る人の隣で「今はこのままで大丈夫」と言える安心感があります。答えを急がず、月が満ちるように物事が育つのを待てる人です。',
    tendencies: ['タイミングが来ていない時に、無理をしない', '言葉より雰囲気で人を安心させる', '過去の出来事が後からつながる感覚をよく持つ'],
    strength: '待つことを恐れない信頼感。混乱の中でも長い目で見て、人の心を落ち着かせます。',
    blindspot: '「なるようになる」が、必要な意思表示まで遅らせることも。待つ前に希望は伝えておきましょう。',
    advice: '結果を委ねる前に「私はこうなったら嬉しい」と一度だけ言葉にして。運命が入ってくる入口ができます。',
    matches: [{ code: 'NDCM', reason: '宿命破りの火継ぎの突破力をあなたの安心感が包み、強さを持続させます。' }, { code: 'PDEM', reason: '同じリズムで静かに歩ける二人。説明しすぎなくても心が通じます。' }],
    rituals: [{ title: '月の満ち欠けメモ', detail: '新月に意図を書き、満月に結果ではなく途中の変化を振り返る。' }, { title: '夜の委ねる呼吸', detail: '4秒吸って8秒吐き、今日コントロールできないことを手放す。' }, { title: '水を一杯供える', detail: '眠る前に静かな場所へ水を置き、朝に感謝して流す。' }],
  },
  PDCM: {
    name: '追い風の召喚士', catchphrase: '運命の追い風を、自分でさらに強くする。',
    description: '自分には進むべき航路があり、一度吹いた追い風は行動でさらに強くできると信じるタイプ。目的が定まると迷いが消え、人を巻き込みながら一直線に進みます。使命感を現実の成果へ変える、頼もしいリーダーです。',
    tendencies: ['「これだ」と感じた目標には驚くほど粘り強い', '良い兆しを見つけると、すぐ予定や役割に落とし込む', '仲間の気持ちをひとつの方向へまとめるのが得意'],
    strength: '信念と推進力。長い航海でも目的を見失わず、停滞した状況に風を起こします。',
    blindspot: '目的に集中するほど、違う航路を選びたい人の気持ちを置いていくことがあります。',
    advice: '節目ごとに「みんな同じ船に乗り続けたい？」と確認を。合意を取り直すほど、追い風は強くなります。',
    matches: [{ code: 'NBER', reason: '静寂の兆し読みが小さな危険を知らせ、あなたは安心して舵を切れます。' }, { code: 'PDCR', reason: '未来への確信が響き合う二人。大きな夢ほど現実味が増します。' }],
    rituals: [{ title: '朝の羅針盤', detail: '今日の最重要行動をひとつだけ書き、終わるまで寄り道しない。' }, { title: '追い風の共有', detail: '嬉しい兆しがあった日は、仲間へ感謝と次の目標を伝える。' }, { title: '塩風呂の停泊日', detail: '週に一度は進まない夜をつくり、疲れと他人の期待を流す。' }],
  },
  PDCR: {
    name: '星の申し子', catchphrase: 'すべては、最高の未来につながっている。',
    description: '出会いも出来事も大きな物語の一部で、良い流れは良い流れを呼ぶと感じるタイプ。自分が輝くタイミングを直感的に知り、自然体のまま周囲を惹きつけます。未来を疑わない強さが、人にも希望を思い出させる存在です。',
    tendencies: ['大切な出会いには最初から特別な意味を感じる', '注目される場面で、むしろ本来の力が出やすい', '良い波に乗ると迷いが消え、偶然まで味方につく'],
    strength: '未来を信じ切る求心力。あなたの確信が、周りに「きっと大丈夫」を伝染させます。',
    blindspot: '物語を信じる力が強いぶん、都合の悪いサインを脇役扱いしてしまうことがあります。',
    advice: '月に一度だけ、応援ではなく率直な意見をくれる人に相談を。輝きを曇らせず、軌道だけを直せます。',
    matches: [{ code: 'NBEM', reason: '未来の結界師の先回り力が、あなたの大きな運を長く安全に支えます。' }, { code: 'PDCM', reason: '確信と行動が揃う華やかなペア。互いの夢を大きくできます。' }],
    rituals: [{ title: '鏡のアファメーション', detail: '出かける前に鏡を見て、今日どんな存在でいたいか一文で宣言する。' }, { title: '光を浴びる時間', detail: '朝日か夕日を数分浴び、自分のリズムを空の光に合わせる。' }, { title: '拍手の循環', detail: '自分の幸運と同じ熱量で、誰かの成功も言葉にして祝う。' }],
  },
  NBEM: {
    name: '未来の結界師', catchphrase: '悪い未来を読んで、先回りで変えていく。',
    description: '小さな違和感からリスクを見つけ、まだ変えられるうちに手を打つタイプ。心配性に見えて、実は未来を守るための具体策を何通りも持っています。備えるほど安心して優しくなれる、実用的な守りの達人です。',
    tendencies: ['出発前の確認や予備の準備を自然にしている', '人が見逃す小さな変化や危険にすぐ気づく', '不安になると、調べたり整えたりすることで落ち着く'],
    strength: '先読みと予防の力。トラブルを小さいうちに見つけ、大切な人まで守れます。',
    blindspot: '備えを増やすほど新しい不安も見つかり、行動開始が遅くなることがあります。',
    advice: '準備の終了条件を先に決めて。「70％整ったら出発」にすると、慎重さが本当の武器になります。',
    matches: [{ code: 'PDCR', reason: '星の申し子の明るい確信が、あなたの不安を未来への期待に変えます。' }, { code: 'NBCM', reason: '察知と即対応が噛み合う守備力の高い二人。困難な場面ほど頼れる関係。' }],
    rituals: [{ title: 'お守りの中身を更新', detail: '持ち歩く物を月一で見直し、今の自分に必要なものだけ残す。' }, { title: '不安の結界メモ', detail: '心配事と「ここまで備えたら終了」をセットで書く。' }, { title: '帰宅後の手洗い儀式', detail: '水と一緒に外の緊張も流すイメージで、ゆっくり手を洗う。' }],
  },
  NBER: {
    name: '静寂の兆し読み', catchphrase: '焦らず見極めれば、流れはまた整う。',
    description: '空気の変化や言葉の裏にある違和感をいち早く見つけ、運の波が戻る瞬間を静かに待てるタイプ。すぐに結論を出さず、証拠が揃うまで観察します。その慎重さは、余計な傷を避けて最適な分岐を選ぶための知性です。',
    tendencies: ['相手の声色や返信の間から本音を察しやすい', '悪い予感がすると、まず情報を集めて様子を見る', '一人で静かに考える時間があると判断が冴える'],
    strength: '鋭い観察力と、待てる冷静さ。見せかけの勢いに流されず本質を見抜きます。',
    blindspot: '疑う材料ばかり集めて、安心できる証拠を数え忘れることがあります。',
    advice: '調査ノートに「良い兆し」の欄もつくって。両方を並べた時、直感が警告なのか不安なのか見えます。',
    matches: [{ code: 'PBEM', reason: '希望の錬金術師が、集めた事実から明るく現実的な出口をつくります。' }, { code: 'PDCM', reason: 'あなたが海図を読み、追い風の召喚士が舵を切る。判断と実行の名コンビ。' }],
    rituals: [{ title: '兆しの事実メモ', detail: '気になったことを、解釈を入れず見たまま三行で記録する。' }, { title: '白湯の保留時間', detail: '不安な連絡にはすぐ反応せず、白湯を一杯飲んでから返す。' }, { title: '朝夜の感覚採点', detail: '気分を10点満点で記録し、自分の波の周期を知る。' }],
  },
  NBCM: {
    name: '厄断ちの祓い手', catchphrase: '嫌な連鎖は、自分のところで断ち切る。',
    description: '悪い空気や停滞を敏感に察知し、「ここで終わらせる」と即座に動けるタイプ。理不尽を我慢するより、掃除、話し合い、環境変更など現実のアクションで流れを切り替えます。危機の時ほど頼りになる突破役です。',
    tendencies: ['問題を見つけると、放置せずすぐ手を動かす', '誰かが傷つく場面では、先頭に立って守ろうとする', '部屋や人間関係の淀みに人一倍敏感'],
    strength: '悪い連鎖を止める勇気と瞬発力。皆が動けない時に、最初の一歩をつくれます。',
    blindspot: '早く解決したい気持ちから、まだ話したくない人まで急かしてしまうことがあります。',
    advice: '動く前に「今ほしいのは解決？共感？」と一度確認を。あなたの強さが、もっと優しく届きます。',
    matches: [{ code: 'PBER', reason: '余白の旅人の柔らかさが、戦闘モードのあなたに別の出口を見せます。' }, { code: 'NBEM', reason: '予防と突破の守護ペア。互いの大切なものを本気で守れます。' }],
    rituals: [{ title: '床から始める厄払い', detail: '気分が重い時は、玄関から部屋の奥へ床を水拭きする。' }, { title: '塩の境界線', detail: '入浴時にひとつまみの塩で手を洗い、今日の役目を終える。' }, { title: '断つことリスト', detail: '月末に惰性の習慣をひとつ選び、翌月はやめてみる。' }],
  },
  NBCR: {
    name: '影守りの黒猫', catchphrase: '流れを読めば、嵐の中にも道はある。',
    description: '運の連鎖と空気の変化を鋭く読み、危険が過ぎるまで身を低くして待てるタイプ。表立って騒がずとも、どこに逃げ道があるかを直感で知っています。静けさは弱さではなく、最適な瞬間に動くためのしなやかな野性です。',
    tendencies: ['場の空気が荒れそうな時、誰より早く距離を取る', '言葉にできない違和感を身体で感じやすい', '安全な場所と信頼できる少人数を大切にする'],
    strength: '危機察知とサバイバル感覚。無駄に消耗せず、嵐の中でも生きる道を見つけます。',
    blindspot: '一度警戒すると安全になっても隠れ続け、良い誘いまで遠ざけることがあります。',
    advice: '安心できる人を一人だけ「外の天気を聞く相手」に。自分以外の感覚を借りると、動く時がわかります。',
    matches: [{ code: 'PDEM', reason: '運命の調律師が、あなたの繊細な感覚を安全な環境づくりへ変えてくれます。' }, { code: 'NDCR', reason: '沈黙が苦にならない二人。言葉より深いレベルで気配を共有できます。' }],
    rituals: [{ title: '黒い布の休息', detail: '光と通知を落とし、10分だけ完全に情報を遮断する。' }, { title: '足裏のグラウンディング', detail: '裸足で床に立ち、吐く息と一緒に緊張が下へ抜けるのを感じる。' }, { title: '安全地図づくり', detail: '落ち着く店、人、音楽をリストにし、嵐の日の避難先にする。' }],
  },
  NDEM: {
    name: '宿命の調停者', catchphrase: '決まった試練にも、整え方はきっとある。',
    description: '避けられない出来事には理由があると受け止めつつ、自分にできる備えと修復を怠らないタイプ。感情だけで白黒を決めず、状況を見渡して公平な着地点を探します。崩れたバランスを現実的に立て直す、信頼される判断役です。',
    tendencies: ['問題が起きると、原因と責任の範囲を整理したくなる', '厳しい現実も見たうえで、できることを淡々と続ける', '人から相談されると、公平な答えを出そうとする'],
    strength: '受容と修復のバランス。感情が揺れる場でも、現実的で長持ちする解決を選びます。',
    blindspot: '自分にも厳しい判決を出し、避けられなかったことまで責任として背負いがちです。',
    advice: '判断の最後に「親友にも同じ厳しさを向ける？」と確認を。自分への慈悲が、判断をより公平にします。',
    matches: [{ code: 'PBCR', reason: '追い風の招き手の明るさが、あなたに予想外の温かい判決を教えます。' }, { code: 'NDER', reason: '責任感と守る力を理解し合える、静かで揺るがない信頼関係。' }],
    rituals: [{ title: '一日の閉廷', detail: '夜に「今日できたこと」を3つ認定し、反省会を終わらせる。' }, { title: '左右の天秤メモ', detail: '迷いを得るもの・失うものに分け、感情も同じ一票として数える。' }, { title: '机上の浄化', detail: '判断前に机の上を空にし、視界と考えを同時に整える。' }],
  },
  NDER: {
    name: '静寂の守護者', catchphrase: '今は耐えるとき。流れが戻るまで静かに守る。',
    description: '運命には荒れる時期と戻る時期があると知り、大切なものを守りながら静かに待てるタイプ。派手な反撃より、生活や約束を崩さないことを選びます。簡単には投げ出さない誠実さが、周囲にとっての安全基地になります。',
    tendencies: ['困難な時ほど、いつもの生活や役割を守ろうとする', '信頼した人とは時間をかけて深い関係を築く', '自分の苦労を見せず、静かに耐えてしまいやすい'],
    strength: '揺るがない忠誠心と持久力。嵐が過ぎるまで人や場所を守り抜けます。',
    blindspot: '耐えることが正しさになり、助けを求める時期を逃すことがあります。盾は下ろしてもいいのです。',
    advice: '限界の一歩手前ではなく、疲れが6割の時点で共有を。「守られる練習」があなたの運を回復させます。',
    matches: [{ code: 'PBCM', reason: '幸運の魔法使いが新しい風を運び、あなたはその挑戦に安心の土台をつくります。' }, { code: 'NDEM', reason: '言葉より行動で信頼を示す者同士。長い時間を一緒に越えられます。' }],
    rituals: [{ title: '鎧を脱ぐ合図', detail: '帰宅後にアクセサリーや時計を外し、守る役目の終了を身体に伝える。' }, { title: '寝具の結界', detail: '枕元を毎朝整え、夜は何も背負い込まない場所にする。' }, { title: '助けを借りる日', detail: '週に一つ、自分でできることでも誰かに頼んで受け取る。' }],
  },
  NDCM: {
    name: '宿命破りの火継ぎ', catchphrase: '決められた悪い流れなら、自分で打ち破る。',
    description: '運命の強さを感じるからこそ、望まない筋書きには正面から立ち向かうタイプ。「仕方ない」で終わらせず、自分の代で連鎖を止めようとします。覚悟が決まった時の行動力は圧倒的。古いルールを書き換える改革者です。',
    tendencies: ['理不尽や古い慣習を見ると、黙っていられない', '一度腹を決めると、周囲が驚くほど大胆に動く', '自分の経験を、次の人が苦しまない仕組みに変えたい'],
    strength: '宿命に屈しない反骨心と突破力。誰も変えられないと思った連鎖を断ち切ります。',
    blindspot: '戦う理由を抱え続け、平和になっても身体が緊張を解けないことがあります。',
    advice: '「何と戦うか」と同じくらい「勝った後、何を楽しむか」を決めて。喜びが新しい運命の設計図になります。',
    matches: [{ code: 'PDER', reason: '月待ちの導き手の穏やかさが、戦いの外にある居場所を思い出させます。' }, { code: 'NDCR', reason: '深い問題意識を共有できる二人。静かな確信が大きな変化につながります。' }],
    rituals: [{ title: '破る紙の宣言', detail: '終わらせたい古いルールを書き、破ってから新しい選択を書く。' }, { title: '火のイメージ呼吸', detail: '胸の火を想像し、怒りを破壊ではなく前進の熱へ変える。' }, { title: '勝利後のごほうび予約', detail: '大きな行動の前に、終えた後の休みと楽しみを予定へ入れる。' }],
  },
  NDCR: {
    name: '深夜の星詠み', catchphrase: '見えない流れを読み、来るべき時を待つ。',
    description: '人生の背後には大きな筋書きがあり、出来事は水面下でつながっていると感じるタイプ。表面の言葉より夢、沈黙、繰り返すパターンから本質を読みます。すぐには理解されなくても、時間が経つほど洞察の深さが証明される人です。',
    tendencies: ['同じ夢や数字、会話の反復に意味を感じる', '人の隠れた動機や場の歴史まで想像する', '夜や一人の時間に、直感がはっきりする'],
    strength: '物事の深層を読む洞察力。誰も気づかないつながりから、未来の兆しを見つけます。',
    blindspot: '意味を深く探しすぎて、単なる偶然や疲れまで不吉な物語にしてしまうことがあります。',
    advice: 'サインを見つけたら、解釈は三日寝かせて現実の事実と照合を。直感が研ぎ澄まされ、恐れと区別できます。',
    matches: [{ code: 'PDCM', reason: '追い風の召喚士が、あなたの深い予感を現実の航路へ変えてくれます。' }, { code: 'NBCR', reason: '説明しなくても気配を察する二人。安心できる静けさを共有できます。' }],
    rituals: [{ title: '夢の断片ノート', detail: '起きた直後、意味づけせず色・人・場所だけを記録する。' }, { title: '三日ルール', detail: '強いサインを感じても結論は三日待ち、同じ兆しが続くかを見る。' }, { title: '夜の灯りをひとつに', detail: '眠る前は小さな灯りだけにして、情報ではなく内側の声を聞く。' }],
  },
};

const dimensionOrder: Dimension[] = ['outlook', 'fate', 'flow', 'agency'];
const _legacyTypeEntries = Object.entries(_legacyTypeResults);

function _legacyAxesForCode(code: string) {
  return dimensionOrder.map((dimension, index) => {
    const definition = axisDefinitions[dimension];
    return definition.positive.code === code[index] ? definition.positive : definition.negative;
  });
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ScoreKey[]>([]);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selectedCharacter = selectedCode ? currentTypeResults[selectedCode] : null;
  const selectedAxes = selectedCode ? currentAxesForCode(selectedCode) : [];

  useEffect(() => {
    if (started) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [started, step]);

  const needsTieBreak = answers.length >= currentQuestions.length && methodIsTied(answers);
  const activeQuestions = needsTieBreak ? [...currentQuestions, methodTieBreakQuestion] : currentQuestions;
  const completed = answers.length >= activeQuestions.length;
  const result = useMemo(() => {
    if (!completed) return null;
    const code = resultCode(answers);
    return { code, axes: currentAxesForCode(code), ...currentTypeResults[code] };
  }, [answers, completed]);

  function answer(value: ScoreKey) {
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
    setShareError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function shareResult() {
    if (!result) return;
    setShareError(false);
    const text = `私のスピタイプは「${result.name}」でした。\n${result.catchphrase}\n#スピタイプ診断`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'スピタイプ診断', text, url: window.location.href });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setShareError(true);
      setCopied(false);
    }
  }

  if (!started) {
    return (
      <main className="landing-shell">
        <header className="site-header">
          <a href="#top" className="brand" aria-label="スピタイプ診断 トップへ"><span className="brand-mark" aria-hidden="true">✧</span><span>SPIRIT TYPE</span></a>
          <nav aria-label="メインナビゲーション"><a href="#about">診断について</a><a href="#characters">24のキャラクター <ArrowRight size={14} aria-hidden="true" /></a></nav>
        </header>

        <section className="hero" id="top">
          <div className="hero-orbits" aria-hidden="true"><span /><span /><i>✦</i></div>
          <div className="hero-content">
            <p className="kicker">A LITTLE JOURNEY INTO YOURSELF</p>
            <h1><span>スピタイプ</span><span>診断<span className="title-star" aria-hidden="true">✧</span></span></h1>
            <p className="hero-tagline">あなたの中に、どんな物語がある？</p>
            <p className="hero-copy">偶然、運命、運の流れ、信じる力。<br />12の短い二択に答えると、<br className="mobile-break" />あなたを映す一枚に出会います。</p>
            <button className="primary-button" type="button" onClick={() => { setStarted(true); window.scrollTo({ top: 0 }); }}><span>自分のカードを見つける</span><ArrowRight aria-hidden="true" /></button>
            <span className="time-note">全12問 <i /> 約1分 <i /> 無料・登録不要</span>
          </div>
          <div className="hero-characters" aria-label="24の物語を描いたキャラクターカード">
            <span className="deck-note">TWENTY-FOUR STORIES, ONE OF YOU.</span>
            {['PBES', 'PBEI', 'PDEK'].map((code, index) => (
              <figure key={code} className={`hero-character character-${index + 1}`}>
                <div className="card-art"><img src={assetPath(`/types-tarot-v2/${code}.png`)} alt={currentTypeResults[code].name} fetchPriority={index === 1 ? 'high' : 'auto'} /></div>
                <figcaption><span>{['II', 'I', 'VII'][index]}</span>{currentTypeResults[code].name}</figcaption>
              </figure>
            ))}
            <span className="deck-bottom" aria-hidden="true">✧ &nbsp; THE INNER CONSTELLATION &nbsp; ✧</span>
          </div>
          <a className="hero-scroll" href="#about"><span>物語のはじまり</span><span aria-hidden="true">↓</span></a>
          <span className="hero-edition">THE SPIRIT TYPE COLLECTION — 01 / 24</span>
        </section>

        <section className="axis-preview" id="about" aria-labelledby="about-title">
          <div className="about-intro"><p className="kicker">01 — THE READING</p><h2 id="about-title">運命よりも、<br />あなたの<span>信じ方</span>を。</h2><p className="section-lead">同じ星を見ても、願うことは人それぞれ。<br />出来事の中に何を見つけ、どんな一歩を選ぶのか。<br />4つのまなざしから、あなたらしさを読み解きます。</p><p className="about-footnote">未来を予言する占いではなく、<br />自分を知るための小さな物語です。</p></div>
          <div className="preview-list">
            <div><span className="axis-symbol" aria-hidden="true">☼</span><div><span className="axis-index">I — OUTLOOK</span><h3>偶然に、何を見る？</h3><p>希望を見つける。兆しに備える。</p></div></div>
            <div><span className="axis-symbol" aria-hidden="true">✧</span><div><span className="axis-index">II — FATE</span><h3>未来は、どこへ続く？</h3><p>自分で選ぶ道。導かれてゆく道。</p></div></div>
            <div><span className="axis-symbol" aria-hidden="true">≈</span><div><span className="axis-index">III — FLOW</span><h3>運は、どう続く？</h3><p>勢いのまま続く。上がり下がりをめぐる。</p></div></div>
            <div><span className="axis-symbol" aria-hidden="true">☾</span><div><span className="axis-index">IV — POWER</span><h3>力は、どこに宿る？</h3><p>言葉。特別な場所。大切なアイテム。</p></div></div>
          </div>
        </section>

        <section className="type-teaser" id="characters" aria-labelledby="collection-title">
          <div className="teaser-heading"><div><p className="kicker">02 — THE COLLECTION</p><h2 id="collection-title">24の肖像。<br /><span>24通りの、あなたらしさ。</span></h2></div><p>気になる一枚を開いて、心当たりを探してみて。<br />どの物語にも、違う光と強さがあります。</p></div>
          <div className="character-grid">
            {currentTypeEntries.map(([code, type], index) => (
              <button className="character-tile" key={code} type="button" onClick={() => setSelectedCode(code)} aria-label={`${type.name}の詳細を見る`}>
                <div className="tile-image"><img src={assetPath(`/types-tarot-v2/${code}.png`)} alt={type.name} loading="lazy" width={384} height={512} /><span className="tile-number">{String(index + 1).padStart(2, '0')}</span></div>
                <div className="tile-caption"><span>{code}</span><h3>{type.name}</h3><p>{type.catchphrase}</p><span className="tile-more">もしかして自分かも？ <ArrowRight aria-hidden="true" /></span></div>
              </button>
            ))}
          </div>
          <Sheet open={Boolean(selectedCharacter)} onOpenChange={(open) => { if (!open) setSelectedCode(null); }}>
            <SheetContent side="bottom" className="character-sheet" showCloseButton={false}>
              {selectedCharacter && selectedCode && (
                <div className="character-sheet-inner">
                  <div className="sheet-image"><img src={assetPath(`/types-tarot-v2/${selectedCode}.png`)} alt={selectedCharacter.name} /></div>
                  <div className="sheet-copy">
                    <div className="sheet-topline"><span>SPIRIT TYPE — {selectedCode}</span><SheetClose className="sheet-close" aria-label="キャラクター詳細を閉じる">×</SheetClose></div>
                    <SheetTitle className="sheet-title">{selectedCharacter.name}</SheetTitle>
                    <p className="sheet-catch">{selectedCharacter.catchphrase}</p>
                    <SheetDescription className="sheet-description">{selectedCharacter.description}</SheetDescription>
                    <section className="sheet-axes" aria-labelledby="sheet-axes-title">
                      <div className="sheet-section-heading"><span>FOUR POINTS OF VIEW</span><h4 id="sheet-axes-title">このキャラをつくる、4つのまなざし</h4></div>
                      <div className="sheet-axis-list">
                        {selectedAxes.map((axis, index) => (
                          <div key={axis.code}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{axis.label}</strong>
                            <p>{axis.short}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                    <div className="sheet-aspects">
                      <div><span>THE LIGHT</span><h4>このキャラの光</h4><p>{selectedCharacter.strength}</p></div>
                      <div><span>THE SHADOW</span><h4>光のそばにある影</h4><p>{selectedCharacter.blindspot}</p></div>
                    </div>
                    <div className="sheet-message"><span aria-hidden="true">✧</span><div><strong>この物語が気になったあなたへ</strong><p>{selectedCharacter.advice}</p></div></div>
                    <div className="sheet-invitation"><p>これは、24枚のうちの一枚。<br />12の短い二択に答えて、本当のあなたを映すカードを見つけてみませんか。</p><button className="sheet-cta" type="button" onClick={() => { setSelectedCode(null); setStarted(true); window.scrollTo({ top: 0 }); }}><span>自分のカードを見つける</span><ArrowRight aria-hidden="true" /></button></div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </section>

        <section className="closing"><span className="closing-star" aria-hidden="true">✧</span><p className="kicker">YOUR STORY IS WAITING</p><h2>まだ知らない自分に、<br />会いにいこう。</h2><p>正解はありません。二つの答えから直感のまま。</p><button className="primary-button" type="button" onClick={() => { setStarted(true); window.scrollTo({ top: 0 }); }}><span>12の問いをはじめる</span><ArrowRight aria-hidden="true" /></button><span className="time-note">全12問 <i /> 約1分 <i /> 無料・登録不要</span></section>
        <footer><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">✧</span>SPIRIT TYPE</a><span>あなたの信じ方に、ひとつの物語を。</span><small>FOR SELF-DISCOVERY, WITH A LITTLE MAGIC.</small></footer>
      </main>
    );
  }

  if (result) {
    return (
      <main className="result-shell">
        <header className="quiz-header">
          <span className="brand"><span className="brand-mark" aria-hidden="true">✧</span>SPIRIT TYPE</span>
          <button className="text-button" type="button" onClick={restart}>トップへ戻る</button>
        </header>

        <section className="result-hero">
          <div className="result-character">
            <img src={assetPath(`/types-tarot-v2/${result.code}.png`)} alt={result.name} />
          </div>
          <div className="result-title"><p className="result-eyebrow">THE STORY WITHIN YOU</p><p className="result-prelude">あなたを映す、一枚。</p><div className="type-code">SPIRIT TYPE — {result.code}</div><h1 ref={headingRef} tabIndex={-1}>{result.name}</h1><p className="result-catch">{result.catchphrase}</p><a className="result-read" href="#your-story">あなたの物語を読む <span aria-hidden="true">↓</span></a></div>
        </section>

        <section className="result-detail" id="your-story">
          <div className="profile-intro">
            <span className="detail-label">CHARACTER PROFILE</span>
            <h2>その心に宿る、<br /><em>あなたらしさ。</em></h2>
            <p className="result-description">{result.description}</p>
            <ul className="tendency-list">
              {result.tendencies.map((tendency) => <li key={tendency}>{tendency}</li>)}
            </ul>
          </div>

          <div className="profile-balance">
            <div>
              <span className="detail-label">YOUR GIFT</span>
              <h3>あなたが灯す光</h3>
              <p>{result.strength}</p>
            </div>
            <div>
              <span className="detail-label">BLIND SPOT</span>
              <h3>光のそばにある影</h3>
              <p>{result.blindspot}</p>
            </div>
          </div>

          <div className="profile-advice">
            <span className="advice-mark">✦</span>
            <div>
              <span className="detail-label">MESSAGE FOR YOU</span>
              <h3>物語を進める、小さなヒント</h3>
              <p>{result.advice}</p>
            </div>
          </div>

          <div className="profile-section type-breakdown">
            <span className="detail-label">YOUR FOUR ELEMENTS</span>
            <h2>あなたをかたちづくる、<br /><em>4つのまなざし。</em></h2>
            <div className="result-axes">
              {result.axes.map((axis, index) => (
                <div key={axis.code}>
                  <span>0{index + 1}</span>
                  <strong>{axis.label}</strong>
                  <p>{axis.short}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section compatibility">
            <span className="detail-label"><Heart aria-hidden="true" /> SOUL CHEMISTRY</span>
            <h2>響きあう、<br /><em>ふたつの物語。</em></h2>
            <p className="section-lead">似た感性を分かち合ったり、違う視点をもらったり。あなたの世界を広げてくれそうな二人です。</p>
            <div className="match-list">
              {result.matches.map((match, index) => {
                const matchedType = currentTypeResults[match.code];
                return (
                  <div className="match-row" key={match.code}>
                    <div className="match-image">
                      <img src={assetPath(`/types-tarot-v2/${match.code}.png`)} alt={matchedType.name} loading="lazy" />
                      <span>0{index + 1}</span>
                    </div>
                    <div>
                      <small>TYPE / {match.code}</small>
                      <h3>{matchedType.name}</h3>
                      <p>{match.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="profile-section rituals">
            <span className="detail-label"><Sparkles aria-hidden="true" /> SPIRITUAL ACTIONS</span>
            <h2>日々に添える、<br /><em>小さな儀式。</em></h2>
            <div className="ritual-list">
              {result.rituals.map((ritual, index) => (
                <div key={ritual.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{ritual.title}</h3><p>{ritual.detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="result-actions">
            <p>YOUR OWN LITTLE STORY<br /><strong>{result.name}</strong></p>
            <button className="share-button" type="button" onClick={shareResult}>
              <Copy aria-hidden="true" />{copied ? 'コピーしました' : 'この一枚をシェアする'}
            </button>
            <p className="share-status" role="status">{shareError ? '共有できませんでした。もう一度お試しください。' : copied ? '結果をクリップボードにコピーしました。' : ''}</p>
            <button className="restart-button" type="button" onClick={restart}>
              <RotateCcw aria-hidden="true" />もう一度診断する
            </button>
          </div>
        </section>
      </main>
    );
  }

  const question = activeQuestions[step];
  const progress = (step / activeQuestions.length) * 100;

  return (
    <main className="quiz-shell">
      <header className="quiz-header">
        <button type="button" className="back-button" onClick={goBack} aria-label="前へ戻る"><ChevronLeft /></button>
        <span className="brand"><span className="brand-mark" aria-hidden="true">✧</span>SPIRIT TYPE</span>
        <span>{String(step + 1).padStart(2, '0')} / {activeQuestions.length}</span>
      </header>
      <div className="progress-track" role="progressbar" aria-label="回答の進み具合" aria-valuenow={step} aria-valuemin={0} aria-valuemax={activeQuestions.length}><span style={{ width: `${progress}%` }} /></div>

      <section className="question-stage" key={step}>
        <div className="question-visual">
          <img src={assetPath(question.image)} alt="" />
          <span>SCENE / {String(step + 1).padStart(2, '0')}</span>
        </div>
        <div className="question-reading"><div className="question-copy">
          <span className="question-number">Q.{String(step + 1).padStart(2, '0')} / FOLLOW YOUR INTUITION</span>
          <h1 ref={headingRef} tabIndex={-1}>{question.prompt}</h1>
          <p className="question-prompt">考え込まず、感覚的に近い方を選んでください。</p>
        </div>
        <div className="answer-list">
          {question.options.map((option, index) => (
            <button type="button" key={option.value} onClick={() => answer(option.value)}>
              <span>{String.fromCharCode(65 + index)}</span><strong>{option.label}</strong><ArrowRight aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="answer-note">正解はありません。直感のまま答えてください。</p></div>
      </section>
    </main>
  );
}
