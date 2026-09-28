// Logic harness; visual layout and actual popup permissions require browser QA.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function harness(stored = null) {
  let now = 100000, listener, tick, persisted;
  const nodes = {};
  const el = () => ({value:'',style:{setProperty(){}},classList:{toggle(){}},append(){},replaceChildren(){},addEventListener(){},showModal(){},close(){}});
  const actions = ['rest','music','garden'].map(a => ({...el(),dataset:{care:a}}));
  const panel = {...el(),querySelector:q => nodes[q] ||= el(),querySelectorAll:() => actions};
  const popup = {closed:false,close(){this.closed=true},postMessage(){}};
  const window = {BUNNY_ASSETS:{'mond-bunny.png':'bunny'},open:()=>popup};
  vm.runInNewContext(fs.readFileSync(__dirname+'/mond-care.js','utf8'), {
    window,document:{createElement:tag=>tag==='dialog'?panel:el(),body:{append(){}}},
    localStorage:{getItem:()=>stored,setItem:(k,v)=>persisted=JSON.parse(v)},
    Date:{now:()=>now},setInterval:fn=>tick=fn,addEventListener:(name,fn)=>listener=fn
  });
  return {nodes,actions,popup,tick:()=>tick(),advance:ms=>now+=ms,save:()=>persisted,
    message:(data,origin='http://localhost:8765',source=popup)=>listener({data,origin,source})};
}
test('all activities reward care without sensor and cannot double award',()=>{
  const h = harness();
  for(const b of h.actions){b.onclick();h.advance(10001);h.tick();h.nodes['#care-finish'].onclick();h.nodes['#care-finish'].onclick();}
  assert.equal(h.save().seeds,3);assert.equal(h.save().visits,3);
});
test('check-in wins, disconnect keeps progress, forged messages ignored',()=>{
  const h=harness();h.nodes['#care-connect'].onclick();
  const d={type:'mond-session',version:1,quality:'ready',source:'sensor',measurements:{rmssd_ms:50}};
  h.message(d,'https://wrong.example');assert.equal(h.nodes['#care-signal'].textContent.startsWith('Connecting'),true);
  h.message(d);h.nodes['#care-mood'].value='overwhelmed';h.nodes['#care-mood'].onchange();
  assert.match(h.nodes['#care-response'].textContent,/blanket/);
  h.actions[0].onclick();h.advance(10001);h.tick();h.nodes['#care-finish'].onclick();
  assert.match(h.nodes['#care-signal'].textContent,/disconnected/);assert.equal(h.save().seeds,1);
});
test('save loads and invalid storage does not break visits',()=>{
  assert.match(harness('{"seeds":7,"visits":7}').nodes['#care-progress'].textContent,/Fireflies/);
  assert.match(harness('bad json').nodes['#care-progress'].textContent,/0 seeds/);
});
