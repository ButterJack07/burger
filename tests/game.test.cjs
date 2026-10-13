const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

// Lightweight DOM adapter for deterministic game-state tests without dependencies.
function boot(saved){
  const nodes=new Map();
  const handlers={};
  function element(){return {innerHTML:'',textContent:'',value:'',hidden:false,disabled:false,style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},focus(){},remove(){},appendChild(){},getBoundingClientRect(){return {left:0,right:0,top:0,bottom:0};},querySelector(){return element();},querySelectorAll(){return [];},firstElementChild:{textContent:''},lastElementChild:{textContent:''}};}
  const document={hidden:false,activeElement:element(),body:element(),createElement(){return element();},getElementById(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);},querySelectorAll(){return [];},addEventListener(type,handler){(handlers[type] ||= []).push(handler);}};
  const localStorage={value:saved?JSON.stringify(saved):null,getItem(){return this.value;},setItem(k,v){this.value=v;}};
  const window={__BURGER_TEST__:true};
  const context=vm.createContext({document,window,localStorage,performance:{now:()=>0},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},console,Date,Math});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../game.js'),'utf8'),context);
  document.getElementById('help-start').onclick();
  return {api:window.BurgerTest,document,localStorage,emit(type,event){for(const handler of handlers[type]||[])handler(event);}};
}

test('exact recipe scores 100; missing bun, extra ingredients and duplicate layers penalize',()=>{
  const {api}=boot();const order={required:['beef','cheese','lettuce'],banned:[],direct:true};
  assert.equal(api.evaluate(order,['beef','cheese','lettuce'],true).score,100);
  assert.equal(api.evaluate(order,['beef','cheese','lettuce'],false).score,85);
  assert.ok(api.evaluate(order,['beef'],true).score<70);
  assert.equal(api.evaluate(order,['beef','cheese','lettuce','tomato'],true).score,84);
  assert.equal(api.evaluate(order,['beef','cheese','lettuce','beef'],true).score,90);
});

test('mystery order respects vegetarian restrictions and tolerates creative additions',()=>{
  const {api}=boot();const order={required:['cream','jam'],banned:['meaty'],direct:false};
  assert.equal(api.evaluate(order,['cream','jam','pineapple'],true).score,100);
  assert.equal(api.evaluate(order,['cream','jam','beef'],true).score,72);
  assert.ok(api.evaluate(order,['cream','jam','beef','bacon'],true).score<70);
  assert.equal(api.evaluate(order,[],false).score,0);
});

test('first customer can be served, revenue saved, and shift advances',()=>{
  const {api,document,localStorage}=boot();const money=api.getSave().money;
  api.beginCooking('beef');api.advanceCooking(5);['beef','cheese','lettuce'].forEach(api.addIngredient);
  document.getElementById('bun-button').onclick();api.serve();
  assert.equal(api.state.scores[0],100);assert.equal(api.state.good,1);
  assert.ok(api.getSave().money>money);assert.equal(JSON.parse(localStorage.value).served,1);
  document.getElementById('next-guest').onclick();assert.equal(api.state.guest,1);assert.equal(api.state.stack.length,0);assert.equal(api.state.ended,false);
});

test('complete a full story shift to unlock the next day and award stars',()=>{
  const {api,document}=boot();
  for(let n=0;n<5;n++){
    api.state.order.required.forEach(id=>{if(['beef','chicken','bacon','edamame','milkfrog'].includes(id)){api.beginCooking(id);api.advanceCooking(5);}api.addIngredient(id);});document.getElementById('bun-button').onclick();api.serve();document.getElementById('next-guest').onclick();
  }
  assert.equal(api.state.modal,'summary');assert.equal(api.getSave().day,1);assert.equal(api.getSave().stars[0],3);
  document.getElementById('modal-close').onclick();assert.equal(api.state.modal,'summary');
  document.getElementById('continue-day').onclick();assert.equal(api.state.day,1);assert.equal(api.state.guest,0);
});

test('endless ends after three unsuccessful customers and stores record',()=>{
  const {api,document}=boot();api.startShift('endless');
  for(let n=0;n<3;n++){api.serve(true);document.getElementById('next-guest').onclick();}
  assert.equal(api.state.rep,0);assert.equal(api.state.modal,'summary');assert.equal(api.getSave().best,3);
});

test('creative kitchen has no ingredient cost and persists named collection',()=>{
  const {api,document}=boot();api.startShift('free');const money=api.getSave().money;
  api.beginCooking('beef');api.advanceCooking(5);api.addIngredient('beef');api.addIngredient('cheese');document.getElementById('bun-button').onclick();api.serve();
  document.getElementById('burger-name').value='小岛招牌';document.getElementById('save-burger').onclick();
  assert.equal(api.getSave().money,money);assert.equal(api.getSave().collection[0].name,'小岛招牌');
});

