
import { Template } from './types';

export const TEMPLATES: Template[] = [
  {
    id: 'invoice',
    name: 'Modern Invoice',
    description: 'Clean billing statement with professional slate accents',
    icon: '📄',
    prompt: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .print-only { display: none; }
    @media print { .print-only { display: block; } }
  </style>
</head>
<body class="bg-white p-10">
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-start mb-16">
      <div>
        <div class="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-4">L</div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tighter">INVOICE</h1>
        <p class="text-slate-500 font-medium">#INV-2025-0042</p>
      </div>
      <div class="text-right">
        <h2 class="font-bold text-slate-900">Luminal Design Studio</h2>
        <p class="text-slate-500 text-sm">123 Innovation Drive<br>San Francisco, CA 94103<br>contact@luminal.io</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-12 mb-16">
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</p>
        <p class="font-bold text-slate-900 text-lg">CloudScale Systems Inc.</p>
        <p class="text-slate-500 text-sm leading-relaxed">Attn: Finance Department<br>456 Enterprise Way, Suite 200<br>Austin, TX 78701</p>
      </div>
      <div class="text-right space-y-2">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Details</p>
        <div class="flex justify-end gap-8">
          <span class="text-slate-500 text-sm">Issued Date:</span>
          <span class="text-slate-900 text-sm font-bold">May 12, 2025</span>
        </div>
        <div class="flex justify-end gap-8">
          <span class="text-slate-500 text-sm">Due Date:</span>
          <span class="text-slate-900 text-sm font-bold">June 12, 2025</span>
        </div>
      </div>
    </div>

    <table class="w-full mb-12">
      <thead>
        <tr class="border-b-2 border-slate-900">
          <th class="text-left py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Item Description</th>
          <th class="text-center py-4 text-xs font-bold text-slate-900 uppercase tracking-wider w-24">Qty</th>
          <th class="text-right py-4 text-xs font-bold text-slate-900 uppercase tracking-wider w-32">Rate</th>
          <th class="text-right py-4 text-xs font-bold text-slate-900 uppercase tracking-wider w-32">Amount</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr>
          <td class="py-6">
            <p class="font-bold text-slate-900">UI/UX Strategy & Design</p>
            <p class="text-xs text-slate-500 mt-1">Full redesign of the core dashboard and mobile experience.</p>
          </td>
          <td class="py-6 text-center text-slate-700">1</td>
          <td class="py-6 text-right text-slate-700">$4,500.00</td>
          <td class="py-6 text-right font-bold text-slate-900">$4,500.00</td>
        </tr>
        <tr>
          <td class="py-6">
            <p class="font-bold text-slate-900">Frontend Engineering</p>
            <p class="text-xs text-slate-500 mt-1">React component architecture and Tailwind implementation.</p>
          </td>
          <td class="py-6 text-center text-slate-700">40h</td>
          <td class="py-6 text-right text-slate-700">$120.00</td>
          <td class="py-6 text-right font-bold text-slate-900">$4,800.00</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end pt-8 border-t-2 border-slate-100">
      <div class="w-64 space-y-4">
        <div class="flex justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span>$9,300.00</span>
        </div>
        <div class="flex justify-between text-sm text-slate-500">
          <span>VAT (10%)</span>
          <span>$930.00</span>
        </div>
        <div class="flex justify-between text-xl font-bold text-slate-900 border-t border-slate-900 pt-4">
          <span>Total Amount</span>
          <span>$10,230.00</span>
        </div>
      </div>
    </div>

    <div class="mt-24 p-8 bg-slate-50 rounded-2xl border border-slate-100">
      <h4 class="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Bank Transfer Info</h4>
      <div class="grid grid-cols-2 gap-4 text-xs">
        <p class="text-slate-500">Bank Name: <span class="text-slate-900 font-bold">Global Trust Bank</span></p>
        <p class="text-slate-500">Account Number: <span class="text-slate-900 font-bold">8829 1102 3349</span></p>
        <p class="text-slate-500">SWIFT/BIC: <span class="text-slate-900 font-bold">GTBUSS33</span></p>
        <p class="text-slate-500">Reference: <span class="text-slate-900 font-bold">INV-2025-0042</span></p>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'resume',
    name: 'Executive Resume',
    description: 'Minimalist layout with a focused professional sidebar',
    icon: '👤',
    prompt: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-slate-800 p-0 m-0">
  <div class="flex min-h-screen">
    <div class="w-1/3 bg-slate-900 text-white p-12">
      <div class="mb-12">
        <div class="w-32 h-32 bg-slate-700 rounded-full mb-6 border-4 border-slate-800"></div>
        <h1 class="text-3xl font-bold leading-tight mb-2">Alex<br>Rivera</h1>
        <p class="text-indigo-400 font-medium tracking-widest text-xs uppercase">Senior Product Designer</p>
      </div>

      <div class="space-y-8">
        <div>
          <h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Contact</h2>
          <ul class="text-xs space-y-3 text-slate-300">
            <li class="flex items-center gap-2">arivera@email.com</li>
            <li class="flex items-center gap-2">+1 (555) 234-5678</li>
            <li class="flex items-center gap-2">San Francisco, CA</li>
            <li class="flex items-center gap-2">linkedin.com/in/alexr</li>
          </ul>
        </div>

        <div>
          <h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Core Skills</h2>
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">Figma</span>
            <span class="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">React</span>
            <span class="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">TypeScript</span>
            <span class="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">Node.js</span>
            <span class="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">Agile</span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-2/3 p-16">
      <section class="mb-12">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Professional Summary</h2>
        <p class="text-sm text-slate-600 leading-relaxed">
          Dynamic Product Designer with 8+ years of experience in building scalable design systems and high-conversion user interfaces. Specialized in bridging the gap between design and engineering.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Experience</h2>
        <div class="space-y-8">
          <div>
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-bold text-slate-900">Lead Designer @ Stripe</h3>
              <span class="text-[10px] font-bold text-indigo-600 uppercase">2021 — Present</span>
            </div>
            <p class="text-xs text-slate-500 mb-3 italic">San Francisco, CA</p>
            <ul class="text-xs text-slate-600 space-y-2 list-disc ml-4">
              <li>Spearheaded the redesign of the merchant onboarding flow, increasing conversion by 22%.</li>
              <li>Mentored a team of 5 junior designers across the US and Europe.</li>
            </ul>
          </div>
          <div>
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-bold text-slate-900">Senior UI Engineer @ Airbnb</h3>
              <span class="text-[10px] font-bold text-indigo-600 uppercase">2018 — 2021</span>
            </div>
            <p class="text-xs text-slate-500 mb-3 italic">Seattle, WA</p>
            <ul class="text-xs text-slate-600 space-y-2 list-disc ml-4">
              <li>Developed core components for the 'Lottie' animation library integration.</li>
              <li>Reduced application bundle size by 15% through aggressive refactoring.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'report',
    name: 'Business Memo',
    description: 'Structured formal report for corporate communication',
    icon: '📊',
    prompt: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white p-16 text-slate-800 leading-relaxed">
  <div class="max-w-3xl mx-auto">
    <div class="border-b-4 border-slate-900 pb-8 mb-12">
      <h1 class="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Strategic Overview</h1>
      <p class="text-slate-500 font-bold uppercase text-xs tracking-[0.3em]">Fiscal Quarter Q3 - 2025</p>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-12 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <div class="font-bold text-slate-500">To:</div>
      <div class="col-span-3 font-bold text-slate-900">Board of Directors, Executive Committee</div>
      <div class="font-bold text-slate-500">From:</div>
      <div class="col-span-3 font-bold text-slate-900">Chief Technology Officer</div>
      <div class="font-bold text-slate-500">Date:</div>
      <div class="col-span-3 text-slate-700">October 14, 2025</div>
      <div class="font-bold text-slate-500">Subject:</div>
      <div class="col-span-3 text-indigo-600 font-bold">AI Infrastructure Souring & Expansion</div>
    </div>

    <h2 class="text-xl font-bold text-slate-900 mb-4">1. Executive Summary</h2>
    <p class="mb-8 text-slate-600">
      This memorandum outlines the proposed budget allocation for the next fiscal period, specifically focusing on our transition to cloud-native high-performance computing clusters. Preliminary data suggests a 40% reduction in operational latency.
    </p>

    <h2 class="text-xl font-bold text-slate-900 mb-4">2. Key Performance Indicators</h2>
    <div class="grid grid-cols-3 gap-6 mb-12">
      <div class="p-4 border border-slate-200 rounded-xl">
        <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Growth</p>
        <p class="text-2xl font-black text-green-600">+12.4%</p>
      </div>
      <div class="p-4 border border-slate-200 rounded-xl">
        <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Churn</p>
        <p class="text-2xl font-black text-red-600">-2.1%</p>
      </div>
      <div class="p-4 border border-slate-200 rounded-xl">
        <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Uptime</p>
        <p class="text-2xl font-black text-indigo-600">99.98%</p>
      </div>
    </div>

    <h2 class="text-xl font-bold text-slate-900 mb-4">3. Future Projections</h2>
    <p class="text-slate-600 mb-4">
      As we look toward Q4, the primary focus remains on market stabilization. Our current trajectory indicates we will surpass our annual revenue targets by roughly $2.4M if current adoption rates persist.
    </p>
    
    <div class="mt-20 pt-8 border-t border-slate-200 flex justify-between items-end">
      <div>
        <div class="w-32 h-12 bg-slate-100 rounded mb-4"></div>
        <p class="font-bold text-slate-900">Dr. Sarah Jenkins</p>
        <p class="text-xs text-slate-500">CTO, Nexus Corp</p>
      </div>
      <p class="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Confidential Document</p>
    </div>
  </div>
</body>
</html>`
  }
];

export const DEFAULT_HTML = TEMPLATES[0].prompt;
