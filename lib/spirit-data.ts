export type ScoreKey = 'P' | 'N' | 'B' | 'D' | 'C' | 'E' | 'K' | 'S' | 'I';

export type AxisResult = {
  code: ScoreKey;
  label: string;
  short: string;
};

export type Question = {
  image: string;
  prompt: string;
  options: { label: string; value: ScoreKey }[];
};

export type TypeResult = {
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

export const questions: Question[] = [
  { image: '/questions/q01-tarot.webp', prompt: 'レシートの合計が「1234円」。何のサイン？', options: [{ label: '幸運のサイン', value: 'P' }, { label: '注意のサイン', value: 'N' }] },
  { image: '/questions/q02-tarot.webp', prompt: '家を出た瞬間、雨がやんだ。今日は？', options: [{ label: '今日はツイてる', value: 'P' }, { label: 'また降りそう', value: 'N' }] },
  { image: '/questions/q03-tarot.webp', prompt: '行きたい店が臨時休業。どう思う？', options: [{ label: '別の良いことがありそう', value: 'P' }, { label: '今日は慎重に動こう', value: 'N' }] },
  { image: '/questions/q04-tarot.webp', prompt: '自分の10年後の未来は？', options: [{ label: '選択次第で変わる', value: 'B' }, { label: 'あらかじめ決まっている', value: 'D' }] },
  { image: '/questions/q05-tarot.webp', prompt: '「結婚は5年後」と占われた。どうする？', options: [{ label: '努力して未来を変える', value: 'B' }, { label: '5年後まで待つ', value: 'D' }] },
  { image: '/questions/q06-tarot.webp', prompt: '第一志望に落ちた。この先は？', options: [{ label: '次の選択で未来は変わる', value: 'B' }, { label: '別の道へ進む運命だった', value: 'D' }] },
  { image: '/questions/q07-tarot.webp', prompt: '競馬が的中。次のレースは？', options: [{ label: '勢いでまた当たる', value: 'C' }, { label: '反動で当たらない', value: 'E' }] },
  { image: '/questions/q08-tarot.webp', prompt: '仕事で3日連続ミス。明日は？', options: [{ label: 'またミスが続く', value: 'C' }, { label: 'そろそろうまくいく', value: 'E' }] },
  { image: '/questions/q09-tarot.webp', prompt: '人気ライブに3回連続当選。次は？', options: [{ label: '勢いでまた当たる', value: 'C' }, { label: '運を使ったから外れる', value: 'E' }] },
  { image: '/questions/q10-tarot.webp', prompt: '転職を成功させたい。どちらを選ぶ？', options: [{ label: '「理想の仕事に出会う」と唱える', value: 'K' }, { label: '仕事運で有名な神社へ行く', value: 'S' }] },
  { image: '/questions/q11-tarot.webp', prompt: '良い出会いがほしい。どちらを選ぶ？', options: [{ label: '縁結びで有名な神社へ行く', value: 'S' }, { label: '縁結びのお守りを持つ', value: 'I' }] },
  { image: '/questions/q12-tarot.webp', prompt: '宝くじを買った。どちらが当たりそう？', options: [{ label: '金運のお守りと一緒にしまう', value: 'I' }, { label: '「今回は当たる」と唱える', value: 'K' }] },
];

export const methodTieBreakQuestion: Question = {
  image: '/questions/q12-tarot.webp',
  prompt: '明日が人生の勝負の日。ひとつ選ぶなら？',
  options: [
    { label: '「絶対うまくいく」と唱える', value: 'K' },
    { label: 'パワースポットへ行く', value: 'S' },
    { label: '一番強いお守りを持つ', value: 'I' },
  ],
};

export const axisByCode: Record<ScoreKey, AxisResult> = {
  P: { code: 'P', label: '幸運を見つける', short: '出来事の中に、良い兆しを見つける' },
  N: { code: 'N', label: '警告に気づく', short: '小さな違和感を、未来への注意として受け取る' },
  B: { code: 'B', label: '未来を変える', short: 'これからの選択によって、未来は変えられる' },
  D: { code: 'D', label: '運命を信じる', short: '人生には、あらかじめ決められた流れがある' },
  C: { code: 'C', label: '勢いは続く', short: '良い流れも悪い流れも、そのまま連鎖していく' },
  E: { code: 'E', label: '運はめぐる', short: '運は上がり下がりを繰り返しながら巡っていく' },
  K: { code: 'K', label: '言葉の力', short: '祈りや歌など、言葉に宿る力を信じる' },
  S: { code: 'S', label: '場所の力', short: '神社や自然など、特別な場所の力を信じる' },
  I: { code: 'I', label: '物の力', short: 'お守りや石など、特別な物の力を信じる' },
};

type TypeSeed = { name: string; catchphrase: string; reason: string };

const seeds: Record<string, TypeSeed> = {
  PBEK: { name: '夜明けの祈り子', catchphrase: '祈るたび、未来に朝が来る。', reason: '幸運の兆しを信じ、未来は自分で変えられると考える。悪い運の次には良い運が来ると信じ、それを祈りの言葉で呼ぶタイプです。' },
  PBES: { name: '朝焼けの風乗り', catchphrase: '風向きが変われば、道も変わる。', reason: '幸運の兆しを信じ、未来を変えるため自分から動く。運が落ちたときは流れが変わる場所へ向かい、次の追い風を探すタイプです。' },
  PBEI: { name: '希望の錬金術師', catchphrase: '不運さえ、幸運の材料に。', reason: '幸運の兆しを信じ、選択によって逆境を好転させる。運には浮き沈みがあると考え、不運を幸運へ変える道具を使うタイプです。' },
  PBCK: { name: '幸運の歌姫', catchphrase: '喜びの歌が、次の福を呼ぶ。', reason: '良い兆しを見つけ、自分の行動で未来をさらに良くする。幸運は勢いに乗って続くと考え、歌と言葉でその流れを広げるタイプです。' },
  PBCS: { name: '天空の風使い', catchphrase: '追い風は、まだ止まらない。', reason: '良い兆しを見つけると、すぐ次の行動を選ぶ。幸運の勢いは続くと信じ、追い風を強く感じられる場所の力を借りるタイプです。' },
  PBCI: { name: '福鈴の魔法使い', catchphrase: '鈴の音ひとつ、福がまたひとつ。', reason: '幸運を見つけ、自分の選択で次の幸運へつなげる。同じ流れは続くと考え、鈴の力で幸運の連鎖を強めるタイプです。' },
  PDEK: { name: '月夜の詩人', catchphrase: 'すべての夜に、意味がある。', reason: '出来事には良い意味があり、未来には決められた流れがあると考える。運の波が再び上向く時を待ち、その巡りを詩にするタイプです。' },
  PDES: { name: '泉の占い師', catchphrase: '水面は、運命の時を知っている。', reason: '良い運命を信じ、決められた流れを受け入れる。運は波のように巡ると考え、その転換点を泉の水面で読むタイプです。' },
  PDEI: { name: '運命の時計師', catchphrase: 'その時は、きっと訪れる。', reason: '良い運命と定められた未来を信じる。運には決まった周期があると考え、その時を古時計で見極めるタイプです。' },
  PDCK: { name: '星告げの預言者', catchphrase: '星が示した幸運は続いていく。', reason: '明るい出来事を運命のしるしとして受け取り、その幸運は続くと信じる。星が定めた未来を予言の言葉で告げるタイプです。' },
  PDCS: { name: '朝日の巫女', catchphrase: '光の道を、まっすぐ進む。', reason: '良い運命はあらかじめ用意され、幸運の流れは続くと信じる。その道を示す朝日の差す聖域に仕えるタイプです。' },
  PDCI: { name: '星冠の王子', catchphrase: '幸運は、生まれた時からそばに。', reason: '生まれながらの良い運命と、続いていく幸運を信じる。それを授けられた星の冠で表すタイプです。' },
  NBEK: { name: '未来の祈祷師', catchphrase: '祈りで、未来の道を変える。', reason: '悪い兆しを警告として受け取り、未来は変えられると考える。悪い運の次に良い運が来るよう、祈りの言葉で進路を整えるタイプです。' },
  NBES: { name: '森の精霊', catchphrase: '森に還れば、流れは整う。', reason: '悪い兆しに気づくと、自分から安全な未来を選ぶ。運の波が上向くまで、心を整える森の力を借りるタイプです。' },
  NBEI: { name: '光傘の結界師', catchphrase: '雨の間だけ、光の中へ。', reason: '悪い兆しを警戒し、危険を避ける選択をする。運が上向くまで、光の傘で自分を守るタイプです。' },
  NBCK: { name: '厄断ちの陰陽師', catchphrase: '悪い流れは、ここで止める。', reason: '悪い兆しを警告として受け取り、未来は変えられると考える。続きそうな悪運を、呪文の力で止めるタイプです。' },
  NBCS: { name: '白瀧の仙人', catchphrase: '流れは、水の力で変えられる。', reason: '悪い兆しを感じると、自分から流れを変えようとする。悪運は放っておくと続くと考え、白い滝の力で清めるタイプです。' },
  NBCI: { name: '鏡の天女', catchphrase: '曇りなき鏡が、厄を返す。', reason: '悪い兆しを見逃さず、未来を変えるために動く。続きそうな悪運を、鏡の力で跳ね返すタイプです。' },
  NDEK: { name: '黄昏の神託者', catchphrase: '試練の終わりは、言葉が告げる。', reason: '悪い兆しから避けられない試練を読み取る。運には終わりと始まりがあると信じ、その時を神託の言葉で伝えるタイプです。' },
  NDES: { name: '嵐の灯台守', catchphrase: '嵐が過ぎるまで、灯りを守る。', reason: '悪い兆しを察しても、運命の流れは変えられないと考える。嵐が過ぎて運が上向くまで、灯台で静かに待つタイプです。' },
  NDEI: { name: '砂時計の守り人', catchphrase: '耐える時にも、終わりはある。', reason: '避けられない試練に備え、運が再び上向く時を待つ。その決められた時の流れを砂時計で見守るタイプです。' },
  NDCK: { name: '深夜の星詠み', catchphrase: '星は、続く運命を知っている。', reason: '悪い兆しを見逃さず、それを定められた運命の始まりと捉える。同じ流れが続く先を、星の言葉から読むタイプです。' },
  NDCS: { name: '霧峠の山伏', catchphrase: '霧の先にも、道は続く。', reason: '悪い兆しから、避けられない流れが続くと考える。その行き先を、気配が集まる霧の峠で見極めるタイプです。' },
  NDCI: { name: '黒水晶の賢者', catchphrase: '静かな石ほど、遠くを映す。', reason: '悪い兆しを定められた未来の一部と考え、その流れは続くと読む。黒水晶を通して先の異変を見抜くタイプです。' },
};

const blindspots: Record<string, string> = {
  P: '良い意味を探すあまり、現実的な注意を見落とすことがあります。',
  N: '兆しを深く読みすぎて、まだ起きていないことまで心配しがちです。',
  B: '未来を変えようと頑張りすぎて、休む時を逃すことがあります。',
  D: '運命を信じるあまり、必要な一歩まで先延ばしにすることがあります。',
  C: '流れが続くと思い込み、変化の合図を見逃すことがあります。',
  E: '反動を気にしすぎて、良い勢いまで自分で止めることがあります。',
};

const ritualSets: Record<'K' | 'S' | 'I', TypeResult['rituals']> = {
  K: [{ title: '朝のひとこと', detail: '今日叶えたいことを、短い言葉で一度だけ声にする。' }, { title: '言葉の書き換え', detail: '気になる出来事を、希望の残る一文に書き直す。' }, { title: '眠る前の感謝', detail: '今日の小さな幸運をひとつ言葉にする。' }],
  S: [{ title: 'お気に入りの場所', detail: '気持ちが整う場所へ行き、数分だけ静かに過ごす。' }, { title: '朝の光を浴びる', detail: '窓辺や外で朝の空気と光を受け取る。' }, { title: '道を変える散歩', detail: 'いつもと違う道を歩き、空気の変化を感じる。' }],
  I: [{ title: 'お守りを選ぶ', detail: '今日の自分を支える小物をひとつ持ち歩く。' }, { title: '道具を磨く', detail: '大切な物を丁寧に拭き、役目への感謝を伝える。' }, { title: '月夜の棚卸し', detail: '今の自分に不要な物をひとつ手放す。' }],
};

function flip(code: string, index: number, pair: [string, string]) {
  const chars = code.split('');
  chars[index] = chars[index] === pair[0] ? pair[1] : pair[0];
  return chars.join('');
}

export const typeResults: Record<string, TypeResult> = Object.fromEntries(
  Object.entries(seeds).map(([code, seed]) => {
    const axes = code.split('') as ScoreKey[];
    const method = code[3] as 'K' | 'S' | 'I';
    const outlookMatch = flip(code, 0, ['P', 'N']);
    const fateMatch = flip(code, 1, ['B', 'D']);
    return [code, {
      name: seed.name,
      catchphrase: seed.catchphrase,
      description: seed.reason,
      tendencies: axes.map((axis) => axisByCode[axis].short),
      strength: `${axisByCode[axes[0]].label}視点と${axisByCode[axes[1]].label}感覚をあわせ持ち、${axisByCode[method].label}を自分らしく使えること。`,
      blindspot: `${blindspots[code[0]]} ${blindspots[code[1]]} ${blindspots[code[2]]}`,
      advice: `迷ったときは「${axisByCode[method].label}」に戻ってみてください。あなたらしい運との付き合い方が見えてきます。`,
      matches: [
        { code: outlookMatch, reason: `${seed.name}が見つける${code[0] === 'P' ? '希望' : '注意のサイン'}に、${seeds[outlookMatch].name}の反対側の視点が加わります。同じ力の使い方をするため、違いを理解しながら補い合える相性です。` },
        { code: fateMatch, reason: `${seed.name}の${code[1] === 'B' ? '未来を動かす力' : '流れを受け入れる強さ'}を、${seeds[fateMatch].name}が別の角度から支えます。行動と受容のバランスを取り合える組み合わせです。` },
      ],
      rituals: ritualSets[method],
    }];
  }),
);

export const typeEntries = Object.entries(typeResults);

export function axesForCode(code: string) {
  return code.split('').map((axis) => axisByCode[axis as ScoreKey]);
}

export function methodIsTied(answers: ScoreKey[]) {
  const totals = { K: 0, S: 0, I: 0 };
  answers.forEach((answer) => {
    if (answer === 'K' || answer === 'S' || answer === 'I') totals[answer] += 1;
  });
  return totals.K === totals.S && totals.S === totals.I;
}

export function resultCode(answers: ScoreKey[]) {
  const total = (key: ScoreKey) => answers.filter((answer) => answer === key).length;
  const method = (['K', 'S', 'I'] as const).reduce((best, key) => total(key) > total(best) ? key : best);
  return `${total('P') > total('N') ? 'P' : 'N'}${total('B') > total('D') ? 'B' : 'D'}${total('C') > total('E') ? 'C' : 'E'}${method}`;
}
