import React, { useState, useRef, useEffect } from 'react';
import { Target, Sword, Brain, Search, Lightbulb, ChevronRight, Loader2, LayoutDashboard, ShieldAlert, Zap, Camera, Heart, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import Markdown from 'react-markdown';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai'>('dashboard');
  
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'think' | 'search'>('think');
  const [result, setResult] = useState('');
  
  const endOfResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'ai') {
      endOfResultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result, activeTab]);

  const handleAnalyze = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setResult('');
    try {
      if (mode === 'think') {
        const prompt = `You are a master strategist embodying the wisdom of Sun Tzu, Zeng Guofan, and Mao Zedong. Analyze: "${problem}". Provide a structured, deep, and actionable strategic plan: 1.【识别本质】 2.【先为不可胜】 3.【统一战线与反击】 4.【强者心法】. Use a powerful, masculine, rational tone in Chinese.`;
        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.1-pro-preview',
          contents: prompt,
          config: { thinkingConfig: { thinkingLevel: 'HIGH' as any } }
        });
        for await (const chunk of responseStream) {
          setResult((prev) => prev + chunk.text);
        }
      } else {
        const prompt = `The user is facing this issue: "${problem}". Use Google Search to find relevant facts, laws, psychology research, or real-world practical advice. Summarize EXACT facts he can use to defend himself or win this situation in Chinese with bullet points.`;
        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { tools: [{ googleSearch: {} }] }
        });
        for await (const chunk of responseStream) {
          setResult((prev) => prev + chunk.text);
        }
      }
    } catch (error: any) {
      console.error(error);
      setResult(`分析时发生错误 / Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 md:p-6 lg:h-screen lg:flex lg:flex-col lg:overflow-hidden max-w-7xl mx-auto gap-6 transition-colors duration-500">
      
      {/* Header & Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 border-b border-slate-800 shrink-0 gap-4">
        <div>
          <div className="font-extrabold text-3xl tracking-tighter text-slate-100 flex items-center gap-3">
            <Brain className="text-red-500" size={32} />
            STRATEGIST <span className="text-red-500 font-light opacity-80">OS</span>
          </div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 ml-1">
            Tactical Analysis & Knowledge Matrix
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <LayoutDashboard size={16} />
             战略沉淀可视化 (Dashboard)
           </button>
           <button 
             onClick={() => setActiveTab('ai')}
             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <Zap size={16} />
             实时推演 (AI Engine)
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="grow min-h-0 relative">
        
        {/* ============================================== */}
        {/* VIEW 1: STATIC VISUAL DASHBOARD (No AI required) */}
        {/* ============================================== */}
        {activeTab === 'dashboard' && (
          <div className="h-full overflow-y-auto pr-2 pb-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Section 1: Historical Strategists */}
            <section>
              <h2 className="text-xl font-black text-slate-100 mb-4 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                <Sword className="text-amber-500" /> 一、 先哲战略原则与心法体系 (Master Strategists' Principles)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Sun Tzu */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl border-t-4 border-t-amber-700">
                  <div className="text-slate-500 font-bold text-xs mb-2">《孙子兵法》 (Sun Tzu)</div>
                  <h3 className="text-white font-bold mb-2">兵道与势能 (Action & Stealth)</h3>
                  <ul className="text-sm text-slate-400 space-y-3 list-disc pl-4">
                    <li><strong className="text-amber-400">暗度陈仓：</strong>掩盖真实意图（如将背影照混在风景日记中），降低对方的防御雷达。</li>
                    <li><strong className="text-amber-400">大巧若拙：</strong>“善战者无智名无勇功”。最高级的展示是漫不经心的（如松弛感抓拍），而非刻意用力、大声表白。</li>
                    <li><strong className="text-amber-400">致人而不致于人：</strong>把控社交节奏，留出心理悬念，掌握主动权，让对方主动探索你。</li>
                  </ul>
                </div>
                
                {/* Zeng Guofan */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl border-t-4 border-t-slate-500">
                  <div className="text-slate-500 font-bold text-xs mb-2">曾国藩 (Zeng Guofan)</div>
                  <h3 className="text-white font-bold mb-2">自律与防守 (Discipline & Defense)</h3>
                  <ul className="text-sm text-slate-400 space-y-3 list-disc pl-4">
                    <li><strong className="text-slate-300">结硬寨，打呆仗：</strong>放弃走捷径的幻想。肌肉、事业、内核都需要常年累月的枯燥积累。这是你真正的底座。</li>
                    <li><strong className="text-slate-300">不可轻率、傲慢：</strong>切忌像孔雀开屏般炫耀。拥有实力但保持深藏不露，才是真正的硬汉底色。</li>
                    <li><strong className="text-slate-300">情绪封锁：</strong>向内倾吐（日记反省），绝不对外做“怨妇式”抱怨与情绪索取。</li>
                  </ul>
                </div>

                {/* Mao Zedong & Wang Yangming */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl border-t-4 border-t-red-700">
                  <div className="text-slate-500 font-bold text-xs mb-2">毛泽东 & 王阳明</div>
                  <h3 className="text-white font-bold mb-2">破局与心智 (Leverage & Mindset)</h3>
                  <ul className="text-sm text-slate-400 space-y-3 list-disc pl-4">
                    <li><strong className="text-red-400">抓主要矛盾 (毛)：</strong>遭遇冲突时，剥离外界的情绪干扰与表象，直击核心利益点。</li>
                    <li><strong className="text-red-400">统一战线 (毛)：</strong>提供别人无法替代的高维生存或情绪价值，成为群体中不可或缺的定海神针。</li>
                    <li><strong className="text-red-400">知行合一 (王)：</strong>内方外圆。对弱者绝对温和，对越界试探给予一次性、理智的冰冷反击。</li>
                  </ul>
                </div>

              </div>
            </section>

            {/* Section 2: Relationship Science */}
            <section>
              <h2 className="text-xl font-black text-slate-100 mb-4 flex items-center gap-2 border-l-4 border-red-500 pl-3">
                <Heart className="text-red-500" /> 二、 亲密关系科学底层逻辑 (Relationship Science)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <div className="text-slate-500 font-bold text-xs mb-2">约翰·戈特曼实验室</div>
                  <h3 className="text-white font-bold mb-2">1. 情感呼唤 (Bids for Connection)</h3>
                  <p className="text-sm text-slate-400">决定生死存亡的不是激情，是对微小呼唤的回应率。高级浪漫是提供长期的情绪存款（白头偕老回应率86%）。</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl border-t-4 border-t-red-900">
                  <div className="text-slate-500 font-bold text-xs mb-2">冲突预测模型</div>
                  <h3 className="text-white font-bold mb-2">2. 末日四骑士 (4 Horsemen)</h3>
                  <p className="text-sm text-slate-400">摧毁关系的头号杀手是<strong className="text-red-400">“鄙视(Contempt)”</strong>。实操：采用XYZ表达法，永远就事论事，绝不攻击人格。</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <div className="text-slate-500 font-bold text-xs mb-2">鲍尔比依恋理论</div>
                  <h3 className="text-white font-bold mb-2">3. 安全型依恋 (Secure Attachment)</h3>
                  <p className="text-sm text-slate-400">避开“焦虑型(狂轰乱炸)”与“回避型(冷暴力)的虐恋轮回。强者向内克服回避，向外寻找情绪稳定的安全型结盟。</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <div className="text-slate-500 font-bold text-xs mb-2">阿瑟·阿伦模型</div>
                  <h3 className="text-white font-bold mb-2">4. 自我扩张模型 (Self-Expansion)</h3>
                  <p className="text-sm text-slate-400">激情消退是科学必然。通过共同探索“新奇且微挑战”的事物（如攀岩、密室），重建多巴胺分泌，延续爱情寿命。</p>
                </div>
              </div>
            </section>

            {/* Section 3: Social Value Matrix */}
            <section>
              <h2 className="text-xl font-black text-slate-100 mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                <Target className="text-blue-500" /> 三、 社交展示与心理学矩阵 (Social Presentation Matrix)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Value Tiers */}
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
                  <h3 className="text-white font-bold mb-1 border-b border-slate-800 pb-2">三大高维展示价值</h3>
                  
                  <div className="bg-slate-950 p-4 rounded-lg border border-emerald-900/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div className="font-bold text-emerald-400 text-sm mb-1">1. 生物/繁衍价值</div>
                    <div className="text-xs text-slate-400">核心：生命力与自律<br/>素材：硬核运动抓拍、合体剪裁衣物、清爽理容的外表。</div>
                  </div>
                  
                  <div className="bg-slate-950 p-4 rounded-lg border border-amber-900/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="font-bold text-amber-400 text-sm mb-1">2. 生存/社会价值</div>
                    <div className="text-xs text-slate-400">核心：资源获取与阶层<br/>素材：深度工作状态、高门槛社交认证、对某项事业的绝对掌控。</div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-purple-900/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <div className="font-bold text-purple-400 text-sm mb-1">3. 情绪/审美价值</div>
                    <div className="text-xs text-slate-400">核心：松弛感与品味<br/>素材：小众爱好、高阶审美（构图/色调）、自嘲幽默、情绪稳定。</div>
                  </div>
                </div>

                {/* Psychology Rules */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={18} className="text-yellow-500"/>
                      <h3 className="text-white font-bold">曝光方程 (Exposure Mechanics)</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-3 block">
                      <strong>【低频次心跳 + 高质量爆发】</strong><br/>
                      <span className="text-blue-400">单纯曝光效应</span>（上牌桌找存在感）配合 <span className="text-red-400">稀缺性原则</span>（抬高注意力估值）。
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                      <li>戒掉无效的“全自动点赞”。</li>
                      <li>自身动态半月1更，每次只发顶级切片。</li>
                      <li>像狙击手一样，只在关键时刻给出高质量点评。</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye size={18} className="text-blue-500"/>
                      <h3 className="text-white font-bold">神秘感法则 (Zeigarnik Effect)</h3>
                    </div>
                    <p className="text-sm text-slate-400 block pb-2">
                       利用“蔡加尼克效应（未完成效应）”。人类对无法看透的事物最着迷。
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                      <li>交谈时：说30%，留白70%。</li>
                      <li>文案篇：极致精炼，善用Emoji，拒绝长篇大论。</li>
                      <li>绝不暴露正在摧毁你的弱点，只暴露已战胜的弱点。</li>
                    </ul>
                  </div>
                  
                  <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldAlert size={18} className="text-red-500"/>
                      <h3 className="text-white font-bold">信号学排雷：社交展示的“四大死亡陷阱”</h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                       <div className="bg-slate-950 p-2 rounded border border-red-900/30 text-slate-400"><XCircle size={14} className="inline text-red-500 mb-1"/> 怨妇式倒苦水 (暴露情绪黑洞与低抗挫力)</div>
                       <div className="bg-slate-950 p-2 rounded border border-red-900/30 text-slate-400"><XCircle size={14} className="inline text-red-500 mb-1"/> 简历式炫耀/喊话 (证明欲太强，缺乏底气)</div>
                       <div className="bg-slate-950 p-2 rounded border border-red-900/30 text-slate-400"><XCircle size={14} className="inline text-red-500 mb-1"/> 极端防御性介绍 (如'骗子勿扰'，暴露戒备心)</div>
                       <div className="bg-slate-950 p-2 rounded border border-red-900/30 text-slate-400"><XCircle size={14} className="inline text-red-500 mb-1"/> 网络愤青与站队 (丧失从容，戾气外露)</div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 4: Visual Execution */}
            <section>
              <h2 className="text-xl font-black text-slate-100 mb-4 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                <Camera className="text-emerald-500" /> 四、 视觉摄影防雷与高维打法 (Visual Execution)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                
                {/* Do Nots */}
                <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><XCircle size={18}/> 极度降智的错误示范 (LOW VALUE)</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-red-300 shrink-0">油腻肌肉秀：</strong>
                      <span>洗手间对镜掀衣服、没有场景支撑的光膀子发力摆拍。潜台词：“我很需要你的称赞”。</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-red-300 shrink-0">讨好式满脸笑：</strong>
                      <span>生物学上的“从属者表情”。削弱统治力(Dominance)而过度迎合。</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-red-300 shrink-0">大头怼眼自拍：</strong>
                      <span>男人的大头自拍容易被判定为过度自恋、低自尊、缺乏生活场景支撑。</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-red-300 shrink-0">仰视/俯视装酷：</strong>
                      <span>下巴高高抬起展示的是暴发户式的傲慢；过度低头翻眼展示的是阴郁与不安全感。</span>
                    </li>
                  </ul>
                </div>

                {/* Do This */}
                <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-xl">
                  <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><CheckCircle2 size={18}/> 顶级强者的视觉语言 (HIGH VALUE)</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-emerald-300 shrink-0">隐形秀肌肉法：</strong>
                      <span>功能性抓拍（拿高处物品的背影/拉车门）、合身剪裁衣物撑起肩宽版型（穿衣显瘦脱衣有肉）。</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-emerald-300 shrink-0">面部表情公式：</strong>
                      <span>微微眯眼坚定(Squinch) + 下颌微收(Jawline Tilt) + 似有若无的自信微小(Smirk) + 专注力前置。</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-emerald-300 shrink-0">利用左脸偏差：</strong>
                      <span>拍摄时四分之三侧脸，留出左脸，生物学上左脸表达更多情感并具备吸引力，同时凸显下颌线轮廓。</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300">
                      <strong className="text-emerald-300 shrink-0">叙事掩护法：</strong>
                      <span>如“复古车+打伞”的构图。用故事感和松弛气氛包裹住你的硬件，制造“不战而屈人之兵”的高级感。</span>
                    </li>
                  </ul>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* ============================================== */}
        {/* VIEW 2: AI STRATEGIST ENGINE (Original UI) */}
        {/* ============================================== */}
        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full animate-in fade-in slide-in-from-right-8 duration-500">
             {/* Input Section (Left) */}
            <section className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pb-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col grow min-h-[400px]">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
                  Situation Briefing
                  <div className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                </div>
                
                <textarea 
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="描述你目前面临的困境、想要捍卫的权益，或者即将面对的冲突...\n\n例如：'公司新来的主管总是打压我，我该如何硬气地反击？'"
                  className="grow w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 resize-none focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all leading-relaxed"
                />
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setMode('think')}
                    className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${mode === 'think' ? 'bg-slate-800 text-white border border-slate-700 shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-800/50 border border-transparent'}`}
                  >
                    <Brain size={16} className={mode === 'think' ? 'text-red-500' : ''} />
                    高维战略推演
                  </button>
                  <button 
                     onClick={() => setMode('search')}
                    className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${mode === 'search' ? 'bg-slate-800 text-white border border-slate-700 shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-800/50 border border-transparent'}`}
                  >
                    <Search size={16} className={mode === 'search' ? 'text-blue-500' : ''} />
                    实证调查研究
                  </button>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !problem.trim()}
                  className="mt-4 w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.2)] disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={20} />}
                  {loading ? '正在解析局势...' : '启动战略矩阵'}
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl shrink-0">
                 <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Model Capabilities Engaged</div>
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div> Gemini 3.1 Pro (High Thinking)
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> Gemini 3 Flash (Google Search)
                    </div>
                 </div>
              </div>
            </section>

            {/* Output Section (Right) */}
            <section className="lg:col-span-8 bg-slate-900/30 border border-slate-800 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden backdrop-blur-sm mb-4">
              <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between shrink-0">
                 <div className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Target size={16} className="text-red-500" />
                    Actionable Intelligence
                 </div>
                 {loading && <div className="text-xs text-red-500 animate-pulse font-mono tracking-widest">Processing...</div>}
              </div>

              <div className="grow overflow-y-auto p-6 md:p-8 space-y-4">
                {!result && !loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                    <Sword size={48} className="opacity-20" />
                    <p className="text-sm font-medium tracking-wide uppercase">Awaiting Situation Input</p>
                    <div className="max-w-md text-center text-xs opacity-70 leading-loose mt-4">
                      "凡先处战地而待敌者佚，后处战地而趋战者劳。故善战者，致人而不致于人。" <br/> — 《孙子兵法》
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-slate max-w-none prose-h1:text-xl prose-h1:font-bold prose-h1:mb-6 prose-h2:text-lg prose-h2:text-red-400 prose-h2:mt-8 prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-slate-100 prose-li:text-slate-300">
                    <Markdown>{result}</Markdown>
                    <div ref={endOfResultRef} />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

      </main>
    </div>
  );
}
