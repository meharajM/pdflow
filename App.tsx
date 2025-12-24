
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
  LayoutTemplate
} from 'lucide-react';
import { DEFAULT_HTML, TEMPLATES } from './constants';
import { PaperSize, Orientation, PDFConfig, Template } from './types';
import { generatePDFFromIframe } from './utils/pdf';

const App: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewMode, setPreviewMode] = useState<'continuous' | 'pages'>('pages');
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
          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tighter text-slate-900 leading-none">PDFlow</h1>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-none">Pro Local Converter</span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl mr-4 border border-slate-200">
            <button 
              onClick={() => setPreviewMode('pages')} 
              aria-label="Switch to Page Break View"
              className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${previewMode === 'pages' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Layers size={14} /> PAGE BREAKS
            </button>
            <button 
              onClick={() => setPreviewMode('continuous')} 
              aria-label="Switch to Web View"
              className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${previewMode === 'continuous' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Monitor size={14} /> WEB VIEW
            </button>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            aria-label="Upload HTML file"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <Upload size={18} />
            <span className="hidden md:inline">Load HTML</span>
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label="Download generated PDF"
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black text-xs tracking-[0.2em] shadow-xl shadow-indigo-100 disabled:opacity-50 min-w-[200px] justify-center active:scale-95"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {isDownloading ? 'EXPORTING...' : 'DOWNLOAD PDF'}
          </button>
        </nav>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Templates & Privacy Value Props */}
        <aside className="w-80 bg-white border-r border-slate-200 hidden xl:flex flex-col p-8 space-y-10 overflow-y-auto shadow-sm">
          <section aria-labelledby="templates-title">
            <div className="flex items-center gap-2 mb-6">
              <LayoutTemplate size={16} className="text-slate-900" aria-hidden="true" />
              <h3 id="templates-title" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Instant Templates</h3>
            </div>
            <div className="grid gap-3">
              {TEMPLATES.map((tpl) => (
                <button 
                  key={tpl.id} 
                  onClick={() => handleTemplateSelect(tpl)} 
                  aria-label={`Select ${tpl.name} template`}
                  className="text-left p-4 border border-slate-100 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group bg-slate-50"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl" role="img" aria-label={tpl.name}>{tpl.icon}</span>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 text-sm tracking-tight">{tpl.name}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{tpl.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="privacy-title" className="space-y-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600" aria-hidden="true" />
              <h3 id="privacy-title" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Safe & Ad-Free</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Lock size={14} className="text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Zero Data Tracking</h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">We don't log your content or collect cookies. It's strictly your data.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Globe size={14} className="text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100% Client-Side</h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">Converts in your browser. Perfect for private docs and legal files.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Zap size={14} className="text-amber-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">No Ads, Ever</h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">Free, professional tool without distracting banners or upsells.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-auto pt-6 border-t border-slate-100">
             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">Browser-Native Performance</p>
          </footer>
        </aside>

        {/* Center: Editor & Preview */}
        <section className="flex-1 flex overflow-hidden" aria-label="Main Editor Workspace">
          {/* Editor Area */}
          <div className={`flex-1 flex flex-col bg-white transition-all ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'} border-r border-slate-200 relative`}>
            <div className="h-10 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
               <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-slate-400" aria-hidden="true" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">HTML / CSS Editor</span>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => setHtmlCode(DEFAULT_HTML)} aria-label="Reset to default code" className="p-1 text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-1.5"><RotateCcw size={12} /><span className="text-[9px] font-black tracking-widest">RESET</span></button>
                  <button onClick={() => setHtmlCode('')} aria-label="Clear all code" className="p-1 text-slate-400 hover:text-red-500 transition-all flex items-center gap-1.5"><Trash2 size={12} /><span className="text-[9px] font-black tracking-widest">CLEAR</span></button>
               </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <textarea
                aria-label="HTML markup editor"
                className="w-full h-full p-10 resize-none focus:outline-none bg-white text-slate-700 font-mono text-xs leading-loose selection:bg-indigo-100 no-scrollbar"
                spellCheck={false}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="Paste your HTML here..."
              />
            </div>
          </div>

          {/* Render Area */}
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
                        transform: 'translateY(-50%)',
                        left: 0,
                        right: 0
                      }}
                    >
                      <div className="bg-white/5 text-white/30 text-[9px] font-black tracking-[0.4em] px-6 py-2 rounded-full border border-white/5 uppercase">
                        Sheet Edge {i + 1}
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
            
            <div className="h-60 shrink-0" />
          </div>
        </section>

        {/* Right Sidebar: Dimensions & SEO Info */}
        <aside className="w-80 bg-white border-l border-slate-200 hidden 2xl:flex flex-col p-10 space-y-12 shadow-sm overflow-y-auto">
          <section aria-labelledby="settings-title">
            <div className="flex items-center gap-3 mb-8">
               <Settings size={14} className="text-slate-400" aria-hidden="true" />
               <h3 id="settings-title" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">PDF Settings</h3>
            </div>
            <div className="space-y-8">
              <div>
                <label htmlFor="paper-size" className="text-[11px] font-bold text-slate-400 block mb-4 uppercase tracking-widest">Paper Format</label>
                <select 
                  id="paper-size"
                  value={config.size} 
                  onChange={(e) => setConfig({...config, size: e.target.value as PaperSize})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer hover:bg-white"
                >
                  <option value={PaperSize.A4}>A4 (Standard)</option>
                  <option value={PaperSize.LETTER}>US Letter</option>
                  <option value={PaperSize.LEGAL}>US Legal</option>
                </select>
              </div>

              <fieldset>
                <legend className="text-[11px] font-bold text-slate-400 block mb-4 uppercase tracking-widest">Layout Orientation</legend>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setConfig({...config, orientation: Orientation.PORTRAIT})} 
                    aria-pressed={config.orientation === Orientation.PORTRAIT}
                    className={`flex flex-col items-center gap-3 py-6 border rounded-3xl transition-all text-[10px] font-black tracking-widest ${config.orientation === Orientation.PORTRAIT ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <div className="w-5 h-8 border-2 border-current rounded-sm mb-1 opacity-50" aria-hidden="true" />
                    PORTRAIT
                  </button>
                  <button 
                    onClick={() => setConfig({...config, orientation: Orientation.LANDSCAPE})} 
                    aria-pressed={config.orientation === Orientation.LANDSCAPE}
                    className={`flex flex-col items-center gap-3 py-6 border rounded-3xl transition-all text-[10px] font-black tracking-widest ${config.orientation === Orientation.LANDSCAPE ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <div className="w-8 h-5 border-2 border-current rounded-sm mb-1 opacity-50" aria-hidden="true" />
                    LANDSCAPE
                  </button>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="mt-auto" aria-labelledby="why-title">
             <div className="p-8 bg-slate-900 rounded-[32px] relative overflow-hidden group shadow-2xl">
                <div className="flex items-center gap-2 text-indigo-400 mb-4 relative z-10">
                   <Info size={16} aria-hidden="true" />
                   <span id="why-title" className="text-[10px] font-black uppercase tracking-[0.2em]">Private Conversion</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold relative z-10">
                  PDFlow prioritizes your privacy. By running the conversion engine directly in your browser, we ensure that sensitive data like invoices or legal contracts never touch a server.
                  <br /><br />
                  <span className="text-white">✓ High-Fidelity Rendering</span><br />
                  <span className="text-white">✓ Secure Local Processing</span><br />
                  <span className="text-white">✓ Open Source Standards</span>
                </p>
             </div>
          </section>
        </aside>
      </main>

      {/* Floating Action Mobile */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-10">
        <button 
          onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')} 
          aria-label={activeTab === 'editor' ? 'Switch to PDF Preview' : 'Switch to HTML Editor'}
          className="w-full bg-slate-950 text-white py-5 rounded-[24px] shadow-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.4em] border border-white/10"
        >
          {activeTab === 'editor' ? 'PREVIEW PDF' : 'EDIT MARKUP'}
        </button>
      </nav>
    </div>
  );
};

export default App;
