"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpRight, Boxes, Check, ChevronRight, CirclePlay, Command, Globe2, LayoutDashboard, Menu, ShieldCheck, Sparkles, Users, X, Zap } from "lucide-react";

const modules = [
  { icon: LayoutDashboard, title: "Business Planner", desc: "Turn a rough idea into a clear plan, audience and revenue model.", tag: "Think clearly" },
  { icon: Boxes, title: "Product Builder", desc: "Shape features, validate demand and map your first release.", tag: "Build smarter" },
  { icon: Globe2, title: "Website Studio", desc: "Create a focused web presence designed to convert visitors.", tag: "Go live" },
  { icon: Zap, title: "Marketing Studio", desc: "Plan campaigns, content and growth experiments in one place.", tag: "Get noticed" },
  { icon: Users, title: "Customer Hub", desc: "Keep customer conversations, feedback and follow-ups together.", tag: "Stay close" },
  { icon: Sparkles, title: "Growth Signals", desc: "Understand what is working and decide what to do next.", tag: "Keep improving" },
];

export default function Home() {
  const [idea,setIdea] = useState("");
  const [email,setEmail] = useState("");
  const [busy,setBusy] = useState(false);
  const [cooldown,setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  async function start() {
    if (!idea.trim() || !email.trim() || busy || cooldown > 0) return;
    setBusy(true); setNotice(""); setError("");
    try {
      window.localStorage.setItem("nexora_pending_objective",idea.trim());
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) throw error;
      setNotice("A secure sign-in link has been sent. Open it on this device to create your workspace.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not send the sign-in link. Please try again.";
      setError(message.toLowerCase().includes("email rate limit exceeded")
        ? "Supabase has reached its built-in email sending limit (2 emails per hour). To send sign-in links reliably, configure a custom SMTP provider in Supabase Authentication → SMTP Settings. Please do not keep retrying; repeated attempts will not remove this limit."
        : message);
      setCooldown(60);
    }
    finally { setBusy(false); }
  }
  return <main id="top">
    <nav className="nav wrap"><a className="brand" href="#top"><span className="brand-mark"><Command size={19}/></span>NEXORA<span className="brand-dot">.</span></a><div className="nav-links"><a href="#platform">Platform</a><a href="#workflow">How it works</a><a href="#modules">Workspaces</a></div><a className="button button-dark nav-cta" href="#start">Get started <ArrowUpRight size={15}/></a></nav>
    <section className="hero wrap"><div className="hero-copy"><div className="eyebrow"><i/> YOUR IDEA. ONE OPERATING SPACE.</div><h1>Big ideas deserve<br/>a <span className="gradient">better way</span> to grow.</h1><p className="hero-sub">From the first spark to your next milestone, Nexora brings the tools, thinking and momentum to move your business forward.</p><div className="hero-actions"><a className="button button-primary" href="#start">Build your workspace <ArrowUpRight size={17}/></a><a className="watch-link" href="#workflow"><span><CirclePlay size={19}/></span> See how it works</a></div><div className="hero-proof"><div className="avatar-stack"><b>M</b><b>A</b><b>J</b><b>+</b></div><div><strong>Made for people who make things.</strong><small>Think · Build · Launch · Grow</small></div></div></div>
      <div className="hero-art"><div className="glow"/><div className="app-window"><div className="window-top"><div><span className="mini-mark"><Command size={12}/></span> nexora <small>/ My workspace</small></div><div className="window-dots"><i/><i/><i/></div></div><div className="window-body"><aside className="side-nav"><label>WORKSPACE</label>{["Overview","Product","Website","Marketing","Customers"].map((x,i)=><div className={i===0?"side-item selected":"side-item"} key={x}>{[LayoutDashboard,Boxes,Globe2,Zap,Users].map((Icon,index)=><Icon key={index} size={14}/>)}{x}</div>)}<div className="side-bottom"><b>ME</b> My workspace</div></aside><div className="dash"><span className="dash-kicker">YOUR NEXT MOVE</span><h3>Your next move<br/>starts here.</h3><p>A little progress adds up. What will you make today?</p><div className="idea-card"><span className="pill"><Sparkles size={13}/> RECOMMENDED</span><h4>Turn your idea into a clear first plan.</h4><p>Define the problem, understand who it helps and map your first launch.</p><span className="mini-link">Start planning <ArrowUpRight size={13}/></span></div><div className="dash-grid"><div><small>WORKSPACE PROGRESS</small><strong>One step at a time.</strong><div className="progress"><i/></div></div><div><small>YOUR MOMENTUM</small><strong><Zap size={14}/> Keep moving.</strong></div></div><div className="activity"><ShieldCheck size={16}/><div><b>Your workspace is ready</b><small>A focused place to turn planning into progress.</small></div><Check size={15}/></div></div></div></div><div className="float-card float-top"><Sparkles size={17}/><div><b>One clear direction</b><small>Less scattered. More focused.</small></div></div><div className="float-card float-bottom"><Zap size={17}/><div><b>Built to move forward</b><small>Your next step, made visible.</small></div></div></div>
    </section>
    <section className="trust-strip"><div className="wrap trust-inner"><span>ONE CONNECTED WORKSPACE</span><b>IDEA <i>✳</i> PLAN <i>✳</i> PRODUCT <i>✳</i> LAUNCH <i>✳</i> GROW</b><span>BUILT FOR WHAT&apos;S NEXT</span></div></section>
    <section className="intro-section wrap" id="platform"><div className="section-label">THE PROBLEM WE&apos;RE SOLVING</div><div className="intro-grid"><h2>Good ideas get lost<br/>in <span className="muted-gradient">too many tabs.</span></h2><div><p>Planning in one tool. Building in another. Marketing somewhere else. Nexora is being shaped around a simpler idea: your work should move forward as one connected journey.</p><a className="text-link" href="#workflow">Discover the approach <ArrowUpRight size={16}/></a></div></div></section>
    <section className="modules-section" id="modules"><div className="wrap"><div className="modules-heading"><div><div className="section-label">ONE SPACE. EVERY STAGE.</div><h2>Everything moves<br/>better <span className="gradient">together.</span></h2></div><p>Six connected workspaces designed to help you go from a promising thought to meaningful progress.</p></div><div className="module-grid">{modules.map((m,i)=><article className="module-card" key={m.title}><div className="module-top"><span className="module-icon"><m.icon size={20}/></span><span className="module-number">0{i+1}</span></div><span className="module-tag">{m.tag}</span><h3>{m.title}</h3><p>{m.desc}</p><div className="module-arrow"><ArrowUpRight size={17}/></div></article>)}</div></div></section>
    <section className="workflow-section wrap" id="workflow"><div><div className="section-label">A CLEARER WAY FORWARD</div><h2>Start with what<br/>you <span className="gradient">want to do.</span></h2><p>Tell Nexora what you&apos;re working towards. The first experience helps you create a private workspace and keep practical next steps together.</p><a className="text-link" href="#start">Try the workspace starter <ArrowUpRight size={16}/></a></div><div className="steps-card">{["Share your objective|Describe the idea, challenge or outcome you have in mind.","Get a structured direction|Create a private workspace to organise your next actions.","Build and keep improving|Track tasks and move forward one step at a time."].map((s,i)=><div className="step" key={s}><span>0{i+1}</span><div><b>{s.split("|")[0]}</b><p>{s.split("|")[1]}</p></div><Check size={15}/></div>)}</div></section>
    <section className="start-section" id="start"><div className="wrap start-wrap"><div className="start-copy"><div className="section-label light-label">YOUR NEXT CHAPTER STARTS HERE</div><h2>What are you<br/>trying to <span>make happen?</span></h2><p>Start with one sentence. You don&apos;t need the whole plan figured out.</p><div className="start-points"><span><Check size={15}/> Start with a simple objective</span><span><Check size={15}/> Find a clearer next step</span><span><Check size={15}/> Keep your work connected</span></div></div><div className="prompt-panel"><div className="prompt-head"><span className="prompt-spark"><Sparkles size={17}/></span><div><b>Let&apos;s shape your idea.</b><small>Tell us what you&apos;re working on.</small></div><span className="beta">EARLY PREVIEW</span></div><label htmlFor="idea">YOUR OBJECTIVE</label><textarea id="idea" value={idea} onChange={e=>setIdea(e.target.value)} placeholder="I want to build a platform that helps..." rows={4} maxLength={2000}/><label htmlFor="email">YOUR EMAIL</label><input id="email" name="nexora-signin-email" type="email" autoComplete="off" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><div className="prompt-suggestions"><span>TRY:</span>{["Launch a digital product","Validate a business idea","Build a website for my service"].map(x=><button key={x} onClick={()=>setIdea(x)}>{x}</button>)}</div><button className="button button-primary submit" onClick={start} disabled={!idea.trim()||!email.trim()||busy||cooldown>0}>{busy?"Sending secure link…":cooldown>0?`Try again in ${cooldown}s`:"Create my workspace"} <ArrowUpRight size={16}/></button>{notice&&<div className="success"><Check size={15}/>{notice}</div>}{error&&<div className="error">{error}</div>}<div className="privacy"><ShieldCheck size={13}/> Your workspace is private to your account. Passwordless email sign-in.</div></div></div></section>
    <footer className="footer wrap"><a className="brand" href="#top"><span className="brand-mark"><Command size={19}/></span>NEXORA<span className="brand-dot">.</span></a><span>Make the next move matter.</span><small>© 2026 Nexora. A FutureWeb 2027 project.</small></footer>
  </main>;
}