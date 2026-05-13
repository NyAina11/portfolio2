import {
  Download, TerminalSquare, Cpu, Server, Code2, Network, Router,
  GraduationCap, Mail, Share2, Phone, ArrowDown
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="text-on-surface font-body-md antialiased min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 cyber-grid -z-20"></div>
      <div className="fixed inset-0 scanline-overlay -z-10"></div>
      <div className="fixed top-0 left-0 w-full h-1 bg-cyber-cyan animate-pulse -z-10 shadow-[0_0_20px_#00f3ff]"></div>

      {/* TopNavBar */}
      <nav className="sticky top-0 w-full z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto relative">
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan"></div>
          
          <div className="flex items-center gap-4">
            <div className="font-label-caps text-[12px] font-bold tracking-widest text-cyber-cyan border border-cyber-cyan/50 px-3 py-1 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyber-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              NY_AINA.EXE
            </div>
            <span className="hidden lg:inline-block font-code-sm text-[10px] text-cyber-cyan/50 animate-pulse">SYS_READY_</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {['STACK', 'PROJECTS', 'TIMELINE', 'CONTACT'].map((item, i) => (
              <a key={item} className="text-on-surface-variant hover:text-cyber-cyan transition-all duration-300 font-label-caps text-[11px] tracking-widest relative group" href={`#${item.toLowerCase()}`}>
                [0{i + 1}] {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyber-cyan group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
          
          <button className="text-cyber-dark bg-cyber-cyan font-label-caps text-[12px] px-4 py-2 hover:bg-transparent hover:text-cyber-cyan border border-cyber-cyan transition-all duration-300 flex items-center gap-2 group relative overflow-hidden">
            <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-[scanline_2s_linear_infinite] group-hover:hidden"></span>
            <span className="relative z-10 flex items-center gap-2 font-bold">
              RESUME.PDF
              <Download className="w-4 h-4" />
            </span>
          </button>
        </div>
      </nav>

      {/* Tech Margins */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8 opacity-40 z-0">
        <div className="tech-deco-y font-code-sm text-[10px] text-cyber-cyan tracking-[0.2em] animate-pulse">LAT: 18.8792° S</div>
        <div className="w-[1px] h-24 bg-cyber-cyan/30"></div>
        <div className="font-code-sm text-[10px] text-cyber-cyan/50 rotate-90">v2.0.4</div>
      </div>
      
      <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8 opacity-40 z-0">
        <div className="tech-deco-y font-code-sm text-[10px] text-cyber-purple tracking-[0.2em]">LONG: 47.5079° E</div>
        <div className="w-[1px] h-24 bg-cyber-purple/30"></div>
        <div className="font-code-sm text-[10px] text-cyber-purple/50 rotate-90">SECURE</div>
      </div>

      <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-12 gap-24 py-16 relative z-10">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full min-h-[85vh] flex flex-col justify-center relative mt-8" id="hero">
          <div className="absolute right-0 top-20 opacity-20 font-code-sm text-[10px] leading-tight text-cyber-cyan text-right pointer-events-none select-none hidden md:block">
            01001110 01011001<br/>01000001 01001001<br/>01001110 01000001<br/><br/>
            SYS.INIT()...<br/>LOADING MODULES...<br/>[OK] CORE<br/>[OK] AI_AGENT<br/>[OK] DEVOPS
          </div>
          
          <div className="terminal-window p-8 md:p-16 max-w-5xl relative z-10">
            <div className="absolute top-0 left-0 w-full h-8 bg-cyber-cyan/10 border-b border-cyber-cyan/30 flex items-center px-4 gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
              <span className="ml-4 font-code-sm text-[10px] text-cyber-cyan/70">root@nyaina:~# /bin/bash</span>
            </div>
            
            <div className="mt-8">
              <div className="inline-flex items-center gap-3 px-3 py-1 border border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan font-code-sm text-[11px] mb-8 relative">
                <span className="w-2 h-2 bg-cyber-cyan animate-pulse"></span>
                STATUS: ONLINE // IDLE
                <div className="absolute -right-1 -top-1 w-2 h-2 border-t border-r border-cyber-cyan"></div>
                <div className="absolute -left-1 -bottom-1 w-2 h-2 border-b border-l border-cyber-cyan"></div>
              </div>
              
              <h1 className="font-display-lg text-[40px] md:text-[64px] font-black text-white mb-6 tracking-tighter uppercase leading-[1.1]">
                <span className="block text-cyber-cyan font-code-sm text-sm tracking-widest font-normal mb-2 opacity-80">IDENTIFICATION:</span>
                <span className="glitch-text inline-block relative" data-text="NY AINA RAKOTONIRINA">
                  NY AINA RAKOTONIRINA
                </span>
              </h1>
              
              <div className="font-code-sm text-lg md:text-xl text-on-surface-variant max-w-3xl mb-12 border-l-2 border-cyber-purple pl-4 py-2 bg-cyber-purple/5">
                <p className="mb-2"><span className="text-cyber-purple font-bold">&gt; ROLE:</span> Agent IA & Automatisation</p>
                <p className="mb-2"><span className="text-cyber-purple font-bold">&gt; SUB_ROLE_1:</span> DevOps Engineer</p>
                <p><span className="text-cyber-purple font-bold">&gt; SUB_ROLE_2:</span> Fullstack Developer</p>
              </div>
              
              <div className="flex flex-wrap gap-6 items-center">
                <a className="relative inline-flex group" href="#projects">
                  <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-cyan rounded-sm blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"></div>
                  <button className="relative inline-flex items-center gap-3 justify-center px-8 py-4 font-label-caps text-sm font-bold text-cyber-dark bg-cyber-cyan transition-all duration-200 uppercase">
                    EXECUTE // VOIR_LES_PROJETS
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </button>
                </a>
                <div className="font-code-sm text-xs text-cyber-cyan/50 animate-pulse">Awaiting input... _</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full relative" id="profile">
          <div className="absolute left-[-20px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyber-cyan/50 to-transparent hidden md:block"></div>
          <div className="absolute left-[-24px] top-1/2 w-[9px] h-[9px] border border-cyber-cyan bg-cyber-dark rotate-45 hidden md:block"></div>
          
          <div className="terminal-window p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 blur-[50px] rounded-full group-hover:bg-cyber-cyan/10 transition-all duration-500"></div>
            
            <div className="flex items-center justify-between border-b border-cyber-cyan/30 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <TerminalSquare className="text-cyber-cyan w-6 h-6" />
                <h2 className="font-headline-lg text-2xl md:text-3xl text-white font-bold tracking-tight">cat profil.sh</h2>
              </div>
              <span className="font-code-sm text-[10px] text-cyber-cyan/50 px-2 py-1 border border-cyber-cyan/30">READ_ONLY</span>
            </div>
            
            <div className="font-code-sm text-sm text-on-surface-variant leading-relaxed space-y-4 pl-4 border-l border-cyber-cyan/20">
              <p><span className="text-cyber-cyan font-bold">#!/bin/bash</span></p>
              <p className="flex gap-2"><span className="text-cyber-cyan opacity-50">1|</span> Développeur fullstack spécialisé en automatisation et systèmes basés sur l’IA.</p>
              <p className="flex gap-2"><span className="text-cyber-cyan opacity-50">2|</span> Conception et déploiement de solutions complètes, du backend à l’infrastructure (Docker, CI/CD), avec une approche orientée performance et automatisation.</p>
              <p className="flex gap-2"><span className="text-cyber-cyan opacity-50">3|</span> Expérience en freelance et en environnement professionnel sur des projets concrets : agents IA, workflows automatisés, intégrations API et applications web.</p>
              <p className="flex gap-2"><span className="text-cyber-cyan opacity-50">4|</span> À l'aise dans des environnements Linux et DevOps, avec un fort intérêt pour l'optimisation des systèmes.</p>
              <p className="animate-pulse text-cyber-cyan mt-4">_</p>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full relative" id="stack">
          <div className="flex flex-col mb-12 relative">
            <h2 className="font-display-lg text-[32px] md:text-[48px] font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <span className="text-cyber-purple">01.</span> TECH_MATRIX
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-cyber-purple via-cyber-cyan/20 to-transparent mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI & Auto */}
            <div className="terminal-window p-6 group hover:border-cyber-purple transition-colors duration-300">
              <div className="flex justify-between items-start mb-6 border-b border-cyber-purple/30 pb-4">
                <h3 className="font-label-caps text-sm text-cyber-purple font-bold tracking-widest">SYS.AI_AUTO</h3>
                <Cpu className="text-cyber-purple/50 w-6 h-6" />
              </div>
              <ul className="space-y-4 font-code-sm text-sm text-on-surface-variant">
                {['n8n, Make', 'Agents IA (LLM)', 'API REST / Webhooks'].map(item => (
                  <li key={item} className="flex items-center gap-3 group/item">
                    <div className="w-1.5 h-1.5 bg-cyber-purple rounded-sm group-hover/item:shadow-[0_0_8px_#bc13fe] transition-all"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 h-1 w-full bg-cyber-purple/10 overflow-hidden">
                <div className="h-full bg-cyber-purple w-[90%] shadow-[0_0_10px_#bc13fe]"></div>
              </div>
            </div>

            {/* DevOps */}
            <div className="terminal-window p-6 group hover:border-cyber-cyan transition-colors duration-300">
              <div className="flex justify-between items-start mb-6 border-b border-cyber-cyan/30 pb-4">
                <h3 className="font-label-caps text-sm text-cyber-cyan font-bold tracking-widest">SYS.DEVOPS</h3>
                <Server className="text-cyber-cyan/50 w-6 h-6" />
              </div>
              <ul className="space-y-4 font-code-sm text-sm text-on-surface-variant">
                {['Docker & Compose', 'GitHub Actions (CI/CD)', 'GNU/Linux'].map(item => (
                  <li key={item} className="flex items-center gap-3 group/item">
                    <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-sm group-hover/item:shadow-[0_0_8px_#00f3ff] transition-all"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 h-1 w-full bg-cyber-cyan/10 overflow-hidden">
                <div className="h-full bg-cyber-cyan w-[85%] shadow-[0_0_10px_#00f3ff]"></div>
              </div>
            </div>

            {/* Dev & Lang */}
            <div className="terminal-window p-6 group hover:border-cyber-cyan transition-colors duration-300">
              <div className="flex justify-between items-start mb-6 border-b border-cyber-cyan/30 pb-4">
                <h3 className="font-label-caps text-sm text-cyber-cyan font-bold tracking-widest">SYS.DEV_LANG</h3>
                <Code2 className="text-cyber-cyan/50 w-6 h-6" />
              </div>
              <ul className="space-y-4 font-code-sm text-sm text-on-surface-variant">
                {['Python (Django)', 'JavaScript (Node.js)', 'PHP, C++'].map(item => (
                  <li key={item} className="flex items-center gap-3 group/item">
                    <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-sm group-hover/item:shadow-[0_0_8px_#00f3ff] transition-all"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 h-1 w-full bg-cyber-cyan/10 overflow-hidden">
                <div className="h-full bg-cyber-cyan w-[80%] shadow-[0_0_10px_#00f3ff]"></div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Projects Grid Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full" id="projects">
          <div className="flex flex-col mb-12 relative">
            <h2 className="font-display-lg text-[32px] md:text-[48px] font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <span className="text-cyber-cyan">02.</span> ACTIVE_NODES
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-cyber-cyan via-cyber-purple/20 to-transparent mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
            
            {/* Project 1 */}
            <div className="terminal-window p-6 lg:col-span-2 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[radial-gradient(circle,rgba(0,243,255,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-headline-lg text-2xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">Déploiement Docker multi-services</h3>
                    <span className="font-code-sm text-[10px] text-cyber-cyan border border-cyber-cyan/30 px-2 py-1 bg-cyber-cyan/5">TYPE: PERSO_PROJECT</span>
                  </div>
                  <Network className="w-10 h-10 text-cyber-cyan/20 group-hover:text-cyber-cyan/50 transition-colors" />
                </div>
                <p className="font-code-sm text-sm text-on-surface-variant mb-6 border-l-2 border-cyber-cyan/30 pl-4 bg-cyber-cyan/5 py-2">
                  Architecture conteneurisée complexe intégrant des outils d'automatisation et d'IA en réseau fermé.
                </p>
                <ul className="font-code-sm text-xs text-cyber-cyan/80 space-y-2 mb-8">
                  <li className="flex gap-2"><span className="text-cyber-purple">&gt;</span> n8n + service web exposé via Ngrok avec LLM embarqué</li>
                  <li className="flex gap-2"><span className="text-cyber-purple">&gt;</span> Docker Compose, reverse proxy, gestion env vars</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 z-10 border-t border-cyber-cyan/20 pt-4 mt-auto">
                {['Docker', 'n8n', 'Ngrok'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-cyber-dark text-cyber-cyan font-code-sm text-[10px] border border-cyber-cyan/50 shadow-[0_0_5px_rgba(0,243,255,0.2)]">{tag}</span>
                ))}
              </div>
            </div>

            {/* Project 4 */}
            <div className="terminal-window p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 border-cyber-purple/50">
              <div className="z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-headline-lg text-xl font-bold text-white mb-2 group-hover:text-cyber-purple transition-colors">Infra Web Complète</h3>
                    <span className="font-code-sm text-[10px] text-cyber-purple border border-cyber-purple/30 px-2 py-1 bg-cyber-purple/5">TYPE: ACADÉMIQUE</span>
                  </div>
                </div>
                <p className="font-code-sm text-xs text-on-surface-variant mb-4 border-l-2 border-cyber-purple/30 pl-3">
                  Déploiement complet d'une infrastructure serveur sous environnement GNU/Linux.
                </p>
                <ul className="font-code-sm text-[11px] text-cyber-purple/80 space-y-1 mb-6">
                  <li className="flex gap-2"><span>&gt;</span> Stack Web complet (LAMP/LEMP)</li>
                  <li className="flex gap-2"><span>&gt;</span> Configuration serveur Mail et DNS</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 z-10 border-t border-cyber-purple/20 pt-4 mt-auto">
                <span className="px-2 py-1 bg-cyber-dark text-cyber-purple font-code-sm text-[10px] border border-cyber-purple/50">GNU/Linux</span>
                <span className="px-2 py-1 bg-cyber-dark text-cyber-purple/70 font-code-sm text-[10px] border border-cyber-purple/30">DNS</span>
                <span className="px-2 py-1 bg-cyber-dark text-cyber-purple/70 font-code-sm text-[10px] border border-cyber-purple/30">Web Server</span>
              </div>
            </div>

            {/* Project 2 */}
            <div className="terminal-window p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 border-cyber-cyan/50">
              <div className="z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-lg text-xl font-bold text-white group-hover:text-cyber-cyan transition-colors">Transfert C++</h3>
                  <TerminalSquare className="w-6 h-6 text-cyber-cyan/50" />
                </div>
                <p className="font-code-sm text-xs text-on-surface-variant mb-4 border-l-2 border-cyber-cyan/30 pl-3">
                  Application de transfert de fichiers bas niveau.
                </p>
                <ul className="font-code-sm text-[11px] text-cyber-cyan/80 space-y-1 mb-6">
                  <li className="flex gap-2"><span>&gt;</span> Sockets réseau</li>
                  <li className="flex gap-2"><span>&gt;</span> Multithreading</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 z-10 border-t border-cyber-cyan/20 pt-4 mt-auto">
                <span className="px-2 py-1 bg-cyber-dark text-cyber-cyan font-code-sm text-[10px] border border-cyber-cyan/50">C++</span>
                <span className="px-2 py-1 bg-cyber-dark text-cyber-cyan/70 font-code-sm text-[10px] border border-cyber-cyan/30">Sys</span>
              </div>
            </div>

            {/* Project 3 */}
            <div className="terminal-window p-6 lg:col-span-2 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div className="z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-headline-lg text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">Arch Réseau</h3>
                    <span className="font-code-sm text-[10px] text-cyber-cyan/70 border border-cyber-cyan/30 px-2 py-1 bg-cyber-cyan/5">SIMULATION</span>
                  </div>
                  <Router className="w-6 h-6 text-cyber-cyan/50" />
                </div>
                <p className="font-code-sm text-sm text-on-surface-variant mb-4 border-l-2 border-cyber-cyan/30 pl-3 max-w-lg">
                  Simulation d'architecture réseau complexe sur GNS3.
                </p>
                <ul className="font-code-sm text-xs text-cyber-cyan/80 space-y-1 mb-6 flex gap-6">
                  <li className="flex gap-2"><span>&gt;</span> Routage RIPv2 / OSPF</li>
                  <li className="flex gap-2"><span>&gt;</span> Analyse de trames</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 z-10 border-t border-cyber-cyan/20 pt-4 mt-auto">
                <span className="px-2 py-1 bg-cyber-dark text-cyber-cyan font-code-sm text-[10px] border border-cyber-cyan/50">GNS3</span>
                <span className="px-2 py-1 bg-cyber-dark text-cyber-cyan/70 font-code-sm text-[10px] border border-cyber-cyan/30">OSPF</span>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full" id="timeline">
          <div className="flex flex-col mb-12 relative">
            <h2 className="font-display-lg text-[32px] md:text-[48px] font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <span className="text-cyber-purple">03.</span> EXEC_LOGS
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-cyber-purple via-cyber-cyan/20 to-transparent mt-4"></div>
          </div>
          
          <div className="relative pl-8 md:pl-12 space-y-12 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[2px] before:h-full before:bg-gradient-to-b before:from-cyber-purple before:via-cyber-cyan before:to-transparent">
            
            {/* Freelance */}
            <div className="relative group">
              <div className="absolute -left-[39px] md:-left-[55px] top-6 w-4 h-4 bg-cyber-dark border-2 border-cyber-purple rotate-45 group-hover:bg-cyber-purple group-hover:shadow-[0_0_15px_#bc13fe] transition-all duration-300 z-10"></div>
              <div className="absolute -left-[31px] md:-left-[47px] top-[34px] w-8 h-[2px] bg-cyber-purple/50 hidden md:block"></div>
              
              <div className="terminal-window p-6 md:p-8 border-cyber-purple/50 hover:border-cyber-purple transition-colors duration-300 ml-0 md:ml-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 border-b border-cyber-purple/20 pb-4">
                  <div>
                    <h3 className="font-headline-lg text-2xl font-bold text-white mb-2">Développeur Agent IA & Front-end</h3>
                    <span className="font-code-sm text-xs text-cyber-purple bg-cyber-purple/10 px-2 py-1 border border-cyber-purple/30">FREELANCE | MISSIONS INDÉPENDANTES</span>
                  </div>
                  <div className="font-code-sm text-sm text-cyber-purple/70 mt-4 md:mt-0 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-purple animate-pulse"></span>
                    [ 2025 - PRESENT ]
                  </div>
                </div>
                
                <div className="space-y-3 font-code-sm text-sm text-on-surface-variant">
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-purple mt-0.5">=&gt;</span>
                    <p>Développement de frontends connectés à des APIs tierces — REST, webhooks, intégrations temps réel</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-purple mt-0.5">=&gt;</span>
                    <p>Conception et livraison d'agents IA pour l'automatisation de processus métier (n8n, LLM locaux)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-purple mt-0.5">=&gt;</span>
                    <p>Mise en place de pipelines CI/CD légers (GitHub Actions) et conteneurisation Docker</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-purple mt-0.5">=&gt;</span>
                    <p>Chatbot Telegram relié à une API mail pour un client — zéro intervention manuelle</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-purple mt-0.5">=&gt;</span>
                    <p>Web scraping automatisé via SerpAPI intégré dans des workflows n8n opérationnels</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage */}
            <div className="relative group">
              <div className="absolute -left-[39px] md:-left-[55px] top-6 w-4 h-4 bg-cyber-dark border-2 border-cyber-cyan/50 rotate-45 group-hover:bg-cyber-cyan/50 group-hover:shadow-[0_0_15px_#00f3ff] transition-all duration-300 z-10"></div>
              <div className="absolute -left-[31px] md:-left-[47px] top-[34px] w-8 h-[2px] bg-cyber-cyan/30 hidden md:block"></div>
              
              <div className="terminal-window p-6 md:p-8 border-cyber-cyan/30 hover:border-cyber-cyan transition-colors duration-300 ml-0 md:ml-4 opacity-80 hover:opacity-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 border-b border-cyber-cyan/20 pb-4">
                  <div>
                    <h3 className="font-headline-lg text-2xl font-bold text-white mb-2">Développeur Fullstack / DevOps</h3>
                    <span className="font-code-sm text-xs text-cyber-cyan/70 bg-cyber-cyan/5 px-2 py-1 border border-cyber-cyan/20">STAGE | SERVICE RÉGIONAL DES ENTREPRISES</span>
                  </div>
                  <div className="font-code-sm text-sm text-cyber-cyan/50 mt-4 md:mt-0">
                    [ 3 MOIS, 2025 ]
                  </div>
                </div>
                
                <div className="space-y-3 font-code-sm text-sm text-on-surface-variant">
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-cyan/50 mt-0.5">=&gt;</span>
                    <p>Application complète de gestion et suivi de dossiers — du backend à l'interface</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-cyan/50 mt-0.5">=&gt;</span>
                    <p>Pipeline CI/CD avec GitHub Actions — tests automatisés, build et déploiement continu</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyber-cyan/50 mt-0.5">=&gt;</span>
                    <p>Conteneurisation complète de la stack avec Docker pour la cohérence des environnements</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Education */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full" id="education">
          <div className="terminal-window p-8 border-t-4 border-t-cyber-cyan border-b-4 border-b-cyber-purple">
            <div className="flex items-center gap-4 mb-8 border-b border-cyber-cyan/20 pb-4">
              <GraduationCap className="w-6 h-6 text-cyber-cyan" />
              <h2 className="font-code-sm text-lg font-bold text-white tracking-widest uppercase">SYS.BASE_FORMATION</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-cyber-cyan/20">
              <div className="pt-4 md:pt-0 md:pr-8 group">
                <div className="font-code-sm text-xs text-cyber-cyan mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyber-cyan"></span>
                  [ 2026 ]
                </div>
                <h4 className="font-body-md text-lg font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">L3 Informatique Admin Sys. & Réseau</h4>
                <p className="font-code-sm text-xs text-cyber-cyan/50 uppercase tracking-wider">ENI Fianarantsoa</p>
              </div>
              
              <div className="pt-4 md:pt-0 md:px-8 group">
                <div className="font-code-sm text-xs text-cyber-purple mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyber-purple"></span>
                  [ NOV. 2024 ]
                </div>
                <h4 className="font-body-md text-lg font-bold text-white mb-2 group-hover:text-cyber-purple transition-colors">Ethical Hacking</h4>
                <p className="font-code-sm text-xs text-cyber-purple/50 uppercase tracking-wider">ESTI Antananarivo</p>
              </div>
              
              <div className="pt-4 md:pt-0 md:pl-8 group">
                <div className="font-code-sm text-xs text-on-surface-variant mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-on-surface-variant"></span>
                  [ 2023 ]
                </div>
                <h4 className="font-body-md text-lg font-bold text-white mb-2">Baccalauréat Série C</h4>
                <p className="font-code-sm text-xs text-on-surface-variant/50 uppercase tracking-wider">SFX Ambatomena</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full mb-24 relative" id="contact">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          
          <div className="terminal-window p-12 text-center border-cyber-cyan shadow-[0_0_30px_rgba(0,243,255,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyber-cyan/50 shadow-[0_0_10px_#00f3ff] animate-scanline"></div>
            
            <div className="inline-block border border-cyber-cyan/50 px-4 py-1 mb-8 bg-cyber-cyan/10">
              <span className="font-code-sm text-xs text-cyber-cyan tracking-widest animate-pulse">CONNECTION_PROTOCOLS_READY</span>
            </div>
            
            <h2 className="font-display-lg text-[40px] md:text-[64px] font-black text-white mb-6 uppercase tracking-tighter">
              INITIATE_<span className="text-cyber-cyan">HANDSHAKE</span>
            </h2>
            
            <p className="font-code-sm text-sm text-on-surface-variant max-w-xl mx-auto mb-10 border-l border-r border-cyber-cyan/30 px-4">
              Disponible pour de nouvelles missions en freelance ou des opportunités d'ingénierie DevOps/IA.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="mailto:rakotoniniranyaina11@gmail.com" className="relative inline-flex items-center gap-3 px-6 py-3 bg-cyber-dark border border-cyber-cyan text-cyber-cyan font-code-sm text-xs uppercase tracking-widest hover:bg-cyber-cyan hover:text-cyber-dark transition-all duration-300 group/btn">
                <span className="absolute inset-0 w-full h-full bg-cyber-cyan/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                <Mail className="w-5 h-5" />
                <span className="relative z-10">rakotoniniranyaina11@gmail.com</span>
              </a>
              
              <a href="https://linkedin.com/in/ny-aina-rak" className="relative inline-flex items-center gap-3 px-6 py-3 bg-cyber-dark border border-cyber-purple text-cyber-purple font-code-sm text-xs uppercase tracking-widest hover:bg-cyber-purple hover:text-cyber-dark transition-all duration-300 group/btn">
                <span className="absolute inset-0 w-full h-full bg-cyber-purple/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                <Share2 className="w-5 h-5" />
                <span className="relative z-10">LinkedIn</span>
              </a>
              
              <a href="https://github.com/NyAina11" className="relative inline-flex items-center gap-3 px-6 py-3 bg-cyber-dark border border-on-surface-variant text-on-surface-variant font-code-sm text-xs uppercase tracking-widest hover:bg-white hover:text-cyber-dark hover:border-white transition-all duration-300 group/btn">
                <span className="absolute inset-0 w-full h-full bg-white/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                <Code2 className="w-5 h-5" />
                <span className="relative z-10">GitHub</span>
              </a>
            </div>
            
            <div className="mt-12 inline-flex items-center gap-4 font-code-sm text-xs text-cyber-cyan/50 border-t border-cyber-cyan/20 pt-6">
              <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></span>
              <Phone className="w-4 h-4" />
              +261 34 56 037 11
            </div>
          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-cyber-dark border-t border-cyber-cyan/30 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-code-sm text-xs text-cyber-cyan/70 flex items-center gap-2">
            <span className="text-cyber-purple">&gt;</span> © 2024 NY_AINA <span className="text-cyber-cyan mx-2">//</span> ROOT ACCESS GRANTED
          </div>
          <div className="flex space-x-6 font-code-sm text-[10px] uppercase tracking-widest">
            <a className="text-on-surface-variant hover:text-cyber-cyan transition-colors duration-200" href="#">GitHub</a>
            <a className="text-on-surface-variant hover:text-cyber-cyan transition-colors duration-200" href="#">LinkedIn</a>
            <a className="text-on-surface-variant hover:text-cyber-cyan transition-colors duration-200" href="#">Architecture</a>
            <a className="text-cyber-cyan flex items-center gap-1" href="#">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
              System_Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
