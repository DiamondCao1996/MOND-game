'use strict';
const content = {
  en: [
    {kicker:'01 / SENSE',title:'Listen before interpreting.',copy:'HRV is the starting point. We’re designing around signal quality and a personal baseline, so an isolated reading doesn’t have to tell the whole story.',tags:['HRV','Signal quality','Personal baseline'],label:'A signal, in context'},
    {kicker:'02 / UNDERSTAND',title:'Make the reasoning visible.',copy:'Our explainable AI concept connects patterns with research-linked rules. The aim is to show why an insight appears, and how much confidence to place in it.',tags:['Explainable AI','Research-linked rules','Confidence'],label:'Patterns become understandable'},
    {kicker:'03 / SUPPORT',title:'Bring understanding into everyday care.',copy:'We’re exploring how understandable insights can support wellbeing conversations and organisational services, with a clear place for human judgement.',tags:['Wellbeing conversations','Human judgement','Pilot learning'],label:'Understanding, with a human purpose'}
  ],
  zh: [
    {kicker:'01 / 感知',title:'先倾听，再理解。',copy:'以 HRV 为起点，围绕信号质量与个人基线进行设计。我们希望观察变化趋势，而不是让一次读数讲述全部故事。',tags:['心率变异性','信号质量','个人基线'],label:'将信号放回情境'},
    {kicker:'02 / 理解',title:'让推理过程看得见。',copy:'我们的可解释 AI 概念，将信号模式与有研究依据的规则联系起来，帮助人们理解洞察为何出现，以及它有多大可信度。',tags:['可解释 AI','研究依据','置信度'],label:'让模式变得可理解'},
    {kicker:'03 / 支持',title:'把理解带入日常关怀。',copy:'我们正在探索，如何让易于理解的洞察支持身心关怀对话与组织服务，同时为人的判断保留清晰的位置。',tags:['关怀对话','人的判断','试点学习'],label:'以理解支持人'}
  ]
};
let language = 'en';
let activeStep = 0;
const nav = document.querySelector('#navigation');
const menu = document.querySelector('.menu-toggle');
const tabs = [...document.querySelectorAll('[data-step]')];
function setMenu(open){nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',language === 'en' ? (open?'Close menu':'Open menu') : (open?'关闭菜单':'打开菜单'));}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});
function setStep(index){
  activeStep=index;
  const item=content[language][index];
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  document.querySelector('#step-panel').setAttribute('aria-labelledby','step-'+index);
  for(const key of ['kicker','title','copy'])document.querySelector('#step-'+key).textContent=item[key];
  document.querySelector('#signal-label').textContent=item.label;
  document.querySelector('#step-tags').replaceChildren(...item.tags.map(tag=>{const el=document.createElement('span');el.textContent=tag;return el;}));
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>setStep(index));
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%tabs.length;if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();setStep(next);tabs[next].focus();}});
});
document.querySelector('#language').addEventListener('click',()=>{
  language=language==='en'?'zh':'en';
  document.documentElement.lang=language==='en'?'en':'zh-CN';
  document.querySelectorAll('[data-en][data-zh]').forEach(el=>{el.innerHTML=el.dataset[language];});
  const button=document.querySelector('#language');button.textContent=language==='en'?'中文':'EN';button.setAttribute('aria-label',language==='en'?'Switch to Chinese':'Switch to English');
  document.title=language==='en'?'MOND — A little closer to how you feel':'MOND — 更懂身体，也更懂自己';
  setStep(activeStep);setMenu(false);
});
document.querySelector('#year').textContent=String(new Date().getFullYear());
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:0.08});
  document.querySelectorAll('.vision h2,.vision-bottom,.product-copy,.approach-heading,.story-intro,.founders article,.contact h2').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});
}