test('layer capacity is enforced, locked ingredients cannot be added, capped burger cannot be edited',()=>{
  const {api,document}=boot();api.startShift('free');
  for(let i=0;i<10;i++)api.addIngredient('lettuce');assert.equal(api.state.stack.length,8);
  document.getElementById('clear-button').onclick();api.addIngredient('cream');assert.equal(api.state.stack.length,0);
  document.getElementById('modal-close').onclick();api.beginCooking('beef');api.advanceCooking(5);api.addIngredient('beef');document.getElementById('bun-button').onclick();api.addIngredient('cheese');assert.equal(api.state.stack.length,1);
});

test('orders only use unlocked ingredients across all days and modes',()=>{
  const {api}=boot();
  for(let i=0;i<120;i++){
    api.startShift(i%2?'endless':'story',i%8);
    assert.ok(api.state.order.required.every(id=>api.getSave().unlocked.includes(id)));
  }
  assert.equal(api.ingredients.length,18);assert.equal(api.days.length,8);
});

test('raw meat cannot be stacked; grilling takes five seconds and consumes cooked patty once',()=>{
  const {api}=boot();api.startShift('free');
  assert.equal(api.addIngredient('beef'),false);
  assert.equal(api.beginCooking('beef'),true);api.advanceCooking(4.9);assert.equal(api.addIngredient('beef'),false);
  api.advanceCooking(.1);assert.equal(api.state.grill.ready,true);
  assert.equal(api.addIngredient('beef'),true);assert.equal(api.state.grill,null);
  assert.equal(api.addIngredient('beef'),false);
});

test('abstract patties cook independently and appear in unlocked orders',()=>{
  const saved={money:500,unlocked:['edamame','milkfrog']};const {api}=boot(saved);
  api.startShift('free');
  assert.equal(api.beginCooking('edamame'),true);assert.equal(api.beginCooking('milkfrog'),false);
  api.advanceCooking(5);assert.equal(api.addIngredient('edamame'),true);
  assert.equal(api.beginCooking('milkfrog'),true);api.advanceCooking(5);assert.equal(api.addIngredient('milkfrog'),true);
  assert.equal(api.state.stack.join(','),'edamame,milkfrog');
  assert.match(api.food('edamame'),/food-edamame-cooked-body/);
  assert.match(api.food('milkfrog'),/food-milkfrog-cooked-body/);
  assert.match(api.food('edamame','raw'),/food-edamame-raw-body/);
});

test('pointer drag routes raw meat to grill, then cooked patty to burger',()=>{
  const {api,document,emit}=boot();api.startShift('free');
  document.getElementById('grill-station').getBoundingClientRect=()=>({left:250,right:360,top:0,bottom:150});
  document.getElementById('burger-stage').getBoundingClientRect=()=>({left:100,right:240,top:0,bottom:150});
  const source={dataset:{ingredient:'beef'},id:'',closest(){return this;}};
  const grill={id:'grill-food',closest(){return this;}};
  const move=(type,x,source)=>emit(type,{pointerId:1,clientX:x,clientY:60,target:source,preventDefault(){}});
  move('pointerdown',400,source);move('pointermove',300,source);move('pointerup',300,source);
  assert.equal(api.state.grill.id,'beef');api.advanceCooking(5);
  move('pointerdown',300,grill);move('pointermove',180,grill);move('pointerup',180,grill);
  assert.equal(api.state.stack[0],'beef');assert.equal(api.state.grill,null);
});

test('fries require six seconds and plating; complete combo avoids missing-side penalty',()=>{
  const {api,document}=boot();api.startShift('story',1);api.state.order={required:['lettuce'],direct:true,banned:[],fries:true,hint:'薯条套餐'};
  api.fry();api.advanceFryer(5);api.fry();assert.equal(api.state.fries,false);
  api.advanceFryer(1);api.fry();assert.equal(api.state.fries,true);assert.equal(api.state.fryer,null);
  api.addIngredient('lettuce');document.getElementById('bun-button').onclick();api.serve();assert.equal(api.state.scores[0],100);
});

test('missing fries costs 35 points and cooking pauses in menus',()=>{
  const {api,document}=boot();api.startShift('story',1);api.state.order={required:['lettuce'],direct:true,banned:[],fries:true,hint:'薯条套餐'};
  api.fry();api.state.modal='pause';api.advanceFryer(6);assert.equal(api.state.fryer.progress,0);api.state.modal=null;
  api.addIngredient('lettuce');document.getElementById('bun-button').onclick();api.serve();assert.equal(api.state.scores[0],65);
});
