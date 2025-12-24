import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Upload,
  Layers,
  Monitor,
  Settings,
  Info,
  RotateCcw, 
  Trash2, 
  Loader2,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  FileCode,
  LayoutTemplate,
  ChevronRight,
  HelpCircle,
  Cpu,
  Star,
  CheckCircle2
} from 'lucide-react';
import { DEFAULT_HTML, TEMPLATES } from './constants.tsx';
import { PaperSize, Orientation, PDFConfig, Template } from './types.ts';
import { generatePDFFromIframe } from './utils/pdf.ts';

const App: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewMode, setPreviewMode] = useState<'pages' | 'continuous'>('pages');
  const [config, setConfig] = useState<PDFConfig>({
    size: PaperSize.A4,
    orientation: Orientation.PORTRAIT,
    margins: 10
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlCode);
        doc.close();
      }
    }
  }, [htmlCode]);

  const getPageHeightMm = () => {
    if (config.orientation === Orientation.LANDSCAPE) {
      if (config.size === PaperSize.A4) return 210;
      if (config.size === PaperSize.LETTER) return 215.9;
      return 215.9;
    }
    if (config.size === PaperSize.A4) return 297;
    if (config.size === PaperSize.LETTER) return 279.4;
    return 355.6;
  };

  const handleTemplateSelect = (template: Template) => {
    setHtmlCode(template.prompt);
    setActiveTab('preview');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setHtmlCode(content);
        setActiveTab('preview');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDownload = async () => {
    if (!iframeRef.current) return;
    setIsDownloading(true);
    setTimeout(async () => {
      try {
        await generatePDFFromIframe(iframeRef.current!, config, 'pdflow-export.pdf');
      } catch (err) {
        alert("Export failed. Try a simpler document or check browser memory.");
        console.error(err);
      } finally {
        setIsDownloading(false);
      }
    }, 100);
  };

  const pageHeightMm = getPageHeightMm();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 overflow-hidden font-sans">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".html,.htm" className="hidden" />

      {/* Exporting Engine Overlay */}
      {isDownloading && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-indigo-500 blur-[120px] opacity-40 animate-pulse"></div>
            <Loader2 className="animate-spin text-indigo-400 relative z-10" size={100} strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck size={32} className="text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter">Safe Local Export</h2>
          <p className="text-slate-400 max-w-sm font-semibold leading-relaxed text-lg">
            Processing PDF bytes 100% locally. Your content never touches our servers.
          </p>
        </div>
      )}

      {/* Main App Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200">P</div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-slate-900 leading-none">PDFlow</h1>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-none">Free HTML to PDF Converter</span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl mr-4 border border-slate-200">
            <button 
              onClick={() => setPreviewMode('pages')} 
              className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${previewMode === 'pages' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Layers size={14} /> PAGE BREAKS
            </button>
            <button 
              onClick={() => setPreviewMode('continuous')} 
              className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${previewMode === 'continuous' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Monitor size={14} /> WEB VIEW
            </button>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <Upload size={18} />
            <span className="hidden md:inline">Upload HTML</span>
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black text-xs tracking-[0.2em] shadow-xl shadow-indigo-100 disabled:opacity-50 min-w-[200px] justify-center active:scale-95"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {isDownloading ? 'PROCESSING...' : 'DOWNLOAD PDF'}
          </button>
        </nav>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 hidden xl:flex flex-col p-8 space-y-10 overflow-y-auto shadow-sm">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <LayoutTemplate size={16} className="text-slate-900" />
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Code Blueprints</h2>
            </div>
            <div className="grid gap-3">
              {TEMPLATES.map((tpl) => (
                <button 
                  key={tpl.id} 
                  onClick={() => handleTemplateSelect(tpl)} 
                  className="text-left p-4 border border-slate-100 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group bg-slate-50"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl">{tpl.icon}</span>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 text-sm tracking-tight">{tpl.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{tpl.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600" />
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Why PDFlow?</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Star size={14} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">100% Free Forever</h3>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">No monthly fees or hidden costs. Unlimited free conversions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Lock size={14} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Private & Secure</h3>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">Files never leave your device. Ideal for confidential documents.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-auto pt-6 border-t border-slate-100">
             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">Free Developer Tool • ai-worker.tech</p>
          </footer>
        </aside>

        {/* Center Workspace */}
        <section className="flex-1 flex overflow-hidden">
          <div className={`flex-1 flex flex-col bg-white transition-all ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'} border-r border-slate-200 relative`}>
            <div className="h-10 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
               <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">HTML / CSS Code</span>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => setHtmlCode(DEFAULT_HTML)} className="p-1 text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-1.5"><RotateCcw size={12} /><span className="text-[9px] font-black tracking-widest">RESET</span></button>
                  <button onClick={() => setHtmlCode('')} className="p-1 text-slate-400 hover:text-red-500 transition-all flex items-center gap-1.5"><Trash2 size={12} /><span className="text-[9px] font-black tracking-widest">CLEAR</span></button>
               </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <textarea
                aria-label="HTML/CSS Source Editor"
                className="w-full h-full p-10 resize-none focus:outline-none bg-white text-slate-700 font-mono text-xs leading-loose selection:bg-indigo-100 no-scrollbar"
                spellCheck={false}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
              />
            </div>
          </div>

          <div className={`flex-[1.8] bg-slate-900 overflow-auto flex flex-col items-center py-16 px-12 transition-all ${activeTab === 'editor' ? 'hidden md:flex' : 'flex'} relative shadow-inner`}>
            <div 
              className={`transition-all duration-700 relative ${previewMode === 'pages' ? 'bg-transparent shadow-none' : 'bg-white shadow-2xl rounded-sm'}`}
              style={{ 
                width: previewMode === 'pages' ? (config.orientation === Orientation.PORTRAIT ? '210mm' : '297mm') : '100%',
                minHeight: previewMode === 'pages' ? `${pageHeightMm}mm` : 'auto',
              }}
            >
              {previewMode === 'pages' && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-full flex items-center justify-center bg-slate-950/80 border-y border-white/5 backdrop-blur-md"
                      style={{ 
                        top: `${(i + 1) * pageHeightMm}mm`, 
                        height: '48px', 
                        transform: 'translateY(-50%)'
                      }}
                    >
                      <div className="bg-white/5 text-white/30 text-[9px] font-black tracking-[0.4em] px-6 py-2 rounded-full border border-white/5 uppercase">
                        Sheet Boundary {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={previewMode === 'pages' ? 'flex flex-col gap-0 bg-transparent' : 'w-full h-full'}>
                 <iframe
                    ref={iframeRef}
                    title="Live PDF Render Preview"
                    className="w-full border-none transition-all duration-300 bg-white shadow-2xl"
                    style={{ 
                      minHeight: previewMode === 'pages' ? '4000px' : 'calc(100vh - 200px)', 
                      height: 'fit-content' 
                    }}
                  />
              </div>
            </div>
            
            {/* SEO & VALUE PROPS SECTION */}
            <div className="max-w-4xl w-full mt-24 space-y-20 pb-40">
               <section className="bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-8">
                     <Cpu size={24} className="text-indigo-400" />
                     <h2 className="text-2xl font-black text-white tracking-tight">Best Free HTML to PDF Converter</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h3 className="text-indigo-300 font-bold text-sm uppercase tracking-widest">High-Fidelity Free Rendering</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        PDFlow provides a professional-grade <strong>free HTML to PDF</strong> solution. Unlike "free" tools that watermark your documents or limit your exports, our converter is unrestricted and watermark-free. We leverage the power of your browser's local resources to deliver desktop-quality PDFs without the server-side cost.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-indigo-300 font-bold text-sm uppercase tracking-widest">Why it's the #1 Choice</h3>
                      <ul className="text-slate-400 text-sm space-y-3">
                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <span><strong>No Account Needed:</strong> Start converting immediately.</span></li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <span><strong>Zero Ad Interruptions:</strong> Focus on your work, not banners.</span></li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <span><strong>Unlimited Usage:</strong> No daily conversion caps.</span></li>
                      </ul>
                    </div>
                  </div>
               </section>

               <section className="bg-indigo-600 rounded-[40px] p-12 shadow-2xl shadow-indigo-500/10">
                  <h2 className="text-2xl font-black text-white mb-8 tracking-tight">PDFlow vs. Paid Converters</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/10 rounded-3xl border border-white/20">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Star size={18} className="fill-white" /> PDFlow Free</h3>
                      <ul className="space-y-3 text-indigo-100 text-sm">
                        <li className="flex gap-2">✓ 100% Client-side privacy</li>
                        <li className="flex gap-2">✓ High-DPI Canvas Rendering</li>
                        <li className="flex gap-2">✓ Modern CSS & Web Fonts</li>
                        <li className="flex gap-2">✓ Completely Ad-Free</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/5 opacity-80">
                      <h3 className="text-slate-400 font-bold mb-4">Typical Paid Tools</h3>
                      <ul className="space-y-3 text-slate-500 text-sm">
                        <li className="flex gap-2">✗ Server-side data logging</li>
                        <li className="flex gap-2">✗ Expensive monthly subscriptions</li>
                        <li className="flex gap-2">✗ Limited fonts and layouts</li>
                        <li className="flex gap-2">✗ Distracting ad banners</li>
                      </ul>
                    </div>
                  </div>
               </section>

               <section className="space-y-8">
                  <div className="flex items-center gap-3">
                     <HelpCircle size={24} className="text-indigo-400" />
                     <h2 className="text-2xl font-black text-white tracking-tight">Free HTML to PDF FAQ</h2>
                  </div>
                  <div className="grid gap-4">
                    {[
                      { q: "Is this really a free HTML to PDF tool?", a: "Yes, PDFlow is 100% free. We built this as a utility for the developer community on ai-worker.tech. There are no paid tiers, watermarks, or hidden limits." },
                      { q: "Does it support Tailwind CSS?", a: "Yes. Simply include the Tailwind CDN script in your HTML header (like our templates do) and you can use any Tailwind classes for free." },
                      { q: "How do you handle my data privacy?", a: "Because we are a client-side tool, your HTML code and the generated PDF bytes never leave your browser. We don't have a backend to 'see' your documents." }
                    ].map((faq, i) => (
                      <details key={i} className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors">
                        <summary className="p-6 cursor-pointer font-bold text-slate-300 flex items-center justify-between list-none outline-none">
                          {faq.q}
                          <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="p-6 pt-0 text-slate-500 text-sm border-t border-white/5 bg-slate-950/20">
                          {faq.a}
                        </div>
                      </details>
                    ))}
                  </div>
               </section>
            </div>
          </div>
        </section>

        {/* Right Settings Sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 hidden 2xl:flex flex-col p-10 space-y-12 shadow-sm">
          <section>
            <div className="flex items-center gap-3 mb-8">
               <Settings size={14} className="text-slate-400" />
               <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Export Options</h2>
            </div>
            <div className="space-y-8">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-4 uppercase tracking-widest">Paper Size</label>
                <select 
                  value={config.size} 
                  onChange={(e) => setConfig({...config, size: e.target.value as PaperSize})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer hover:bg-white"
                >
                  <option value={PaperSize.A4}>A4 (Standard)</option>
                  <option value={PaperSize.LETTER}>US Letter</option>
                  <option value={PaperSize.LEGAL}>US Legal</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-4 uppercase tracking-widest">Layout</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setConfig({...config, orientation: Orientation.PORTRAIT})} 
                    className={`flex flex-col items-center gap-3 py-6 border rounded-3xl transition-all text-[10px] font-black tracking-widest ${config.orientation === Orientation.PORTRAIT ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    PORTRAIT
                  </button>
                  <button 
                    onClick={() => setConfig({...config, orientation: Orientation.LANDSCAPE})} 
                    className={`flex flex-col items-center gap-3 py-6 border rounded-3xl transition-all text-[10px] font-black tracking-widest ${config.orientation === Orientation.LANDSCAPE ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    LANDSCAPE
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-auto">
             <div className="p-8 bg-slate-900 rounded-[32px] relative overflow-hidden group shadow-2xl">
                <div className="flex items-center gap-2 text-indigo-400 mb-4 relative z-10">
                   <Star size={16} className="fill-indigo-400" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Always Free</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold relative z-10">
                  PDFlow is maintained as a free utility for the web. We believe high-quality PDF conversion should be private, fast, and accessible to everyone without cost.
                </p>
             </div>
          </section>
        </aside>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-10">
        <button 
          onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')} 
          className="w-full bg-slate-950 text-white py-5 rounded-[24px] shadow-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.4em] border border-white/10"
        >
          {activeTab === 'editor' ? 'VIEW PREVIEW' : 'EDIT MARKUP'}
        </button>
      </nav>
    </div>
  );
};

export default App;