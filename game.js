/* 小岛汉堡社 · 无依赖、离线运行 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const STORE = 'burger-island-v1';
  const ingredients = [
    { id:'beef', name:'炭烤牛肉', category:'savory', cost:5, price:0, tags:['meaty','smoky'], desc:'肉香浓郁，带着炭火的温暖。' },
    { id:'cheese', name:'阳光芝士', category:'savory', cost:2, price:0, tags:['rich','dairy'], desc:'金灿灿的浓郁奶香。' },
    { id:'lettuce', name:'脆脆生菜', category:'fresh', cost:1, price:0, tags:['fresh','green'], desc:'像草地一样清新，咬起来脆脆的。' },
    { id:'tomato', name:'小岛番茄', category:'fresh', cost:2, price:0, tags:['fresh','tangy'], desc:'红彤彤，酸甜多汁。' },
    { id:'pickle', name:'酸黄瓜', category:'fresh', cost:1, price:0, tags:['tangy','crunchy'], desc:'酸酸的、脆脆的，唤醒味蕾。' },
    { id:'sauce', name:'招牌酱汁', category:'savory', cost:1, price:0, tags:['rich','tangy'], desc:'岛上秘制，浓郁又带一点酸。' },
    { id:'chicken', name:'酥脆鸡排', category:'savory', cost:5, price:95, tags:['meaty','crunchy'], desc:'金黄酥脆，会发出咔嚓声。' },
    { id:'bacon', name:'烟熏培根', category:'savory', cost:4, price:130, tags:['smoky','meaty'], desc:'烟熏咸香，像刚结束一场野餐。' },
    { id:'onion', name:'紫洋葱圈', category:'fresh', cost:2, price:80, tags:['sharp','crunchy'], desc:'紫色小圆圈，辛香又清脆。' },
    { id:'cream', name:'云朵奶油', category:'secret', cost:3, price:160, tags:['sweet','dairy'], desc:'白白软软，像一朵甜蜜的云。' },
    { id:'jam', name:'草莓星星酱', category:'secret', cost:3, price:180, tags:['sweet','berry','tangy'], desc:'把粉红色的果园装进汉堡。' },
    { id:'pineapple', name:'太阳菠萝', category:'secret', cost:3, price:120, tags:['sweet','tropical','tangy'], desc:'热带太阳的味道，甜中带酸。' },
    { id:'egg', name:'溏心煎蛋', category:'savory', cost:3, price:110, tags:['rich','soft'], desc:'流心的金色小太阳，柔软浓郁。' },
    { id:'mushroom', name:'森林蘑菇', category:'secret', cost:3, price:150, tags:['earthy','soft'], desc:'雨后森林的香气，软嫩又特别。' },
    { id:'chili', name:'火花辣椒', category:'secret', cost:2, price:140, tags:['spicy','sharp'], desc:'一小簇火花，舌尖上的冒险。' },
    { id:'icecream', name:'香草冰淇淋', category:'secret', cost:4, price:230, tags:['sweet','cold','dairy'], desc:'凉凉的、甜甜的，夏日限定的魔法。' },
    { id:'edamame', name:'毛豆肉饼', category:'secret', cost:5, price:170, tags:['green','meaty','earthy'], desc:'毛豆变成绿色小肉饼，头顶两片豆荚耳朵，清香又扎实。', cook:true },
    { id:'milkfrog', name:'奶蛙肉饼', category:'secret', cost:5, price:190, tags:['dairy','meaty','soft'], desc:'奶白色蛙蛙造型肉饼，煎出金边，奶香里有点荒诞。', cook:true }
  ];
  const byId = Object.fromEntries(ingredients.map(i => [i.id,i]));
  const baseIds = ingredients.filter(i => !i.price).map(i => i.id);
  const days = [
    {name:'初来小岛', guests:5, goal:4, time:110, reward:65, desc:'先把经典汉堡做好，让小岛认识你。'},
    {name:'海风与野餐', guests:6, goal:4, time:100, reward:85, desc:'客人开始用心情描述他们的口味。'},
    {name:'午后奇想', guests:6, goal:5, time:90, reward:110, desc:'甜口配料登场，想象力也是食材。'},
    {name:'日落小食堂', guests:7, goal:5, time:85, reward:130, desc:'把日落、森林和火花夹进面包。'},
    {name:'小岛美食节', guests:8, goal:6, time:80, reward:155, desc:'每一份期待都值得认真对待。'},
    {name:'星光夜市', guests:8, goal:6, time:75, reward:180, desc:'夜色里的客人，有一点挑剔。'},
    {name:'奇妙研究所', guests:9, goal:7, time:70, reward:210, desc:'让不可能的组合变成招牌。'},
    {name:'小岛汉堡大师', guests:10, goal:8, time:65, reward:260, desc:'最后一天挑战，给每种心情一个答案。'}
  ];
  const people = [
    ['小葵','今天也想晒太阳','girl','#e8bd72'],['阿海','刚冲完浪的邻居','boy','#88b6bc'],['米米','爱做梦的插画师','girl','#be9ec1'],['老林','海边散步的常客','old','#a4b785'],['桃桃','甜食探险家','girl','#e4a1a3'],['阿栗','骑车环岛中','boy','#d6ac85'],['圆圆','小岛美食观察员','cat','#e9c488'],['露露','晚风里的旅行者','girl','#9aacce'],['布鲁','认真吃饭的熊先生','bear','#b4977c'],['小麦','忙碌的花店店主','boy','#99b28e']
  ];
  const flavorOrders = [
    {quote:'今天想吃点像夏天的草地一样清爽的。绿绿的、红红的，肉就先不要啦。', required:['lettuce','tomato'], banned:['meaty'], hint:'草地是生菜，红红的多汁果实是番茄。不要牛肉、鸡排或培根。', minDay:0},
    {quote:'肚子饿得咕咕叫！想要炭火的香味，再盖一床金黄色的小被子。', required:['beef','cheese'], hint:'炭火香来自牛肉，金黄色的小被子是芝士。', minDay:0},
    {quote:'给我一点酸酸脆脆的惊喜，加上绿叶就好。今天想吃轻盈一点。', required:['pickle','lettuce'], banned:['meaty'], hint:'酸酸脆脆的是酸黄瓜，绿叶是生菜，不要放肉。', minDay:0},
    {quote:'我想把烧烤和菜园一起带走：一块肉，一点绿色，再来红红的汁水。', required:['beef','lettuce','tomato'], hint:'牛肉、生菜、番茄，是烧烤和菜园的组合。', minDay:0},
    {quote:'一口下去想听到咔嚓声！要金黄的那一块，再配酸酸的绿色小片。', required:['chicken','pickle'], hint:'金黄咔嚓的是酥脆鸡排，酸酸的小片是酸黄瓜。', minDay:1},
    {quote:'想念露营时的烟火气。放上条纹小毯子，再铺点奶香的金色吧。', required:['bacon','cheese'], hint:'条纹小毯子是烟熏培根，金色奶香是芝士。', minDay:1},
    {quote:'想吃紫色的小圈圈和多汁的红色，再一点绿。今天是素食日哦。', required:['onion','tomato','lettuce'], banned:['meaty'], hint:'紫洋葱、番茄和生菜，别放肉。', minDay:1},
    {quote:'我想把下午茶夹进汉堡。要白白软软的云，还有粉红果园的甜。不要肉哦。', required:['cream','jam'], banned:['meaty'], hint:'白云是奶油，粉红果园是草莓酱。这份是甜点汉堡。', minDay:2},
    {quote:'想让舌头去热带度假！圆圆的太阳搭着烟熏小毯子，咸甜交错最棒了。', required:['pineapple','bacon'], hint:'热带太阳是菠萝，烟熏小毯子是培根。', minDay:2},
    {quote:'我想吃一个能流出金色阳光的汉堡，旁边再种两片绿叶。', required:['egg','lettuce'], hint:'流心的金色阳光是煎蛋，绿叶是生菜。', minDay:2},
    {quote:'想尝尝雨后森林。软嫩的小伞、奶香的被子，再来点绿色，不要肉。', required:['mushroom','cheese','lettuce'], banned:['meaty'], hint:'小伞是蘑菇，奶香被子是芝士，加上生菜。', minDay:3},
    {quote:'今天需要一点勇气！要炭烤香，还要舌尖上冒火花。加酸脆的小片缓一缓。', required:['beef','chili','pickle'], hint:'牛肉、辣椒、酸黄瓜。小火花就是辣椒。', minDay:3},
    {quote:'做一份冷冷的草莓云朵好吗？想用汉堡假装吃冰淇淋蛋糕，肉和辣椒都不要。', required:['icecream','jam','cream'], banned:['meaty','spicy'], hint:'冰淇淋、草莓酱和奶油，是这份冷冷的甜点。', minDay:4},
    {quote:'森林里的小太阳醒了，旁边有紫色的圈圈。要软软的口感，不用肉。', required:['mushroom','egg','onion'], banned:['meaty'], hint:'森林是蘑菇，小太阳是煎蛋，紫圈是洋葱。', minDay:4},
    {quote:'来点反差感！草莓的甜拥抱炭火肉香，再让白云轻轻落在上面。', required:['beef','jam','cream'], hint:'牛肉、草莓酱、奶油。没错，这就是大胆的咸甜组合。', minDay:5},
    {quote:'海岛火山的味道：热带的太阳、红色小火花和金黄咔嚓声，都来一点！', required:['pineapple','chili','chicken'], hint:'菠萝、辣椒和鸡排，酸甜辣脆的冒险。', minDay:5}
    ,{quote:'想要绿油油的豆荚小精灵！把毛豆变成热乎乎的肉饼，再披一层金色披风。',required:['edamame','cheese'],hint:'先把毛豆肉饼拖上煎台，煎熟后拖到汉堡，再加入芝士。',minDay:2}
    ,{quote:'来一只白白软软的奶蛙吧。要先煎得香香的，旁边放一片脆脆的绿叶。',required:['milkfrog','lettuce'],hint:'奶蛙肉饼需要先煎熟，搭配生菜。',minDay:3}
    ,{quote:'森林里遇见毛豆精灵和奶蛙！两块奇妙肉饼都要热乎乎的，再撒一点森林香气。',required:['edamame','milkfrog','mushroom'],hint:'毛豆肉饼和奶蛙肉饼都要逐一煎熟，再搭配蘑菇。',minDay:5}
  ];
  const upgrades = [
    {id:'patience',name:'舒适等餐区',icon:'☂',desc:'每级增加 15 秒等餐时间',base:95,max:3},
    {id:'tips',name:'闪亮小招牌',icon:'✦',desc:'每级增加 20% 满意订单小费',base:120,max:3},
    {id:'slots',name:'高高汉堡架',icon:'▥',desc:'每级多容纳 2 层配料',base:100,max:2}
  ];
  const freshSave = () => ({money:80,unlocked:[...baseIds],upgrades:{patience:0,tips:0,slots:0},day:0,stars:{},best:0,served:0,earned:0,collection:[],seen:false,sound:false});
  let save = freshSave(), storageOK = true;
  try { const raw = localStorage.getItem(STORE); if(raw){const s=JSON.parse(raw);save={...save,...s,upgrades:{...save.upgrades,...s.upgrades}}; save.unlocked=[...new Set([...baseIds,...save.unlocked.filter(id=>byId[id])])];save.day=Math.max(0,Math.min(7,Number(save.day)||0));save.money=Math.max(0,Number(save.money)||0);}} catch { storageOK=false; }
  const state = {mode:'story',day:save.day,guest:0,good:0,revenue:0,scores:[],rep:3,stack:[],cooked:[],grill:null,capped:false,order:null,remaining:0,total:0,category:'all',paused:false,ended:false,modal:null,last:performance.now(),lastOrder:null,free:false};
  let toastTimer, audio, lastFocus;
  const svg = (content, view='0 0 200 50') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" aria-hidden="true">${content}</svg>`;
  function food(id, variant='cooked') {
    const line='stroke="#8b5b35" stroke-width="2.5" stroke-linejoin="round"';
    const art={
      top:`<path d="M10 47C10-6 190-6 190 47Q100 57 10 47Z" fill="#eda74e" ${line}/><path d="M19 34C36 0 165 0 182 35" fill="none" stroke="#ffd385" stroke-width="8" stroke-linecap="round"/><path d="m50 22 7-3m28-5 7 2m26 3 7-2m21 10 7 2m-54 6 6-2" stroke="#fff1c2" stroke-width="4" stroke-linecap="round"/><path d="M12 43q88 13 176 0" stroke="#c67c32" stroke-width="4" fill="none"/>`,
      bottom:`<path d="M11 10Q100 2 189 10L186 34Q100 51 14 34Z" fill="#e5a052" ${line}/><path d="M17 19q80 10 165 0" stroke="#f8c271" stroke-width="8" fill="none"/><path d="M24 34q76 12 151 0" stroke="#bd7a39" stroke-width="3" fill="none"/>`,
      beef:`<path d="M7 19Q15 9 28 15Q45 6 63 12Q86 4 108 11Q134 5 148 13Q178 6 192 19L189 36Q177 46 155 40Q138 47 114 40Q83 48 61 40Q28 45 10 36Z" fill="#88513d" stroke="#593d2e" stroke-width="3"/><path d="M16 20q65-12 169 0" stroke="#b87650" stroke-width="5" fill="none" stroke-linecap="round"/><path d="m31 25 8 5m27-9 9 5m37-4 9 5m35-5 9 5" stroke="#5f3a2b" stroke-width="3" stroke-linecap="round"/>`,
      cheese:`<path d="m5 14 48-6 51 6 57-5 34 7-17 17-43-3-21 18-35-15-38 4Z" fill="#f5c94f" stroke="#c89832" stroke-width="2"/><path d="m18 16 41-2 41 7 53-7 26 5" fill="none" stroke="#ffe88b" stroke-width="4"/>`,
      lettuce:`<path d="M3 24Q0 9 21 15Q28 1 45 12Q58-1 73 12Q92-2 108 13Q125-2 142 13Q160 3 175 14Q201 5 198 25Q201 40 177 34Q159 47 143 34Q124 46 105 34Q85 48 69 34Q46 45 32 32Q11 42 3 24Z" fill="#87ad5c" stroke="#5e853f" stroke-width="2.5"/><path d="M14 24q14-11 28 0t30 0t30 0t31 0t29 0t25 0" stroke="#b5d180" stroke-width="4" fill="none"/>`,
      tomato:`<ellipse cx="62" cy="25" rx="53" ry="18" fill="#e76e54" stroke="#b94c39" stroke-width="2.5"/><ellipse cx="139" cy="25" rx="53" ry="18" fill="#eb7657" stroke="#b94c39" stroke-width="2.5"/><ellipse cx="62" cy="22" rx="42" ry="11" fill="#f39272"/><ellipse cx="139" cy="22" rx="42" ry="11" fill="#f39272"/><path d="m35 21 9-3m24 8 9-3m39-3 8-3m26 9 9-3" stroke="#ffd5a3" stroke-width="3" stroke-linecap="round"/>`,
      pickle:`<ellipse cx="47" cy="26" rx="35" ry="15" fill="#74984e" stroke="#4e7539" stroke-width="2"/><ellipse cx="104" cy="22" rx="36" ry="15" fill="#a3b866" stroke="#5e843e" stroke-width="3"/><ellipse cx="157" cy="28" rx="31" ry="14" fill="#8aaa58" stroke="#56783b" stroke-width="2"/><path d="m30 25h25m31-4h33m26 6h24" stroke="#d3d99a" stroke-width="3" stroke-linecap="round"/><path d="m97 12v19m-57-15v21m112-19v19" stroke="#c9d28e" stroke-width="2"/>`,
      sauce:`<path d="M8 25q9-14 23-2t27-3t29 3t28-2t30 0t25-3t21 6" stroke="#d58b4c" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M13 22q8-7 16 1t27-3t31 3t29-2t27 0t24-3t18 5" stroke="#ecae6b" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      chicken:`<path d="M7 24 15 13 31 16 43 7 61 13 76 7 94 12 116 6 131 14 151 8 166 15 184 13 194 25 187 39 167 38 149 44 125 38 106 44 80 38 60 43 39 37 18 39Z" fill="#dba246" stroke="#b57930" stroke-width="2.5"/><path d="m23 23 7 4m18-11 6 5m17 9 7-3m19-10 7 5m20 9 8-3m17-10 5 5m18-3 8 5" stroke="#ffcf71" stroke-width="5" stroke-linecap="round"/>`,
      bacon:`<path d="M8 18 41 9 76 18 109 9 149 18 189 10 193 34 152 43 112 34 78 43 41 34 12 41Z" fill="#c87665" stroke="#94503e" stroke-width="2.5"/><path d="m12 25 29-9 36 9 33-9 40 9 39-9m-175 19 27-8 38 9 31-9 42 9 35-9" stroke="#f0b59a" stroke-width="5" fill="none"/>`,
      onion:`<g fill="#dbc2d8" stroke="#9d7098" stroke-width="3"><ellipse cx="49" cy="25" rx="36" ry="15"/><ellipse cx="111" cy="23" rx="37" ry="15"/><ellipse cx="161" cy="29" rx="29" ry="12"/></g><g fill="#f5eadc" stroke="#b68aaf" stroke-width="2"><ellipse cx="49" cy="25" rx="24" ry="8"/><ellipse cx="111" cy="23" rx="24" ry="8"/><ellipse cx="161" cy="29" rx="18" ry="6"/></g>`,
      cream:`<path d="M8 38Q6 25 24 22Q23 7 44 13Q52-3 68 12Q87-1 103 12Q116-2 134 13Q156 4 166 21Q190 16 193 37Q100 52 8 38Z" fill="#fff6e1" stroke="#d6bd91" stroke-width="2.5"/><path d="M28 33q14-12 28-1t28-2t31 0t27-1t31 2" stroke="#efdfbc" stroke-width="3" fill="none"/>`,
      jam:`<path d="M8 22Q23 6 39 18Q60 4 77 16Q99 6 116 17Q138 5 155 18Q177 7 192 24L188 32Q168 39 150 30Q128 37 111 31Q85 40 63 31Q30 40 10 31Z" fill="#d96378" stroke="#ac4559" stroke-width="2.5"/><path d="m31 22 9-3m34 4 7-3m48 2 7-3m31 4 8-3" stroke="#f5b0b2" stroke-width="3" stroke-linecap="round"/>`,
      pineapple:`<ellipse cx="100" cy="26" rx="90" ry="20" fill="#f1c65b" stroke="#c79737" stroke-width="2.5"/><ellipse cx="100" cy="23" rx="25" ry="8" fill="#f4ead7" stroke="#dcad46" stroke-width="3"/><path d="m35 20 14 5m11-11 10 7m64-5-11 6m39-4-14 8m-94 9 12-7m64 8-12-7" stroke="#ffe395" stroke-width="4"/>`,
      egg:`<path d="M8 29Q2 13 30 14Q45-2 69 9Q88 2 108 10Q129-3 150 11Q175 5 185 23Q201 37 177 42Q157 49 131 41Q106 50 82 42Q53 50 35 40Q12 46 8 29Z" fill="#fff5d7" stroke="#d9bb82" stroke-width="2.5"/><ellipse cx="102" cy="24" rx="30" ry="17" fill="#efb43d" stroke="#d5932c" stroke-width="2"/><path d="M85 19q12-10 24-1" stroke="#ffe48f" stroke-width="5" stroke-linecap="round" fill="none"/>`,
      mushroom:`<g fill="#b68a68" stroke="#80604c" stroke-width="2.5"><path d="M12 25q0-27 47-18q19 4 20 18H12Z"/><path d="M84 26q0-29 48-19q19 4 21 19H84Z"/><path d="M144 31q0-24 35-17q14 3 16 17H144Z"/></g><g fill="#efdcba" stroke="#aa8660" stroke-width="2"><path d="M35 24h20l5 16H30Z"/><path d="M107 25h20l5 17h-31Z"/><path d="M162 30h14l4 13h-22Z"/></g><path d="m27 16 12-3m66 4 10-3m46 8 9-2" stroke="#d9b68e" stroke-width="3" stroke-linecap="round"/>`,
      chili:`<g fill="#d55842" stroke="#a74231" stroke-width="2"><path d="M15 15q30-12 54 3q-11 29-50 18q23-2 24-13q-17 4-28-8Z"/><path d="M80 13q29-12 53 3q-11 29-50 18q23-2 24-13q-17 4-27-8Z"/><path d="M144 16q25-10 45 2q-9 26-43 16q21-2 22-11q-15 3-24-7Z"/></g><path d="m17 15-6-8m71 6-6-7m70 10-6-8" stroke="#67864e" stroke-width="5" stroke-linecap="round"/>`,
      icecream:`<path d="M15 41q-10-17 10-27q9-18 28-5q15-12 28 0q18-16 34-1q19-14 34 2q24-13 32 9q20 11 7 24Z" fill="#f7eacc" stroke="#c9b797" stroke-width="2.5"/><path d="M29 25q8-13 21-7m40 8q12-13 25-6m33 6q10-13 22-6" stroke="#fffaf0" stroke-width="6" stroke-linecap="round" fill="none"/>`
      ,edamame:`<path d="M8 22q10-11 23-7 22-13 44-5 19-9 38 0 25-9 46 4 18-2 32 10l-5 12q-25 10-43 5-25 9-46 2-22 6-43-1-24 7-44-8Z" fill="#78a158" stroke="#486938" stroke-width="3"/><path d="M20 22q74-18 162 0" stroke="#b1c781" stroke-width="4" fill="none"/><path d="M43 24q6-9 12 0m35-5q8-8 15 0m36 5q8-9 17 0" fill="none" stroke="#d6e6ad" stroke-width="4" stroke-linecap="round"/><path d="m30 16-9-13q20-5 22 12m113-1 13-13q12 12-2 20" fill="#8fbd69" stroke="#476838" stroke-width="2"/>`,
      milkfrog:`<path d="M7 26q8-14 27-13 15-9 33-4 22-10 39 0 22-8 44 5 30-3 43 13l-8 12q-21 8-41 3-25 8-46 1-23 6-47 0-27 6-42-5Z" fill="#e9d9ad" stroke="#9a825a" stroke-width="3"/><path d="M15 24q80-20 172 1" stroke="#fff7df" stroke-width="5" fill="none"/><circle cx="55" cy="14" r="10" fill="#f8ebc9" stroke="#a58e66" stroke-width="2"/><circle cx="147" cy="14" r="10" fill="#f8ebc9" stroke="#a58e66" stroke-width="2"/><circle cx="55" cy="13" r="2" fill="#786551"/><circle cx="147" cy="13" r="2" fill="#786551"/><path d="M86 29q14 9 28 0" fill="none" stroke="#9c805e" stroke-width="2"/>`
    };
    // 每片食材使用独立渐变、边缘明暗和细密纹理，保留清晰的卡通轮廓。
    const palette={top:['#ffe0a0','#eaaa51','#b96928'],bottom:['#f8cc83','#e4a05b','#af652c'],beef:['#ba7951','#76452e','#42291f'],cheese:['#fff198','#f5c443','#d49225'],lettuce:['#c2dd88','#83ad56','#4d7939'],tomato:['#ffa78b','#e56b50','#b63d30'],pickle:['#c4d28a','#8fa957','#567734'],sauce:['#ffc47b','#d98b47','#a65d29'],chicken:['#ffe097','#d9a047','#a65d25'],bacon:['#efac8b','#c5725b','#864130'],onion:['#edd5e7','#bd91b6','#8e618b'],cream:['#fffef5','#fff0d4','#dcc69f'],jam:['#f9a0ae','#d75b76','#963449'],pineapple:['#fff2a0','#f1c451','#cb8f26'],egg:['#fffdf0','#fff1cd','#dcc395'],mushroom:['#d6b28c','#ab805d','#71503b'],chili:['#fa9c74','#d75b40','#a13228'],icecream:['#fffef5','#f4e6c7','#d5be96'],edamame:['#c5dc85','#78a352','#3e6034'],milkfrog:['#fff9d9','#e3d1a4','#9a7b4f']};
    const rawPalette={beef:['#f3b6a5','#c67d71','#99594e'],chicken:['#ffe9d1','#e5c2a0','#ba9879'],bacon:['#f7b8a7','#dc8e87','#a86662'],edamame:['#d9e8b5','#a5c581','#729958'],milkfrog:['#fff8e5','#f1e2c5','#cfbda1']};
    const colors=variant==='raw'&&rawPalette[id]?rawPalette[id]:palette[id]||palette.beef;
    let shape=art[id]||art.beef;
    const fills={top:'#eda74e',bottom:'#e5a052',beef:'#88513d',cheese:'#f5c94f',lettuce:'#87ad5c',tomato:'#e76e54',pickle:'#74984e',chicken:'#dba246',bacon:'#c87665',onion:'#dbc2d8',cream:'#fff6e1',jam:'#d96378',pineapple:'#f1c65b',egg:'#fff5d7',mushroom:'#b68a68',chili:'#d55842',icecream:'#f7eacc',edamame:'#78a158',milkfrog:'#e9d9ad'};
    const key='food-'+id+'-'+variant;
    if(fills[id])shape=shape.split(`fill="${fills[id]}"`).join(`fill="url(#${key}-body)"`);
    if(id==='sauce')shape=shape.replace('stroke="#d58b4c"',`stroke="url(#${key}-body)"`);
    shape=shape.replace(/stroke-width="2\.5"/g,'stroke-width="1.4"').replace(/stroke-width="3"/g,'stroke-width="1.8"');
    let texture='';
    if(id==='top'){
      texture='<path d="M20 36Q100 50 180 36" stroke="#ffe7ae" stroke-width="2" fill="none" opacity=".55"/>';
      for(let i=0;i<24;i++){const x=27+(i*37%148),y=12+(i*17%27);if(Math.abs(x-100)/83+y/55<1.4)texture+=`<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.1" transform="rotate(${i*31%110-55} ${x} ${y})" fill="#fff0ba" stroke="#c29253" stroke-width=".45"/>`;}
    }
    if(variant==='cooked'&&['beef','chicken','bacon','edamame','milkfrog'].includes(id)){
      for(let i=0;i<48;i++){const x=16+(i*47%169),y=16+(i*23%22);texture+=`<ellipse cx="${x}" cy="${y}" rx="${i%3+1}" ry=".8" fill="${i%2?'#ffe0a0':'#3c251a'}" opacity="${id==='beef'?'.25':'.38'}"/>`;}
    if(variant==='cooked'&&(id==='beef'||id==='edamame'||id==='milkfrog'))texture+='<path d="m35 15 9 21m34-24 9 24m35-24 9 24m35-22 8 21" stroke="#3e281f" stroke-width="3" opacity=".22" stroke-linecap="round"/>';
    }
    if(id==='jam'||id==='tomato')texture='<path d="M23 20q10-6 19-3m75 1q12-5 23-2" fill="none" stroke="#ffe1cc" stroke-width="2" opacity=".8" stroke-linecap="round"/>';
    if(id==='cheese')texture='<path d="m25 18 27-2 25 5" fill="none" stroke="#fff8bc" stroke-width="2" opacity=".8"/><path d="m113 25-1 13" stroke="#c58b23" stroke-width="1" opacity=".4"/>';
    if(id==='cheese')texture+='<path d="M61 28q3 6 3 14q3 6 7 0l4-11m65-8q2 9 3 14q4 8 8-1l3-9" fill="#f1b62c" stroke="#d89a27" stroke-width="1.2"/>';
    if(id==='sauce'||id==='jam')texture+='<path d="M35 29q-1 9 4 10q5 0 3-11m91 1q-2 12 3 13q4-1 4-14" stroke="'+(id==='jam'?'#c54c66':'#c97b3b')+'" stroke-width="5" fill="none" stroke-linecap="round"/>';
    if(id==='cream'||id==='icecream')texture='<path d="M37 30q10-10 19-4m37 0q12-11 22-4m35 4q10-8 19-1" stroke="#ffffff" stroke-width="3" opacity=".7" fill="none" stroke-linecap="round"/>';
    const defs=`<defs><linearGradient id="${key}-body" x1="0" y1="0" x2=".12" y2="1"><stop offset="0" stop-color="${colors[0]}"/><stop offset=".48" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient></defs>`;
    const depth=id==='top'?'<path d="M11 43q89 17 178 0l-2 6Q100 64 13 49Z" fill="#9c552b" opacity=".55"/>':id==='bottom'?'<path d="M13 26q88 30 175 0l-3 10Q100 58 15 36Z" fill="#9a5d32" opacity=".33"/>':'';
    return svg(defs+depth+shape+texture,id==='top'?'0 0 200 58':'0 0 200 50');
  }
  function fullBurger(ids=['lettuce','beef','cheese','tomato']) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" aria-hidden="true">${food('bottom').replace('<svg ','<svg x="10" y="135" width="200" height="30" ')}${ids.map((id,i)=>food(id).replace('<svg ',`<svg x="10" y="${120-i*19}" width="200" height="30" `)).join('')}${food('top').replace('<svg ','<svg x="10" y="26" width="200" height="63" ')}</svg>`;
  }
  function avatar(person) {
    const type=person[2]; const color=person[3];
    if(type==='cat'||type==='bear')return svg(`<circle cx="40" cy="42" r="24" fill="${color}"/><${type==='cat'?'path d="M18 31 14 9 33 23M48 23 65 9 63 33"':'path d="M21 26a12 12 0 1 1 9-13M51 15a12 12 0 1 1 8 13"'} fill="${color}" stroke="#755b44" stroke-width="2"/><ellipse cx="40" cy="65" rx="31" ry="17" fill="#79917a"/><ellipse cx="40" cy="48" rx="13" ry="10" fill="#fff0d6"/><circle cx="29" cy="37" r="2.5" fill="#544335"/><circle cx="51" cy="37" r="2.5" fill="#544335"/><path d="m37 45 3 3 3-3m-3 3v4m-8 0q8 8 16 0" fill="none" stroke="#544335" stroke-width="2" stroke-linecap="round"/>`,'0 0 80 80');
    return svg(`<rect width="80" height="80" fill="${color}"/><ellipse cx="40" cy="79" rx="30" ry="23" fill="${type==='old'?'#9b9b74':'#fcf0db'}"/><path d="M17 40Q13 6 40 8Q68 8 63 45" fill="${type==='old'?'#d5d1bf':'#69503c'}"/><ellipse cx="40" cy="40" rx="23" ry="25" fill="#f1cca7"/>${type==='girl'?'<path d="M18 30Q20 9 44 14q9 1 19 19q-16-1-23-15q-4 15-22 16" fill="#69503c"/><path d="M17 34v28m46-28v29" stroke="#69503c" stroke-width="8" stroke-linecap="round"/><path d="m58 23 9-8 5 10-10 4" fill="#d87969"/>':type==='old'?'<path d="M18 27q2-21 24-16q15 0 21 19q-18-8-23-15q-6 10-22 12" fill="#d5d1bf"/><path d="M30 51q10 10 20 0q-3 16-10 12q-8 3-10-12" fill="#e7e2d1"/><g fill="none" stroke="#665645" stroke-width="2"><circle cx="29" cy="36" r="7"/><circle cx="51" cy="36" r="7"/><path d="M36 36h8"/></g>':'<path d="M16 30q0-24 27-19q17 0 21 23q-15-1-23-15q-9 13-25 11" fill="#69503c"/>'}<circle cx="29" cy="37" r="2" fill="#534231"/><circle cx="51" cy="37" r="2" fill="#534231"/><ellipse cx="24" cy="45" rx="5" ry="3" fill="#eab19d"/><ellipse cx="56" cy="45" rx="5" ry="3" fill="#eab19d"/><path d="M34 48q6 7 12 0" fill="none" stroke="#9a664e" stroke-width="2" stroke-linecap="round"/>`,'0 0 80 80');
  }
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(save));}catch{storageOK=false;}updateWallet();}
  function updateWallet(){ $('money').textContent=save.money; $('shop-dot').hidden=!ingredients.some(i=>i.price && !save.unlocked.includes(i.id)&&save.money>=i.price); }
  function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2600);}
  function playSound(kind='add') {
    if(!save.sound)return;
    try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume(); const notes=kind==='success'?[523,659,784]:kind==='bad'?[220,165]:kind==='coin'?[784,1047]:[440+state.stack.length*35];notes.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(audio.destination);const t=audio.currentTime+i*.11;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.18);o.start(t);o.stop(t+.2);});}catch{/* 浏览器不支持音效时继续游戏。 */}
  }
  function openModal(kind,html){lastFocus=document.activeElement;state.modal=kind;$('modal-content').innerHTML=html;$('modal-backdrop').hidden=false;$('modal-close').hidden=['result','summary','welcome'].includes(kind);$('modal').scrollTop=0;const first=$('modal').querySelector('button:not([hidden]):not(:disabled),input');if(first)first.focus();}
  function closeModal(){if(state.ended||['result','summary','welcome','rescue'].includes(state.modal))return;state.modal=null;$('modal-backdrop').hidden=true;state.last=performance.now();if(lastFocus)lastFocus.focus();}
  function forceClose(){state.modal=null;$('modal-backdrop').hidden=true;state.last=performance.now();}
  function maxLayers(){return 8+save.upgrades.slots*2;}
  const needsCooking = id => !!byId[id]?.cook || ['beef','chicken','bacon'].includes(id);
  function stackCost(ids=state.stack){return ids.reduce((n,id)=>n+byId[id].cost,0);}
  function renderGrill(){
    const grill=state.grill;
    $('grill-food').innerHTML=grill?food(grill.id,grill.ready?'cooked':'raw'):'♨';
    $('grill-food').classList.toggle('ready',!!grill?.ready);
    $('grill-food').classList.toggle('cooking',!!grill&&!grill.ready);
    $('grill-progress-fill').style.width=grill?`${Math.min(100,grill.progress/5*100)}%`:'0%';
    $('grill-label').textContent=grill?(grill.ready?`${byId[grill.id].name}煎好了，拖向盘子！`:`${byId[grill.id].name}正在滋滋煎制…`):'拖入生肉开始煎制';
    $('grill-pan').classList.toggle('sizzling',!!grill&&!grill.ready);
    $('grill-pan').classList.toggle('finished',!!grill?.ready);
    $('grill-food').setAttribute('aria-label',grill?.ready?`已煎熟的${byId[grill.id].name}，拖到汉堡上`:'煎台');
  }
  function beginCooking(id){
    if(state.modal||state.ended)return false;
    if(!needsCooking(id)||!save.unlocked.includes(id))return false;
    if(state.grill){toast(state.grill.ready?'先把煎好的肉饼拖走':'煎台正忙着呢');return false;}
    if(state.capped){toast('先掀开面包再煎肉');return false;}
    if(state.stack.length>=maxLayers()){toast('汉堡已经叠满了');return false;}
    if(state.mode!=='free'&&stackCost()+byId[id].cost+2>save.money){toast('金币不够买这份肉饼');return false;}
    state.grill={id,progress:0,ready:false};renderGrill();playSound('add');return true;
  }
  function advanceCooking(seconds){if(!state.grill||state.grill.ready||state.modal||state.ended)return;state.grill.progress=Math.min(5,state.grill.progress+seconds);if(state.grill.progress>=5){state.grill.ready=true;playSound('coin');toast(`${byId[state.grill.id].name}煎好啦，拖到汉堡上！`);}renderGrill();}
  function renderStack(){
    renderTickets();
    $('burger-stack').innerHTML=`<div class="burger-layer" data-kind="bottom">${food('bottom')}</div>`+state.stack.map((id,i)=>`<div class="burger-layer" data-kind="${id}" data-index="${i}" style="--offset:${Math.sin(i*2.7)*5}px;--tilt:${Math.sin(i*3.8)*2}deg" title="点击移除${byId[id].name}">${food(id)}</div>`).join('')+(state.capped?`<div class="burger-layer" data-kind="top">${food('top')}</div>`:'');
    const height=29+state.stack.reduce((n,id)=>n+(needsCooking(id)?31:id==='cream'?25:['cheese','jam','sauce'].includes(id)?17:23),0)+(state.capped?64:0);
    $('burger-stack').style.transform=`translateX(-50%) scale(${Math.min(1,Math.max(90,($('burger-stage').clientHeight||210)-65)/height)})`;
    $('burger-stack').style.transformOrigin='center bottom';
    $('layer-counter').textContent=`${state.stack.length} / ${maxLayers()} 层`;
    $('cost-label').innerHTML=`食材成本 <b>${stackCost()+(state.stack.length?2:0)}</b>`;
    $('stack-note').textContent=state.capped?'美味已经准备好，出餐吧！':state.stack.length?'拖入下一层，或者盖上面包':'把配料拖到盘子里 ↓';
    $('bun-button').classList.toggle('capped',state.capped);$('bun-button').lastElementChild.textContent=state.capped?'掀开面包':'盖上面包';
    $('serve-button').disabled=!state.stack.length;renderChips();renderPantry();
  }
  function renderChips(){if(!state.order)return;const counts={};state.stack.forEach(id=>counts[id]=(counts[id]||0)+1);$('recipe-chips').innerHTML=state.order.direct?state.order.required.map(id=>`<span class="recipe-chip ${counts[id]?'done':''}">${counts[id]?'✓ ':''}${byId[id].name}</span>`).join(''):'';}
  function renderTickets(){if(state.mode==='free'){$('order-tickets').innerHTML='<div class="order-ticket active"><strong>♡</strong>创意厨房</div>';return;}const count=state.mode==='story'?days[state.day].guests:5,offset=state.mode==='story'?0:state.guest;$('order-tickets').innerHTML=Array.from({length:count},(_,i)=>{const n=i+offset,done=n<state.guest,active=n===state.guest;return `<div class="order-ticket ${done?'complete':active?'active':''}"><strong>#${String(n+1).padStart(2,'0')}</strong>${done?'✓ 已取餐':active?(state.order?.fries?'汉堡 + 薯条':'正在制作'):'等待叫号'}</div>`;}).join('');}
  function renderFryer(){const f=state.fryer;$('fry-label').textContent=f?(f.ready?'装盘薯条 →':'滋滋炸制中'):'下锅炸薯条';$('fry-time').textContent=f?(f.ready?'点一下装进配餐托盘':`${Math.max(0,Math.ceil(6-f.progress))} 秒后出锅`):'套餐配餐 · 6 秒';$('fry-fill').style.width=f?Math.min(100,f.progress/6*100)+'%':'0%';$('fries-tray').textContent=state.fries?'🍟 薯条已装盘':'配餐托盘 · 空';$('fries-tray').classList.toggle('ready',!!state.fries);}
  function fry(){if(state.modal||state.ended)return;if(state.fries){toast('配餐托盘已有一份薯条');return;}if(state.fryer?.ready){state.fries=true;state.fryer=null;renderFryer();playSound('coin');return;}if(state.fryer)return;if(state.mode!=='free'&&save.money<stackCost()+5){toast('金币不足，薯条成本 3 金币');return;}state.fryer={progress:0,ready:false};renderFryer();}
  function advanceFryer(seconds){if(!state.fryer||state.fryer.ready||state.modal||state.ended)return;state.fryer.progress=Math.min(6,state.fryer.progress+seconds);if(state.fryer.progress>=6){state.fryer.ready=true;playSound('coin');toast('薯条出锅！点炸锅装盘');}renderFryer();}
  function renderPantry(){
    const list=ingredients.filter(i=>state.category==='all'||i.category===state.category);
    // 全部先展示已解锁食材，再留一格新配料提示。
    const shown=state.category==='all'?[...list.filter(i=>save.unlocked.includes(i.id)),...list.filter(i=>!save.unlocked.includes(i.id)).slice(0,Math.max(1,8-save.unlocked.length))]:list;
    $('ingredient-grid').innerHTML=shown.map(i=>{const unlocked=save.unlocked.includes(i.id),qty=state.stack.filter(id=>id===i.id).length;return `<button class="ingredient ${unlocked?'':'locked'} ${needsCooking(i.id)?'raw-meat':''}" data-ingredient="${i.id}" aria-label="${unlocked?(needsCooking(i.id)?'拖到煎台烹饪':'拖到盘子叠放'):'解锁'}${i.name}，${unlocked?i.cost+'金币成本':i.price+'金币'}"><span class="ingredient-price">${unlocked?i.cost+' ◇':'♙'}</span>${qty?`<span class="ingredient-qty">${qty}</span>`:''}<span class="ingredient-picture">${food(i.id,needsCooking(i.id)?'raw':'cooked')}</span><span class="ingredient-name">${unlocked?i.name:'解锁 '+i.name}</span>${unlocked&&needsCooking(i.id)?'<span class="raw-label">生 · 需煎制</span>':''}</button>`;}).join('');
    $('pantry-count').textContent=`${save.unlocked.length} 种配料`;
  }
  function renderGoal(){const day=days[state.day],percent=state.mode==='endless'?state.rep/3*100:Math.min(100,state.good/day.goal*100);$('goal-percent').textContent=`${Math.round(percent)}%`;$('goal-fill').style.width=percent+'%';$('goal-title').textContent=state.mode==='endless'?`保持口碑，刷新 ${save.best} 单纪录`:state.mode==='free'?'大胆试试你的奇妙配方':`让 ${day.goal} 位客人带着笑容离开`;$('goal-detail').textContent=state.mode==='endless'?`口碑 ${'♥'.repeat(state.rep)}${'♡'.repeat(3-state.rep)} · 已服务 ${state.guest} 位`:state.mode==='free'?'没有计时 · 不花金币 · 可以收藏作品':`好评 ${state.good} / ${day.goal} · 完成后解锁下一天`;}
  function renderStatus(){const day=days[state.day];$('day-label').textContent=state.mode==='story'?`晴天 · 第 ${String(state.day+1).padStart(2,'0')} 天`:state.mode==='endless'?'晚风 · 无限营业':'晴天 · 创意厨房';$('day-name').textContent=state.mode==='story'?day.name:state.mode==='endless'?'不打烊的小岛':'今天我来做主';$('mode-label').textContent=state.mode==='story'?'今日营业':state.mode==='endless'?`口碑 ${'♥'.repeat(state.rep)}`:'自由创作';$('shift-progress').textContent=state.mode==='story'?`第 ${Math.min(day.guests,state.guest+1)} / ${day.guests} 位客人`:state.mode==='endless'?`已服务 ${state.guest} 位客人`:'不计时，不消耗食材';$('hint-button').hidden=state.mode==='free';$('serve-button').firstElementChild.textContent=state.mode==='free'?'收藏我的汉堡':'开饭啦，出餐！';renderGoal();updateWallet();}
  function newOrder(){
    state.stack=[];state.grill=null;state.fryer=null;state.fries=false;renderFryer();renderGrill();state.capped=false;state.ended=false;
    if(state.mode==='free'){state.order={required:[],banned:[],direct:false};$('customer-avatar').innerHTML=avatar(people[6]);$('customer-name').textContent='创意厨房';$('customer-subtitle').textContent='随心所欲，给美味起个名字';$('order-type').textContent='自由叠料';$('customer-quote').textContent='现在你就是自己的客人！所有配料都可以慢慢解锁。试试咸甜混搭，收藏你的招牌汉堡吧。';$('patience-label').textContent='没有时间限制，享受创作';$('timer-text').textContent='∞';$('patience-fill').style.width='100%';renderStatus();renderStack();return;}
    const available=flavorOrders.filter(o=>o.minDay<= (state.mode==='endless'?7:state.day) && o.required.every(id=>save.unlocked.includes(id)) && o!==state.lastOrder);
    let order;
    const direct=state.mode==='story'&&state.day===0&&state.guest===0||Math.random()<.28;
    if(direct){let required;if(state.day===0&&state.guest===0)required=['beef','cheese','lettuce'];else{const pool=ingredients.filter(i=>save.unlocked.includes(i.id));const n=state.day<3?2:3;required=[];while(required.length<n){const id=pool[Math.floor(Math.random()*pool.length)].id;if(!required.includes(id))required.push(id);}}order={required,banned:[],direct:true,quote:`你好！我想要${required.map(id=>byId[id].name).join('、')}。各放一份，其他就不用啦，谢谢！`,hint:'看上面的配方标签，每样放一份。不要加额外配料。'};}
    else{const template=available[Math.floor(Math.random()*available.length)]||flavorOrders[0];state.lastOrder=template;order={...template,direct:false,banned:template.banned||[]};}
    order.fries=(state.mode==='endless'||state.day>=1)&&state.guest%3===1;if(order.fries){order.quote+=' 再来一份刚出锅的薯条，做成套餐吧！';order.hint+=' 别忘了炸薯条并装盘。';}const person=people[(state.guest+state.day*2)%people.length];state.order=order;renderTickets();state.total=(state.mode==='endless'?Math.max(32,92-state.guest*2):days[state.day].time)+save.upgrades.patience*15;state.remaining=state.total;state.last=performance.now();
    $('customer-avatar').innerHTML=avatar(person);$('customer-name').textContent=person[0];$('customer-subtitle').textContent=person[1];$('order-type').textContent=order.direct?'配方订单':'口味谜语';$('customer-quote').textContent='“'+order.quote+'”';renderStatus();renderStack();renderTimer();
  }
  function renderTimer(){if(state.mode==='free')return;const t=Math.ceil(state.remaining),ratio=state.remaining/state.total;$('timer-text').textContent=`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;$('patience-fill').style.width=`${ratio*100}%`;$('patience-fill').style.background=ratio<.25?'#db6944':'#8ba978';$('patience-label').textContent=ratio>.55?'慢慢来，我不赶时间':ratio>.25?'好香呀，我开始期待了':'肚子咕咕叫，要抓紧啦！';}
  function addIngredient(id){if(state.modal||state.ended)return false;if(!save.unlocked.includes(id)){showShop();return false;}if(state.capped){toast('先掀开面包，就能继续加料');return false;}if(state.stack.length>=maxLayers()){toast('汉堡太高啦！可以升级汉堡架');return false;}if(state.mode!=='free'&&stackCost()+byId[id].cost+2>save.money){toast('金币不足，试试更经济的组合');return false;}if(needsCooking(id)){if(!state.grill?.ready||state.grill.id!==id){toast('生肉不能直接夹！先拖到煎台，煎好再叠');return false;}state.grill=null;renderGrill();}state.stack.push(id);playSound();renderStack();return true;}
  function evaluate(order,stack,capped){
    const required=order.required||[],banned=order.banned||[],unique=new Set(stack),missing=required.filter(id=>!unique.has(id));
    const forbidden=stack.filter(id=>byId[id].tags.some(t=>banned.includes(t)));
    const extras=stack.filter(id=>!required.includes(id)),duplicates=stack.length-unique.size;
    let score=100-missing.length*(55/Math.max(1,required.length))-forbidden.length*28-(order.direct?extras.length*16:Math.max(0,extras.length-2)*9)-duplicates*10-(capped?0:15);
    if(!stack.length)score=0;score=Math.max(0,Math.round(score));
    return {score,missing,forbidden,extras,duplicates,good:score>=70};
  }
  function serve(timedOut=false){
    if(state.modal||state.ended)return;if(state.mode==='free'){collect();return;}if(!timedOut&&!state.stack.length)return;
    const result=timedOut?{score:0,good:false,missing:state.order.required,forbidden:[],extras:[],duplicates:0}:evaluate(state.order,state.stack,state.capped);
    if(!timedOut&&state.order.fries&&!state.fries){result.score=Math.max(0,result.score-35);result.good=result.score>=70;}const cost=stackCost()+ (state.stack.length?2:0)+(state.fries?3:0);const base=16+state.order.required.reduce((n,id)=>n+byId[id].cost*2,0)+(state.order.fries?12:0);const payment=timedOut?0:Math.round(base*result.score/100);const tip=result.good?Math.round((result.score-60)*.2*(1+save.upgrades.tips*.2)):0;const net=payment+tip-cost;
    save.money=Math.max(0,save.money+net);save.served++;save.earned+=payment+tip;state.revenue+=net;state.guest++;state.scores.push(result.score);if(result.good)state.good++;else if(state.mode==='endless')state.rep--;state.ended=true;persist();renderStatus();playSound(result.good?'success':'bad');
    let tags=result.missing.map(id=>`<span class="bad">缺少${byId[id].name}</span>`).join('')+result.forbidden.map(id=>`<span class="bad">不想要${byId[id].name}</span>`).join('');if(!state.capped&&!timedOut)tags+='<span class="bad">忘了盖面包</span>';if(result.duplicates)tags+='<span class="bad">重复配料有点多</span>';if(state.order.direct&&result.extras.length)tags+='<span class="bad">多了配方以外的料</span>';if(!tags)tags='<span>口味刚刚好</span><span>搭配很用心</span>';
    if(state.order.fries&&!state.fries)tags+='<span class="bad">套餐缺少薯条</span>';renderTickets();openModal('result',`<div class="modal-eyebrow">ONE BURGER, ONE LITTLE JOY</div><h2 id="modal-title">${timedOut?'客人等得太久，先离开了':result.score>=90?'这一口，正是我想要的！':result.good?'不错哦，今天很开心！':'和想象中的味道不太一样…'}</h2><div class="result-face">${timedOut?'☁':result.score>=90?'🥰':result.good?'😊':'🥺'}</div><div class="result-score">${result.score}<small>美味满意度 / 100</small></div><div class="result-comment">${timedOut?'下次早点出餐吧。打开菜单时，时间会暂停。':result.good?'谢谢你听懂我的小小期待。明天也想再来！':state.order.hint}</div><div class="result-tags">${tags}</div><div class="receipt"><div><span>餐品收入</span><span>+ ${payment} ◇</span></div><div><span>开心小费</span><span>+ ${tip} ◇</span></div><div><span>食材成本</span><span>− ${cost} ◇</span></div><div><span>本单净收益</span><span>${net>=0?'+ ':''}${net} ◇</span></div></div><button class="modal-primary" id="next-guest">${isShiftOver()?'看看今日结算':'迎接下一位客人 →'}</button>`);
    $('next-guest').onclick=()=>{forceClose();if(isShiftOver())endShift();else if(save.money<5)showRescue();else newOrder();};
  }
  function isShiftOver(){return state.mode==='story'?state.guest>=days[state.day].guests:state.rep<=0;}
  function confetti(){const colors=['#e69769','#91b183','#edc66b','#c1a6c9'];$('confetti').innerHTML=Array.from({length:36},(_,i)=>`<i class="confetti-piece" style="left:${Math.random()*100}%;background:${colors[i%4]};animation-delay:${Math.random()*.6}s;transform:rotate(${Math.random()*180}deg)"></i>`).join('');setTimeout(()=>$('confetti').innerHTML='',3400);}
  function endShift(){
    const d=days[state.day],won=state.mode==='story'&&state.good>=d.goal,mean=Math.round(state.scores.reduce((a,b)=>a+b,0)/Math.max(1,state.scores.length));let star=won?(mean>=93?3:mean>=82?2:1):0;
    if(won){const first=!save.stars[state.day];save.stars[state.day]=Math.max(save.stars[state.day]||0,star);save.money+=first?d.reward:Math.round(d.reward*.35);save.day=Math.min(7,Math.max(save.day,state.day+1));confetti();}
    if(state.mode==='endless')save.best=Math.max(save.best,state.guest);persist();
    openModal('summary',`<div class="modal-eyebrow">${state.mode==='endless'?'THE NIGHT IS STILL BEAUTIFUL':'CLOSE THE SHOP, KEEP THE SUNSHINE'}</div><h2 id="modal-title">${state.mode==='endless'?'今晚就营业到这里':won?state.day===7?'小岛汉堡大师，诞生！':'又是美味的一天！':'今天，也学到一点新东西'}</h2><p class="modal-intro">${state.mode==='endless'?`口碑用完啦。明晚再来！最高纪录：${save.best} 位客人。`:won?`达成 ${state.good} / ${d.goal} 好评目标，获得营业奖励。${state.day===7?'全部八天已通关，去无尽模式挑战新纪录吧！':'下一天有新的客人和故事等着你。'}`:`好评 ${state.good} / ${d.goal}，距离目标还差一点。试着读懂客人的比喻，少加不需要的料。`}</p>${state.mode==='story'?`<div class="stars">${'★'.repeat(star)}${'☆'.repeat(3-star)}</div>`:''}<div class="summary-stats"><div><strong>${state.guest}</strong><span>服务客人</span></div><div><strong>${mean}</strong><span>平均满意度</span></div><div><strong>${state.revenue>=0?'+':''}${state.revenue}</strong><span>营业净收益</span></div></div>${won?`<div class="stat-strip">✦ 通关奖励已到账 · 钱包 ${save.money} 金币</div>`:''}<button class="modal-primary" id="continue-day">${state.mode==='endless'?'再开一家不打烊的小店':won&&state.day<7?'明天继续营业 →':'再营业一次'}</button><button class="modal-secondary" id="summary-shop">去商店，添点新鲜的</button><button class="modal-secondary" id="summary-mode">选择营业模式</button>`);
    $('continue-day').onclick=()=>{const next=won?Math.min(7,state.day+1):state.day;forceClose();startShift(state.mode,next);};$('summary-shop').onclick=()=>showShop(true);$('summary-mode').onclick=()=>showModes(true);
  }
  function showRescue(){openModal('rescue',`<div class="modal-eyebrow">A LITTLE HELP FROM THE ISLAND</div><h2 id="modal-title">邻居送来了补给</h2><p class="modal-intro">小岛上的店不会轻易倒下。领取 35 金币应急补助，继续练习吧。无尽模式将结束本次营业。</p><button class="modal-primary" id="rescue-button">谢谢邻居，重新振作！</button>`);$('rescue-button').onclick=()=>{save.money+=35;persist();forceClose();if(state.mode==='endless'){state.rep=0;endShift();}else newOrder();};}
  function startShift(mode='story',day=save.day){state.mode=mode;state.day=day;state.guest=0;state.good=0;state.revenue=0;state.scores=[];state.rep=3;state.category='all';state.paused=false;state.lastOrder=null;document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('active',b.dataset.category==='all');b.setAttribute('aria-selected',String(b.dataset.category==='all'));});forceClose();if(save.money<5&&mode!=='free'){showRescue();return;}newOrder();}
  function showShop(afterShift=false){
    const itemHTML=ingredients.filter(i=>i.price).map(i=>{const owned=save.unlocked.includes(i.id);return `<div class="shop-item"><div class="shop-art">${food(i.id)}</div><div class="shop-item-info"><strong>${i.name}</strong><p>${i.desc}</p></div><button class="buy-button ${owned?'owned':''}" data-buy="${i.id}" ${owned||save.money<i.price?'disabled':''}>${owned?'已解锁':i.price+' ◇'}</button></div>`;}).join('');
    const upgradeHTML=upgrades.map(u=>{const level=save.upgrades[u.id],price=u.base*(level+1);return `<div class="shop-item"><div class="shop-art">${u.icon}</div><div class="shop-item-info"><strong>${u.name} <small>Lv.${level}</small></strong><p>${u.desc} · 最多 ${u.max} 级</p></div><button class="buy-button ${level>=u.max?'owned':''}" data-upgrade="${u.id}" ${level>=u.max||save.money<price?'disabled':''}>${level>=u.max?'已满级':price+' ◇'}</button></div>`;}).join('');
    openModal('shop',`<div class="modal-eyebrow">THE ISLAND SUPPLY STORE</div><h2 id="modal-title">一点新鲜，一点升级</h2><p class="modal-intro">用赚到的金币，解锁更多奇妙口味。解锁后，客人就可能点到它。</p><div class="shop-balance"><span>小岛钱包</span><strong>${save.money} ◇</strong></div><h3 class="shop-section-title">厨房升级 <span>更从容，更好赚</span></h3>${upgradeHTML}<h3 class="shop-section-title">配料研究所 <span>永久解锁 · 出餐时扣除成本</span></h3>${itemHTML}${afterShift?'<button class="modal-primary" id="shop-next">准备好了，开始下一天</button>':''}<p class="tiny-footer">新配料不会改变当前订单，下位客人开始生效。<br>食材在出餐时结算，撤回和清空不花金币。</p>`);
    $('modal-content').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const i=byId[b.dataset.buy];if(save.money<i.price||save.unlocked.includes(i.id))return;save.money-=i.price;save.unlocked.push(i.id);persist();playSound('coin');renderPantry();showShop(afterShift);toast(`解锁了${i.name}！`);});
    $('modal-content').querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>{const u=upgrades.find(x=>x.id===b.dataset.upgrade),price=u.base*(save.upgrades[u.id]+1);if(save.money<price||save.upgrades[u.id]>=u.max)return;save.money-=price;save.upgrades[u.id]++;if(u.id==='patience'){state.total+=15;state.remaining+=15;}persist();playSound('coin');renderStack();showShop(afterShift);});
    if(afterShift){$('modal-close').hidden=true;$('shop-next').onclick=()=>startShift(state.mode,state.mode==='story'?save.day:state.day);}
  }
  function showHelp(welcome=false){openModal(welcome?'welcome':'help',`<div class="modal-eyebrow">WELCOME TO BURGER ISLAND</div><div class="modal-illustration">${fullBurger()}</div><h2 id="modal-title">欢迎来到小岛汉堡社</h2><p class="modal-intro">横屏打开小店，把食材亲手叠成客人想吃的样子！</p><div class="help-step"><span>01</span><div><strong>听懂客人的小小期待</strong><p>配方订单照着标签做；口味谜语藏着配料线索，点「听听提示」查看答案。</p></div></div><div class="help-step"><span>02</span><div><strong>拖拽、煎制、叠出好心情</strong><p>按住食材拖到盘子上。牛肉、鸡排、培根和奇妙肉饼要先拖上煎台，等煎熟后再拖到汉堡。点食材可辅助操作；点汉堡上的层可移除。</p></div></div><div class="help-step"><span>03</span><div><strong>盖上面包，卖汉堡养大小店</strong><p>盖上面包再出餐，70 分以上获得好评。关卡共 8 天；无尽模式用完 3 点口碑结算；创意厨房不限时、不扣金币。</p></div></div><button class="modal-primary" id="help-start">${welcome?'系上围裙，开始营业 →':'知道啦，继续制作'}</button><p class="tiny-footer">打开菜单、切到其他页面会自动暂停。${storageOK?'进度保存在当前浏览器中。':'当前浏览器无法保存进度，可继续游玩。'}</p>`);$('help-start').onclick=()=>{save.seen=true;persist();forceClose();};}
  function showModes(afterShift=false){
    openModal('modes',`<div class="modal-eyebrow">A NEW DAY, A NEW WAY</div><h2 id="modal-title">今天，怎么营业？</h2><p class="modal-intro">切换模式或重选关卡会重新开始本次营业。金币、解锁和最高纪录会保留。</p><button class="mode-card ${state.mode==='story'?'selected':''}" data-mode="story"><span>☀</span><div><strong>小岛故事 <small>8 天关卡</small></strong><p>每天一个小目标，把小店经营成小岛名片。</p></div></button><div class="day-select">${days.map((d,i)=>`<button data-day="${i}" ${i>save.day?'disabled':''} class="${state.day===i?'current':''}" title="${d.desc}">${i>save.day?'♙':'DAY '+(i+1)}<small>${save.stars[i]?'★'.repeat(save.stars[i]):i<=save.day?'可营业':'未解锁'}</small></button>`).join('')}</div><button class="mode-card ${state.mode==='endless'?'selected':''}" data-mode="endless"><span>☾</span><div><strong>不打烊的小店 <small>最高 ${save.best} 单</small></strong><p>越来越忙的夜市。满意度低于 70 或超时损失 1 点口碑，3 点用完结算。</p></div></button><button class="mode-card ${state.mode==='free'?'selected':''}" data-mode="free"><span>✿</span><div><strong>创意厨房 <small>自由制作</small></strong><p>不限时、不扣金币。自由叠料，为作品命名并收藏。</p></div></button>${afterShift?'<button class="modal-secondary" id="mode-back">返回今日结算</button>':''}`);
    $('modal-content').querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>startShift(b.dataset.mode,save.day));$('modal-content').querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>startShift('story',Number(b.dataset.day)));if(afterShift){$('modal-close').hidden=true;$('mode-back').onclick=()=>showShop(true);}
  }
  const tagNames={meaty:'肉香',smoky:'烟熏',rich:'浓郁',dairy:'奶香',fresh:'清新',green:'绿叶',tangy:'酸甜',crunchy:'酥脆',sharp:'辛香',sweet:'甜蜜',berry:'莓果',tropical:'热带',soft:'软嫩',earthy:'森林',spicy:'辣味',cold:'冰凉'};
  function showBook(tab='taste'){
    const content=tab==='taste'?ingredients.filter(i=>save.unlocked.includes(i.id)).map(i=>`<div class="taste-item"><div class="shop-art">${food(i.id)}</div><div><strong>${i.name} · ${i.tags.map(t=>tagNames[t]).join(' / ')}</strong><p>${i.desc}</p></div></div>`).join(''):save.collection.length?save.collection.slice().reverse().map(c=>`<div class="collection-card">${fullBurger(c.ids.slice(0,5))}<div><strong>${escapeHTML(c.name)}</strong><p>${c.ids.map(id=>byId[id].name).join(' + ')}</p><small>${c.date}</small></div></div>`).join(''):'<div class="empty-note">还没有收藏的汉堡。<br>去创意厨房，做一份属于你的招牌吧！</div>';
    openModal('book',`<div class="modal-eyebrow">TASTE NOTES & LITTLE CREATIONS</div><h2 id="modal-title">美味手账</h2><p class="modal-intro">记住每一种味道，就能听懂更多心情。</p><div class="book-tabs"><button data-book="taste" class="${tab==='taste'?'active':''}">口味词典</button><button data-book="collection" class="${tab==='collection'?'active':''}">我的招牌 · ${save.collection.length}</button></div>${content}<div class="stat-strip">累计服务 ${save.served} 位客人 · 总收入 ${save.earned} 金币<br>无尽纪录 ${save.best} 单 · 已解锁 ${save.unlocked.length} / ${ingredients.length} 种配料</div><button class="danger-text" id="reset-save">重置小岛存档</button>`);
    $('modal-content').querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>showBook(b.dataset.book));$('reset-save').onclick=()=>{openModal('reset',`<div class="modal-eyebrow">START AGAIN</div><h2 id="modal-title">重新开始小岛生活？</h2><p class="modal-intro">金币、解锁的配料、关卡星星和收藏都会清空。这个操作无法撤回。</p><button class="modal-primary" id="confirm-reset">确认清空，重新开始</button><button class="modal-secondary" id="cancel-reset">保留我的小岛</button>`);$('confirm-reset').onclick=()=>{save=freshSave();persist();renderSound();startShift();showHelp(true);};$('cancel-reset').onclick=()=>showBook();};
  }
  function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function collect(){if(!state.capped){toast('先给你的作品盖上面包吧');return;}openModal('collect',`<div class="modal-eyebrow">YOUR OWN LITTLE MASTERPIECE</div><h2 id="modal-title">给这份美味起个名字</h2><div class="modal-illustration">${fullBurger(state.stack.slice(0,5))}</div><div class="recipe-detail">${state.stack.map(id=>byId[id].name).join(' + ')}</div><input class="free-name" id="burger-name" maxlength="20" placeholder="例如：草莓云朵的午后" aria-label="汉堡名称"><button class="modal-primary" id="save-burger">收藏到美味手账 ♡</button><p class="tiny-footer">最多收藏 30 份作品，超出后替换最早的收藏。</p>`);$('save-burger').onclick=()=>{const name=$('burger-name').value.trim()||'我的第 '+(save.collection.length+1)+' 份美味';save.collection.push({name,ids:[...state.stack],date:new Date().toLocaleDateString('zh-CN')});if(save.collection.length>30)save.collection.shift();persist();forceClose();playSound('success');toast('已收藏！去美味手账看看吧');};}
  function hint(){if(!state.order)return;const order=state.order;openModal('hint',`<div class="modal-eyebrow">LISTEN A LITTLE CLOSER</div><h2 id="modal-title">海风偷偷告诉你</h2><p class="modal-intro">${order.hint}</p><div class="recipe-detail">${order.required.map(id=>byId[id].name).join(' + ')}<br>${order.banned?.length?'留意忌口，不要添加不喜欢的味道。':'口味谜语允许少量合理发挥，但别堆太多重复配料。'}</div><button class="modal-primary" id="hint-close">好，我知道怎么做啦</button>`);$('hint-close').onclick=closeModal;}
  function renderSound(){ $('sound-button').querySelector('.sound-off').hidden=save.sound;$('sound-button').setAttribute('aria-label',save.sound?'关闭音效':'开启音效');$('sound-button').title=save.sound?'关闭音效':'开启音效'; }
  $('ingredient-grid').onclick=e=>{const b=e.target.closest('[data-ingredient]');if(!b||state.dragging)return;const id=b.dataset.ingredient;if(!save.unlocked.includes(id)){showShop();return;}if(needsCooking(id)){if(state.grill?.ready&&state.grill.id===id)addIngredient(id);else beginCooking(id);}else addIngredient(id);};
  $('grill-food').onclick=()=>{if(!state.dragging&&state.grill?.ready)addIngredient(state.grill.id);};
  $('fry-button').onclick=fry;
  window.addEventListener?.('resize',()=>renderStack());
  // Pointer events cover mouse and touch; release only commits when the ghost overlaps the target.
  let drag=null;
  const hit=(x,y,id)=>{const r=$(id).getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};
  function dragEnd(e){if(!drag||e.pointerId!==drag.pointerId)return;const {id,origin,ghost,started}=drag;ghost?.remove();document.body.classList.remove('is-dragging');$('burger-stage').classList.remove('drop-ready');$('grill-station').classList.remove('drop-ready');drag=null;if(!started)return;state.dragging=true;setTimeout(()=>state.dragging=false,0);if(state.modal||state.ended)return;
    if(origin==='grill'){if(hit(e.clientX,e.clientY,'burger-stage'))addIngredient(id);else toast('把煎熟的肉饼放到汉堡上');}
    else if(needsCooking(id)){if(hit(e.clientX,e.clientY,'grill-station'))beginCooking(id);else toast('生肉先放到煎台上哦');}
    else if(hit(e.clientX,e.clientY,'burger-stage'))addIngredient(id);
    else toast('把配料放到汉堡盘子上');
  }
  document.addEventListener('pointerdown',e=>{const source=e.target.closest?.('[data-ingredient],#grill-food');if(!source||state.modal||state.ended)return;const origin=source.id==='grill-food'?'grill':'pantry',id=origin==='grill'?state.grill?.id:source.dataset.ingredient;if(!id||origin==='grill'&&!state.grill?.ready||origin==='pantry'&&!save.unlocked.includes(id))return;drag={id,origin,pointerId:e.pointerId,x:e.clientX,y:e.clientY,started:false,ghost:null};});
  document.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointerId)return;if(!drag.started&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8)return;if(!drag.started){drag.started=true;drag.ghost=document.createElement('div');drag.ghost.className='drag-ghost';drag.ghost.innerHTML=food(drag.id,drag.origin==='pantry'&&needsCooking(drag.id)?'raw':'cooked');document.body.appendChild(drag.ghost);document.body.classList.add('is-dragging');}e.preventDefault();drag.ghost.style.left=`${e.clientX}px`;drag.ghost.style.top=`${e.clientY}px`;$('burger-stage').classList.toggle('drop-ready',hit(e.clientX,e.clientY,'burger-stage')&&(drag.origin==='grill'||!needsCooking(drag.id)));$('grill-station').classList.toggle('drop-ready',hit(e.clientX,e.clientY,'grill-station')&&drag.origin==='pantry'&&needsCooking(drag.id));});
  document.addEventListener('pointerup',dragEnd);document.addEventListener('pointercancel',e=>{if(!drag||e.pointerId!==drag.pointerId)return;drag.ghost?.remove();drag=null;document.body.classList.remove('is-dragging');$('burger-stage').classList.remove('drop-ready');$('grill-station').classList.remove('drop-ready');});
  document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-selected',String(t===b));});renderPantry();});
  $('burger-stack').onclick=e=>{const layer=e.target.closest('[data-index]');if(layer&&!state.modal){if(state.capped){toast('掀开面包后才能调整配料');return;}state.stack.splice(Number(layer.dataset.index),1);renderStack();}};
  $('undo-button').onclick=()=>{if(state.capped)state.capped=false;else state.stack.pop();renderStack();};$('clear-button').onclick=()=>{state.stack=[];state.grill=null;renderGrill();state.capped=false;renderStack();};$('bun-button').onclick=()=>{state.capped=!state.capped;playSound();renderStack();};$('serve-button').onclick=()=>serve();
  $('sound-button').onclick=()=>{save.sound=!save.sound;persist();renderSound();playSound('coin');};$('help-button').onclick=()=>showHelp();$('hint-button').onclick=hint;$('shop-button').onclick=()=>showShop();$('aside-shop').onclick=()=>showShop();$('book-button').onclick=()=>showBook();$('mode-button').onclick=()=>showModes();$('play-button').onclick=()=>{if(state.mode!=='story')toast('你正在'+(state.mode==='free'?'创意厨房':'无尽模式')+'，点击营业模式可以切换');};
  $('pause-button').onclick=()=>{openModal('pause',`<div class="modal-eyebrow">TAKE A LITTLE BREATH</div><h2 id="modal-title">小岛时间，暂停一下</h2><p class="modal-intro">汉堡和客人都在等你。喝口水，再继续吧。</p><button class="modal-primary" id="resume">继续营业 →</button><button class="modal-secondary" id="pause-mode">选择营业模式</button>`);$('resume').onclick=closeModal;$('pause-mode').onclick=()=>showModes();};
  $('modal-close').onclick=closeModal;$('modal-backdrop').onclick=e=>{if(e.target===$('modal-backdrop'))closeModal();};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(e.key==='Tab'&&state.modal){const focusable=[...$('modal').querySelectorAll('button:not([disabled]):not([hidden]),input')];const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
  document.addEventListener('visibilitychange',()=>{state.last=performance.now();});
  function tick(now){const elapsed=Math.min((now-state.last)/1000,.4);state.last=now;if(!state.modal&&!document.hidden&&!state.ended){advanceCooking(elapsed);advanceFryer(elapsed);if(state.mode!=='free'&&state.order){state.remaining=Math.max(0,state.remaining-elapsed);renderTimer();if(state.remaining<=0)serve(true);}}requestAnimationFrame(tick);}
  $('mini-logo').innerHTML=fullBurger();$('bun-icon').innerHTML=food('top');
  $('island-art').innerHTML=svg(`<ellipse cx="180" cy="291" rx="135" ry="22" fill="#dddbc5"/><path d="M46 283q64-18 100-4t145 1" stroke="#b6c9bc" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="265" cy="64" r="28" fill="#eccb77"/><path d="m264 21 1-8m34 25 7-4m-76-2-7-6m42 82v8m39-25 6 5" stroke="#ddba6c" stroke-width="3" stroke-linecap="round"/><path d="M65 248 76 136 276 136 289 248" fill="#efe3c6" stroke="#94785b" stroke-width="3"/><path d="M60 140 81 99h188l22 41Z" fill="#dc8765" stroke="#94785b" stroke-width="3"/><path d="M75 105h195m-211 38h236" stroke="#f9cc98" stroke-width="5"/><rect x="80" y="148" width="191" height="79" rx="6" fill="#8caa97" stroke="#94785b" stroke-width="3"/><rect x="94" y="155" width="68" height="54" rx="3" fill="#e9dab4"/><rect x="177" y="155" width="78" height="54" rx="3" fill="#e9dab4"/><path d="M59 140h234v16q-14 15-28 0q-14 15-28 0q-14 15-28 0q-14 15-28 0q-14 15-28 0q-14 15-28 0q-14 15-28 0q-14 15-32 0Z" fill="#f8edce" stroke="#94785b" stroke-width="2"/><path d="M64 140h28v16q-14 15-28 0m56-16h28v16q-14 15-28 0m56-16h28v16q-14 15-28 0m56-16h28v16q-14 15-28 0" fill="#dc8765"/><rect x="66" y="219" width="221" height="15" rx="4" fill="#b18058" stroke="#94785b" stroke-width="2"/><rect x="102" y="246" width="41" height="42" rx="4" fill="#dc8765" stroke="#94785b" stroke-width="2"/><rect x="212" y="246" width="41" height="42" rx="4" fill="#dc8765" stroke="#94785b" stroke-width="2"/><rect x="117" y="78" width="123" height="27" rx="8" fill="#fbefd6" stroke="#94785b" stroke-width="2"/><text x="179" y="96" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#987650" letter-spacing="2">BURGER CLUB</text><path d="M308 255v-78m-1 35q-35-16-28-36q33 4 29 36m1-15q-4-31 19-39q12 28-19 39" fill="#8caa77" stroke="#6e8b5d" stroke-width="3"/><path d="M292 245h34l-5 35h-23Z" fill="#c98e6b" stroke="#94785b" stroke-width="2"/><path d="M44 241q-17-37 4-51q21 19-4 51" fill="#9caf7a"/><path d="M44 213v62" stroke="#7c9365" stroke-width="3"/><path d="M32 264h25l-4 17H36Z" fill="#d8b88a"/><path d="m18 70 13-4 13 4m76-30 9-4 9 4" fill="none" stroke="#b6bba0" stroke-width="2" stroke-linecap="round"/><path d="M49 294q12 7 24 0m209 8q12 7 24 0" fill="none" stroke="#b4c7b9" stroke-width="3"/>`,'0 0 360 330');
  renderSound();startShift();if(!save.seen)showHelp(true);requestAnimationFrame(tick);
  // 调试入口仅在显式开启测试标志时公开。
  if(window.__BURGER_TEST__)window.BurgerTest={evaluate,ingredients,days,state,getSave:()=>save,startShift,addIngredient,beginCooking,advanceCooking,fry,advanceFryer,serve,food};
})();
