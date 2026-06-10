import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Geist:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --ink:#08101F;--ink2:#1A2640;--ink3:#2E3F5C;
      --muted:#6B7E9A;--muted2:#9CAABE;--muted3:#C4CDD9;
      --bg:#F4F6FA;--bg2:#EEF1F7;
      --surface:#FFFFFF;--surface2:#F9FAFC;
      --border:#E4E9F2;--border2:#ECF0F8;
      --sky:#4EA8DE;--sky-light:#A8D4F0;--sky-pale:#E8F4FC;--sky-deep:#2A85BF;
      --sky-glow:rgba(78,168,222,.15);
      --green:#22C55E;--green-pale:#DCFCE7;--green-deep:#16A34A;
      --amber:#F59E0B;--amber-pale:#FEF3C7;
      --red:#EF4444;--red-pale:#FEE2E2;
      --nav-h:76px;
      --safe-bottom:env(safe-area-inset-bottom, 0px);
      --safe-top:env(safe-area-inset-top, 0px);
    }
    html,body,#root{height:100%;width:100%;background:var(--bg);overflow:hidden}
    ::-webkit-scrollbar{width:0}
    *{-webkit-tap-highlight-color:transparent}
    body{font-family:'Geist','Helvetica Neue',sans-serif;color:var(--ink)}
    input,select,textarea,button{font-family:'Geist','Helvetica Neue',sans-serif}
    input,select,textarea{width:100%;padding:13px 16px;border:1px solid var(--border);border-radius:10px;font-size:14px;font-weight:400;background:var(--surface);color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;appearance:none;box-shadow:0 1px 3px rgba(0,0,0,.04)}
    input::placeholder,textarea::placeholder{color:var(--muted3)}
    input:focus,select:focus,textarea:focus{border-color:var(--sky);box-shadow:0 0 0 3px var(--sky-glow)}
    select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CAABE' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:38px;cursor:pointer}
    textarea{resize:vertical;min-height:88px;line-height:1.65}
    .field{margin-bottom:14px}
    .lbl{display:block;font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:7px}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:10px;font-size:13px;font-weight:600;letter-spacing:.03em;border:none;cursor:pointer;transition:all .2s}
    .btn-ink{background:var(--ink);color:#fff;box-shadow:0 2px 12px rgba(8,16,31,.3)}
    .btn-ink:hover{transform:translateY(-1px)}
    .btn-sky{background:var(--sky);color:#fff;box-shadow:0 2px 12px rgba(78,168,222,.35)}
    .btn-sky:hover{background:var(--sky-deep);transform:translateY(-1px)}
    .btn-sky:active{transform:scale(.98)}
    .btn-ghost{background:var(--surface);color:var(--ink3);border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04)}
    .btn-ghost:hover{border-color:var(--sky);color:var(--sky-deep)}
    .btn-sm{padding:8px 16px;font-size:12px;border-radius:8px}
    .btn-full{width:100%}
    .btn:disabled{opacity:.38;cursor:not-allowed;transform:none!important;box-shadow:none!important}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:22px;margin-bottom:14px;box-shadow:0 2px 12px rgba(0,0,0,.04)}
    .chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:6px;font-size:10.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
    .chip-sky{background:var(--sky-pale);color:var(--sky-deep);border:1px solid rgba(78,168,222,.2)}
    .page{flex:1;overflow-y:auto;padding-bottom:calc(var(--nav-h) + var(--safe-bottom) + 20px);width:100%}
    .inner{max-width:680px;margin:0 auto;padding:0 18px}
    .hdr{flex-shrink:0;position:sticky;top:0;z-index:30;background:var(--ink);padding:var(--safe-top) 22px 0;height:calc(68px + var(--safe-top));display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 0 rgba(255,255,255,.06),0 4px 24px rgba(0,0,0,.18)}
    .logo{font-family:'Playfair Display',serif;font-size:26px;font-weight:500;font-style:italic;color:#fff;letter-spacing:-.01em}
    .logo-dot{color:var(--sky-light);font-style:normal}
    .hdr-tag{font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35);padding:5px 12px;border:1px solid rgba(255,255,255,.1);border-radius:6px;background:rgba(255,255,255,.05)}
    .bnav{height:calc(var(--nav-h) + var(--safe-bottom));padding-bottom:var(--safe-bottom);flex-shrink:0;background:rgba(8,16,31,.97);backdrop-filter:blur(24px);border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:flex-start;position:fixed;bottom:0;left:0;right:0;z-index:20;box-shadow:0 -4px 24px rgba(0,0,0,.25)}
    .ni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;color:rgba(255,255,255,.75);transition:color .2s;border:none;background:transparent;padding:0;position:relative}
    .ni.on{color:var(--sky)}
    .ni svg{transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
    .ni.on svg{transform:scale(1.12)}
    .ni-lbl{font-size:9.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}
    .ni-bar{position:absolute;top:0;left:50%;transform:translateX(-50%);width:24px;height:2px;border-radius:0 0 4px 4px;background:var(--sky-light);box-shadow:0 0 10px var(--sky-light)}
    .ni-share-btn{width:48px;height:48px;border-radius:14px;background:var(--sky);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(78,168,222,.45);transition:transform .2s}
    .ni.on .ni-share-btn,.ni:hover .ni-share-btn{transform:scale(1.05)}
    .pcard{padding:22px 0;border-bottom:1px solid var(--border2);animation:fadeIn .3s ease}
    .pcard:last-child{border-bottom:none}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    .pmeta{display:flex;align-items:center;gap:10px;margin-bottom:14px}
    .pav{width:38px;height:38px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}
    .pav-info{flex:1;min-width:0}
    .post-delete-btn{flex-shrink:0;background:none;border:none;color:var(--muted2);cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all .18s;align-self:flex-start}
    .post-delete-btn:hover{color:var(--red);background:var(--red-pale)}
    .puname{font-size:13px;font-weight:600;color:var(--ink)}
    .pcat-row{display:flex;align-items:center;gap:6px;margin-top:2px;flex-wrap:wrap}
    .ptime{font-size:11px;color:var(--muted2)}
    .fit-photo{width:100%;border-radius:12px;max-height:300px;object-fit:cover;margin-bottom:14px;border:1px solid var(--border2);cursor:pointer}
    .sz-block{background:var(--bg);border:1px solid var(--border2);border-radius:12px;padding:16px 18px;margin-bottom:14px;display:flex;align-items:center;gap:14px;position:relative;overflow:hidden}
    .sz-block::before{content:'';position:absolute;right:-20px;top:-20px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,var(--sky-glow),transparent 70%)}
    .sz-col{flex:1}
    .sz-brandname{font-size:10.5px;font-weight:600;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
    .sz-arrow{width:28px;height:28px;border-radius:8px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
    .sz-result-brand{font-size:10.5px;font-weight:600;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
    .sz-result-num{font-family:'Playfair Display',serif;font-size:34px;font-weight:700;color:var(--ink);line-height:1;letter-spacing:-.02em}
    .sz-result-sys{font-size:10.5px;color:var(--muted2);margin-top:2px}
    .fit-quote{font-family:'Geist','Helvetica Neue',sans-serif;font-style:normal;font-size:14px;line-height:1.7;color:var(--ink3);margin-bottom:14px;padding:14px 16px;border-radius:12px;background:var(--surface);border:1px solid var(--border2);text-align:left}
    .shop-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:12px;font-weight:600;color:var(--ink3);text-decoration:none;cursor:pointer;transition:all .2s;max-width:100%}
    .shop-btn:hover{border-color:var(--sky);color:var(--sky-deep);background:var(--sky-pale)}
    .shop-btn-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .click-ct{font-size:11px;color:var(--muted2);flex-shrink:0}
    .upvote-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .18s}
    .upvote-btn:hover,.upvote-btn.voted{border-color:var(--sky);color:var(--sky-deep);background:var(--sky-pale)}
    .comment-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .18s}
    .comment-btn:hover,.comment-btn.open{border-color:var(--sky);color:var(--sky-deep);background:var(--sky-pale)}
    .comments-wrap{margin-top:12px;padding-top:12px;border-top:1px solid var(--border2)}
    .comment-item{display:block;margin-bottom:6px;line-height:1.5}
    .comment-uname{font-size:13px;font-weight:600;color:var(--ink);margin-right:6px}
    .comment-text{font-size:13px;color:var(--ink3)}
    .comment-time{font-size:11px;color:var(--muted2);margin-left:8px}
    .comment-input-row{display:flex;gap:8px;margin-top:10px}
    .comment-input-row input{flex:1;padding:9px 14px;border-radius:20px;border:1px solid var(--border);background:var(--surface);font-size:13px}
    .comment-send{padding:8px 16px;border-radius:20px;border:none;background:var(--ink);color:#fff;font-size:12px;font-weight:600;cursor:pointer;flex-shrink:0}
    .comment-send:disabled{opacity:.5;cursor:default}
    .fit-score-wrap{margin:16px 0;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:12px}
    .fit-score-label{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
    .fit-score-bar-wrap{position:relative;height:10px;background:var(--border2);border-radius:10px;overflow:visible}
    .fit-score-bar-fill{height:100%;border-radius:10px}
    .fit-score-tick{position:absolute;top:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.2)}
    .fit-score-labels{display:flex;justify-content:space-between;margin-top:8px}
    .fit-score-lbl{font-size:10px;font-weight:600;color:var(--muted2)}
    .fit-score-count{font-size:11px;color:var(--muted2);margin-top:4px}
    .search-hero{padding:28px 0 22px;border-bottom:1px solid var(--border2);margin-bottom:20px}
    .eyebrow{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--sky-deep);margin-bottom:10px;display:flex;align-items:center;gap:8px}
    .eyebrow::before{content:'';display:inline-block;width:20px;height:1px;background:var(--sky)}
    .hero-h1{font-family:'Playfair Display',serif;font-size:36px;font-weight:500;color:var(--ink);line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
    .hero-h1 em{color:var(--sky-deep);font-style:italic}
    .hero-sub{font-size:14px;color:var(--muted);line-height:1.6}
    .result-panel{background:var(--ink);border-radius:14px;padding:28px 24px;text-align:center;position:relative;overflow:hidden;margin-top:4px;box-shadow:0 8px 32px rgba(8,16,31,.25)}
    .result-panel::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(78,168,222,.18),transparent 70%)}
    .result-eyebrow{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:12px;position:relative;z-index:1}
    .result-num{font-family:'Playfair Display',serif;font-size:80px;font-weight:700;color:#fff;line-height:1;letter-spacing:-.03em;position:relative;z-index:1}
    .result-accent{color:var(--sky-light)}
    .result-tag{display:inline-flex;align-items:center;gap:6px;margin-top:14px;padding:6px 14px;border-radius:30px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);font-size:11px;font-weight:500;color:rgba(255,255,255,.5);position:relative;z-index:1}
    .result-tag.match{border-color:rgba(78,168,222,.4);color:var(--sky-light);background:rgba(78,168,222,.08)}
    .info-row{background:var(--sky-pale);border:1px solid rgba(78,168,222,.2);border-radius:12px;padding:14px 16px;font-size:13px;color:var(--ink3);line-height:1.6;margin-bottom:14px}
    .feed-header{padding:24px 0 16px;border-bottom:1px solid var(--border2);margin-bottom:4px}
    .pg-title{font-family:'Playfair Display',serif;font-size:28px;font-weight:500;color:var(--ink);letter-spacing:-.02em}
    .pg-sub{font-size:13px;color:var(--muted);margin-top:4px}
    .filter-row{display:flex;gap:7px;padding:14px 0 2px;overflow-x:auto;-webkit-overflow-scrolling:touch}
    .filter-row::-webkit-scrollbar{display:none}
    .fpill{flex-shrink:0;padding:7px 16px;border-radius:8px;font-size:11.5px;font-weight:600;border:1px solid var(--border);background:var(--surface);color:var(--muted);cursor:pointer;transition:all .18s}
    .fpill.on{background:var(--ink);color:#fff;border-color:var(--ink)}
    .form-section{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--sky-deep);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--sky-pale)}
    .row2{display:flex;gap:12px}
    .row2>*{flex:1;min-width:0}
    .sdiv{height:1px;background:var(--border2);margin:18px 0}
    .input-hint{font-size:12px;color:var(--muted);margin-top:-8px;margin-bottom:14px;line-height:1.55}
    .photo-upload-btn{width:100%;padding:18px;border:2px dashed var(--border);border-radius:12px;background:var(--surface2);color:var(--muted);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:14px}
    .photo-upload-btn:hover{border-color:var(--sky);color:var(--sky-deep);background:var(--sky-pale)}
    .photo-preview-wrap{position:relative;margin-bottom:14px}
    .photo-remove{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.6);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
    .search-input-wrap{position:relative;margin-bottom:16px}
    .search-input-wrap svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted2);pointer-events:none}
    .search-input-wrap input{padding-left:42px}
    .brand-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .brand-tile{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 14px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;gap:6px}
    .brand-tile:hover{border-color:var(--sky);box-shadow:0 4px 16px rgba(78,168,222,.15);transform:translateY(-2px)}
    .bt-name{font-size:13px;font-weight:600;color:var(--ink)}
    .bt-cat{font-size:10.5px;color:var(--muted);font-weight:500}
    .brand-count{font-size:10.5px;color:var(--muted2);font-weight:500}
    .brand-detail-header{background:var(--ink);padding:24px 22px 22px;position:relative;overflow:hidden}
    .brand-detail-header::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(78,168,222,.18),transparent 65%)}
    .bdh-back{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:rgba(255,255,255,.45);cursor:pointer;margin-bottom:18px;background:none;border:none;padding:0;letter-spacing:.04em;text-transform:uppercase}
    .bdh-back:hover{color:rgba(255,255,255,.75)}
    .page-back{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;margin-bottom:14px;background:none;border:none;padding:0;letter-spacing:.04em;text-transform:uppercase}
    .page-back:hover{color:var(--ink)}
    .bdh-name{font-family:'Playfair Display',serif;font-size:26px;font-weight:500;color:#fff;position:relative;z-index:1}
    .bdh-meta{display:flex;align-items:center;gap:10px;margin-top:8px;position:relative;z-index:1;flex-wrap:wrap}
    .bdh-visit{display:inline-flex;align-items:center;gap:7px;padding:11px 24px;border-radius:9px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.09);font-size:14.5px;font-weight:700;color:rgba(255,255,255,.85);text-decoration:none;transition:all .2s}
    .bdh-visit:hover{background:rgba(255,255,255,.12);color:#fff}
    .pro-banner{background:var(--surface);margin:0 -18px;padding:32px 18px 24px;border-bottom:1px solid var(--border2);display:flex;flex-direction:column;align-items:center;text-align:center}
    .pro-av{width:76px;height:76px;border-radius:22px;background:var(--sky-pale);border:2px solid rgba(78,168,222,.25);display:flex;align-items:center;justify-content:font-family:'Playfair Display',serif;font-size:30px;font-weight:500;color:var(--sky-deep);margin-bottom:14px;align-items:center;justify-content:center}
    .pro-name{font-family:'Playfair Display',serif;font-size:24px;font-weight:500;color:var(--ink)}
    .pro-handle{font-size:13px;color:var(--muted);margin-top:4px}
    .pro-handle span{color:var(--sky-deep);font-weight:500}
    .stats-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}
    .stat-box{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 12px;text-align:center}
    .stat-n{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--ink);line-height:1;letter-spacing:-.02em}
    .stat-l{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:5px}
    .follow-btn{display:inline-flex;align-items:center;gap:4px;padding:4px 11px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid var(--border);background:var(--surface);color:var(--muted);cursor:pointer;transition:all .2s;line-height:1.4}
    .follow-btn:hover{border-color:var(--sky);color:var(--sky-deep)}
    .follow-btn.following{background:var(--sky-pale);border-color:var(--sky-light);color:var(--sky-deep)}
    .follow-btn.pending{background:var(--bg2);border-color:var(--border);color:var(--muted2)}
    .bell-btn{position:relative;background:none;border:none;color:rgba(255,255,255,.75);cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center}
    .bell-btn:hover{color:#fff}
    .bell-dot{position:absolute;top:4px;right:4px;width:9px;height:9px;border-radius:50%;background:var(--red);border:2px solid var(--ink)}
    .notif-item{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:8px}
    .notif-item.unread{border-color:var(--sky-light);background:var(--sky-pale)}
    .notif-text{flex:1;font-size:13px;color:var(--ink3);line-height:1.5}
    .notif-text strong{color:var(--ink)}
    .notif-time{font-size:11px;color:var(--muted2);margin-top:2px}
    .notif-actions{display:flex;gap:8px;flex-shrink:0}
    .notif-accept,.notif-decline{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all .2s}
    .notif-accept{background:var(--ink);color:#fff;border-color:var(--ink)}
    .notif-accept:hover{background:var(--ink2)}
    .notif-decline{background:var(--surface);color:var(--muted)}
    .notif-decline:hover{border-color:rgba(239,68,68,.3);color:var(--red)}
    .notif-overlay{position:fixed;inset:0;background:rgba(8,16,31,.5);z-index:150;display:flex;justify-content:flex-end;backdrop-filter:blur(2px)}
    .notif-panel{background:var(--bg);width:100%;max-width:420px;height:100%;overflow-y:auto;animation:slideInRight .25s ease-out;box-shadow:-8px 0 32px rgba(0,0,0,.18)}
    @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
    .notif-head{position:sticky;top:0;background:var(--ink);color:#fff;padding:calc(18px + var(--safe-top)) 20px 18px;display:flex;align-items:center;justify-content:space-between;z-index:1}
    .notif-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:500}
    .notif-close{background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center}
    .conv-item{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:8px;cursor:pointer;transition:border-color .2s}
    .conv-item:hover{border-color:var(--sky-light)}
    .conv-item.unread{border-color:var(--sky-light);background:var(--sky-pale)}
    .conv-av{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:500;flex-shrink:0}
    .conv-info{flex:1;min-width:0}
    .conv-name{font-size:14px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .conv-preview{font-size:12px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .conv-time{font-size:10.5px;color:var(--muted2);flex-shrink:0;align-self:flex-start;margin-top:2px}
    .conv-unread-dot{width:9px;height:9px;border-radius:50%;background:var(--sky-deep);flex-shrink:0}
    .chat-panel{display:flex;flex-direction:column;height:100%}
    .chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px}
    .chat-bubble{max-width:75%;padding:9px 14px;border-radius:16px;font-size:13.5px;line-height:1.5;word-break:break-word}
    .chat-bubble.me{align-self:flex-end;background:var(--ink);color:#fff;border-bottom-right-radius:4px}
    .chat-bubble.them{align-self:flex-start;background:var(--surface2);color:var(--ink3);border-bottom-left-radius:4px}
    .chat-empty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px}
    .chat-input-row{display:flex;gap:8px;padding:14px 16px;border-top:1px solid var(--border2);background:var(--bg)}
    .chat-input-row input{flex:1;padding:10px 16px;border-radius:20px;border:1px solid var(--border);background:var(--surface);font-size:13px}
    .chat-send{padding:9px 16px;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;border:none;background:var(--ink);color:#fff;cursor:pointer;flex-shrink:0}
    .chat-send:disabled{opacity:.5;cursor:default}
    .message-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:24px;border:1px solid var(--border);background:var(--surface);font-size:12.5px;font-weight:600;color:var(--ink3);cursor:pointer;transition:all .18s}
    .message-btn:hover{border-color:var(--sky);color:var(--sky-deep);background:var(--sky-pale)}
    .user-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:8px;cursor:pointer;transition:border-color .2s}
    .user-card:hover{border-color:var(--sky-light)}
    .user-av{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:500;flex-shrink:0}
    .user-info{flex:1;min-width:0}
    .user-name{font-size:14px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .user-meta{font-size:11px;color:var(--muted);margin-top:2px}
    .uprofile-header{background:var(--ink);padding:28px 20px 22px;position:relative;overflow:hidden;width:100%}
    .uprofile-header::before{content:'';position:absolute;top:-30px;right:-30px;width:130px;height:130px;border-radius:50%;background:radial-gradient(circle,rgba(78,168,222,.18),transparent 65%)}
    .uprofile-av{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:24px;font-weight:500;margin-bottom:10px}
    .uprofile-name{font-size:20px;font-weight:700;color:#fff;font-family:'Playfair Display',serif;margin-bottom:4px}
    .uprofile-sub{font-size:12px;color:rgba(255,255,255,.4)}
    .earn-sub{font-size:12px;color:rgba(255,255,255,.28);margin-top:8px;line-height:1.5;position:relative;z-index:1}
    .earn-sub strong{color:rgba(255,255,255,.5);font-weight:500}
    .sec-head{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;margin-top:22px}
    .mini-post{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:8px;display:flex;align-items:center;gap:12px}
    .mini-icon{font-size:20px;flex-shrink:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--bg2);border-radius:10px}
    .mini-info{flex:1;min-width:0}
    .mini-t{font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .mini-s{font-size:11px;color:var(--muted);margin-top:2px}
    .mini-clk{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--sky-deep);flex-shrink:0}
    .size-profile-card{background:var(--ink);border-radius:16px;padding:20px;margin-bottom:14px;position:relative;overflow:hidden}
    .size-profile-card::before{content:'';position:absolute;top:-30px;right:-30px;width:130px;height:130px;border-radius:50%;background:radial-gradient(circle,rgba(78,168,222,.18),transparent 65%)}
    .sp-head{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:14px}
    .sp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .sp-item{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px;position:relative;z-index:1}
    .sp-brand{font-size:10px;color:rgba(255,255,255,.4);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px}
    .sp-cat{font-size:10px;color:rgba(255,255,255,.3);margin-bottom:4px}
    .sp-size{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#fff;line-height:1}
    .sp-remove{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.12);border:none;color:rgba(255,255,255,.5);font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center}
    .sp-remove:hover{background:rgba(239,68,68,.4);color:#fff}
    .sp-add{background:rgba(78,168,222,.12);border:1px dashed rgba(78,168,222,.35);border-radius:10px;padding:12px;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-size:12px;font-weight:600;color:var(--sky-light);transition:all .2s;position:relative;z-index:1}
    .sp-add:hover{background:rgba(78,168,222,.2)}
    .measurements-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:14px}
    .measurements-head{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
    .measurements-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .meas-item{display:flex;flex-direction:column;gap:4px}
    .meas-label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted2)}
    .meas-input{padding:9px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;font-weight:500;color:var(--ink);background:var(--bg);outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
    .meas-input:focus{border-color:var(--sky);box-shadow:0 0 0 3px var(--sky-glow)}
    .meas-input::placeholder{color:var(--muted3);font-weight:400}
    .meas-save-btn{margin-top:14px;width:100%;padding:11px;border-radius:10px;background:var(--ink);color:#fff;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
    .meas-save-btn:hover{background:var(--ink2)}
    .meas-save-btn:disabled{opacity:.5;cursor:default}
    .bio-textarea{width:100%;min-height:84px;padding:12px;border:1px solid var(--border);border-radius:10px;font-size:14px;font-family:inherit;color:var(--ink);background:var(--bg);outline:none;resize:vertical;transition:border-color .2s,box-shadow .2s}
    .bio-textarea:focus{border-color:var(--sky);box-shadow:0 0 0 3px var(--sky-glow)}
    .bio-textarea::placeholder{color:var(--muted3);font-weight:400}
    .bio-text{font-size:14px;color:var(--ink3);line-height:1.6;white-space:pre-wrap}
    .brand-chip-grid{display:flex;flex-wrap:wrap;gap:8px}
    .brand-chip{padding:8px 14px;border-radius:999px;border:1px solid var(--border);background:var(--bg);font-size:12.5px;font-weight:600;color:var(--ink3);cursor:pointer;transition:all .15s}
    .brand-chip.active{background:var(--ink);border-color:var(--ink);color:#fff}
    .brand-chip.readonly{cursor:default}
    .togwrap{display:flex;align-items:center;gap:12px;cursor:pointer}
    .tog{position:relative;width:44px;height:26px;flex-shrink:0}
    .tog input{opacity:0;width:0;height:0;position:absolute}
    .tog-trk{position:absolute;inset:0;background:var(--border);border-radius:26px;cursor:pointer;transition:.25s}
    .tog-trk::before{content:'';position:absolute;width:20px;height:20px;left:2px;top:2px;background:#fff;border-radius:50%;transition:.25s;box-shadow:0 1px 4px rgba(0,0,0,.18)}
    input:checked~.tog-trk{background:var(--sky)}
    input:checked~.tog-trk::before{transform:translateX(18px)}
    .tog-lbl{font-size:13px;font-weight:500;color:var(--ink3)}
    .modal-overlay{position:fixed;inset:0;background:rgba(8,16,31,.6);z-index:100;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)}
    .modal{background:var(--surface);border-radius:20px 20px 0 0;padding:24px 20px 36px;width:100%;max-width:520px;animation:slideUp2 .3s cubic-bezier(.34,1.56,.64,1)}
    @keyframes slideUp2{from{transform:translateY(100%)}to{transform:translateY(0)}}
    .modal-handle{width:36px;height:4px;border-radius:4px;background:var(--border);margin:0 auto 20px}
    .modal-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:500;color:var(--ink);margin-bottom:18px}
    .lightbox{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .lightbox img{max-width:95vw;max-height:90vh;object-fit:contain;border-radius:8px}
    .page-ttl{font-family:'Playfair Display',serif;font-size:28px;font-weight:500;color:var(--ink);letter-spacing:-.02em;margin-bottom:4px;padding-top:24px}
    .page-sub{font-size:13px;color:var(--muted);margin-bottom:20px;line-height:1.5}
    .empty{text-align:center;padding:56px 0;color:var(--muted2);font-size:14px;line-height:1.7}
    .empty-ico{font-size:36px;margin-bottom:14px;opacity:.6}
    .toast{position:fixed;bottom:calc(var(--nav-h) + var(--safe-bottom) + 18px);left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:13px 24px;border-radius:10px;font-size:13px;font-weight:600;z-index:300;white-space:nowrap;box-shadow:0 8px 32px rgba(8,16,31,.35);border:1px solid rgba(255,255,255,.08);animation:slideUp .35s cubic-bezier(.34,1.56,.64,1)}
    @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(12px) scale(.94)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
    .auth-wrap{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;background:var(--bg)}
    .auth-card{width:100%;max-width:380px}
    .auth-logo{font-family:'Playfair Display',serif;font-size:38px;font-style:italic;font-weight:500;color:var(--ink);text-align:center;margin-bottom:6px}
    .auth-sub{text-align:center;font-size:13px;color:var(--muted);margin-bottom:28px}
    .auth-toggle{text-align:center;font-size:13px;color:var(--muted);margin-top:18px}
    .auth-toggle button{background:none;border:none;color:var(--sky-deep);font-weight:600;cursor:pointer;font-size:13px;padding:0 4px}
    .auth-err{background:var(--red-pale);color:var(--red);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:11px 14px;font-size:12.5px;margin-bottom:14px;line-height:1.5}
    .auth-info{background:var(--sky-glow);color:var(--sky-deep);border:1px solid rgba(78,168,222,.25);border-radius:10px;padding:11px 14px;font-size:12.5px;margin-bottom:14px;line-height:1.5}
    .signout-btn{width:100%;padding:13px 24px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--border);background:var(--surface);color:var(--red);cursor:pointer;transition:all .2s}
    .invite-btn{width:100%;padding:13px 24px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--sky-light);background:var(--sky-pale);color:var(--sky-deep);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
    .invite-btn:hover{background:var(--sky-light)}
    .signout-btn:hover{background:var(--red-pale);border-color:rgba(239,68,68,.3)}
  `}</style>
);

// ─── SIZE DATA ────────────────────────────────────────────────────────────────
function makeBottomSizes(off=0){return{groups:[{label:"Letter Sizes",sizes:["XXS","XS","S","M","L","XL","XXL"],idx:[0,1,2,3,4,5,6].map(i=>i+off)},{label:"Numeric Sizes",sizes:["00","0","2","4","6","8","10","12","14","16","18","20"],idx:[0,0.5,1,2,3,4,5,6,7,8,9,10].map(i=>i+off)},{label:"Waist (inches)",sizes:["23","24","25","26","27","28","29","30","31","32","33","34","36"],idx:[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i=>i+off)}]};}
function makeTopSizes(off=0){return{groups:[{label:"Letter Sizes",sizes:["XXS","XS","S","M","L","XL","XXL"],idx:[0,1,2,3,4,5,6].map(i=>i+off)}]};}
function makeTopSizesPlus(off=0){return{groups:[{label:"Letter Sizes",sizes:["XXS","XS","S","M","L","XL","XXL","1X","2X","3X"],idx:[0,1,2,3,4,5,6,7,8,9].map(i=>i+off)}]};}
function makeShoesSizes(){return{groups:[{label:"US Women's",sizes:["5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","12"],idx:[0,1,2,3,4,5,6,7,8,9,10,11,12,13]},{label:"EU",sizes:["35","36","37","38","39","40","41","42","43"],idx:[0,1,2,3,4,5,6,7,8]},{label:"UK",sizes:["2.5","3","3.5","4","4.5","5","5.5","6","6.5","7","7.5","8","9"],idx:[0,1,2,3,4,5,6,7,8,9,10,11,12]}]};}
function flattenChart(c){if(!c)return null;if(c.sizes)return c;const s=[],i=[];for(const g of c.groups){g.sizes.forEach((sz,j)=>{s.push(sz);i.push(g.idx[j]);});}return{sizes:s,idx:i};}

const BRAND_SIZES={"Abercrombie & Fitch":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0),Outerwear:makeTopSizes(0)},"Zara":{Tops:makeTopSizes(.5),Jeans:makeBottomSizes(.5),Pants:makeBottomSizes(.5),Shorts:makeBottomSizes(.5),Dresses:makeTopSizes(.5),Outerwear:makeTopSizes(.5),Shoes:makeShoesSizes()},"H&M":{Tops:makeTopSizes(.5),Jeans:makeBottomSizes(.5),Pants:makeBottomSizes(.5),Shorts:makeBottomSizes(.5),Dresses:makeTopSizes(.5),Outerwear:makeTopSizes(.5)},"Madewell":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0),Shoes:makeShoesSizes()},"AGOLDE":{Jeans:makeBottomSizes(0),Shorts:makeBottomSizes(0),Pants:makeBottomSizes(0)},"Good American":{Tops:makeTopSizesPlus(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizesPlus(0)},"Reformation":{Tops:makeTopSizesPlus(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizesPlus(0)},"Frame":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(-.5),Pants:makeBottomSizes(-.5),Shorts:makeBottomSizes(-.5),Outerwear:makeTopSizes(0)},"Levi's":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Shorts:makeBottomSizes(0),Outerwear:makeTopSizes(0)},"Free People":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0),Outerwear:makeTopSizes(0)},"Anthropologie":{Tops:makeTopSizesPlus(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizesPlus(0),Outerwear:makeTopSizes(0)},"Revolve":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0),Outerwear:makeTopSizes(0)},"ASOS":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0),Shoes:makeShoesSizes(),Outerwear:makeTopSizes(0)},"Shein":{Tops:makeTopSizes(.5),Jeans:makeBottomSizes(.5),Pants:makeBottomSizes(.5),Shorts:makeBottomSizes(.5),Dresses:makeTopSizes(.5),Shoes:makeShoesSizes()},"Princess Polly":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0)},"Aritzia":{Tops:makeTopSizes(-.5),Jeans:makeBottomSizes(-.5),Pants:makeBottomSizes(-.5),Shorts:makeBottomSizes(-.5),Dresses:makeTopSizes(-.5),Outerwear:makeTopSizes(-.5)},"& Other Stories":{Tops:makeTopSizes(.3),Jeans:makeBottomSizes(.3),Pants:makeBottomSizes(.3),Shorts:makeBottomSizes(.3),Dresses:makeTopSizes(.3),Shoes:makeShoesSizes()},"COS":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0),Outerwear:makeTopSizes(0)},"Nike":{Tops:makeTopSizes(.5),Pants:makeBottomSizes(.5),Shorts:makeBottomSizes(.5),Outerwear:makeTopSizes(.5),Shoes:makeShoesSizes()},"Adidas":{Tops:makeTopSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Outerwear:makeTopSizes(0),Shoes:makeShoesSizes()},"New Balance":{Tops:makeTopSizes(.5),Pants:makeBottomSizes(.5),Shorts:makeBottomSizes(.5),Shoes:makeShoesSizes()},"On Running":{Tops:makeTopSizes(.5),Pants:makeBottomSizes(.5),Shorts:makeBottomSizes(.5),Shoes:makeShoesSizes()},"Nordstrom":{Tops:makeTopSizes(0),Jeans:makeBottomSizes(0),Pants:makeBottomSizes(0),Shorts:makeBottomSizes(0),Dresses:makeTopSizes(0),Shoes:makeShoesSizes(),Outerwear:makeTopSizes(0)},"Topshop":{Tops:makeTopSizes(.5),Jeans:makeBottomSizes(.5),Shorts:makeBottomSizes(.5),Dresses:makeTopSizes(.5),Outerwear:makeTopSizes(.5)}};

function convertBrandSize(fB,fSz,tB,cat){const fc=flattenChart(BRAND_SIZES[fB]?.[cat]),tc=flattenChart(BRAND_SIZES[tB]?.[cat]);if(!fc||!tc)return null;const fi=fc.sizes.indexOf(fSz);if(fi===-1)return null;const fidx=fc.idx[fi];let bi=0,bd=Infinity;tc.idx.forEach((ti,i)=>{const d=Math.abs(ti-fidx);if(d<bd){bd=d;bi=i;}});return{size:tc.sizes[bi],exact:bd===0,close:bd<=.6};}
function sharedCats(b1,b2){return Object.keys(BRAND_SIZES[b1]||{}).filter(c=>BRAND_SIZES[b2]?.[c]);}

const BRAND_DIRECTORY=[{name:"Abercrombie & Fitch",url:"https://www.abercrombie.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear"],icon:"🦌",color:"#8B6914"},{name:"Zara",url:"https://www.zara.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear","Shoes"],icon:"✦",color:"#1a1a1a"},{name:"H&M",url:"https://www.hm.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear"],icon:"🏷",color:"#E50010"},{name:"Madewell",url:"https://www.madewell.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Shoes"],icon:"🧵",color:"#2D5A8E"},{name:"AGOLDE",url:"https://agolde.com",cats:["Jeans","Shorts","Pants"],icon:"◈",color:"#4A4A4A"},{name:"Good American",url:"https://goodamerican.com",cats:["Tops","Jeans","Pants","Shorts","Dresses"],icon:"★",color:"#1A1A1A"},{name:"Reformation",url:"https://www.thereformation.com",cats:["Tops","Jeans","Pants","Shorts","Dresses"],icon:"🌿",color:"#4A7C59"},{name:"Frame",url:"https://frame-store.com",cats:["Tops","Jeans","Pants","Shorts","Outerwear"],icon:"◻",color:"#2A2A2A"},{name:"Levi's",url:"https://www.levi.com",cats:["Tops","Jeans","Shorts","Outerwear"],icon:"⬡",color:"#C8102E"},{name:"Free People",url:"https://www.freepeople.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear"],icon:"🌸",color:"#9B6B9B"},{name:"Anthropologie",url:"https://www.anthropologie.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear"],icon:"🪴",color:"#8B7355"},{name:"Revolve",url:"https://www.revolve.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear"],icon:"⟳",color:"#000"},{name:"ASOS",url:"https://www.asos.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Shoes","Outerwear"],icon:"🅰",color:"#2C2C2C"},{name:"Shein",url:"https://www.shein.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Shoes"],icon:"S",color:"#000"},{name:"Princess Polly",url:"https://www.princesspolly.com",cats:["Tops","Jeans","Shorts","Dresses"],icon:"👑",color:"#C084A0"},{name:"Aritzia",url:"https://www.aritzia.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear"],icon:"▲",color:"#1A1A1A"},{name:"& Other Stories",url:"https://www.stories.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Shoes"],icon:"◇",color:"#5A5A5A"},{name:"COS",url:"https://www.cosstores.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Outerwear"],icon:"○",color:"#3A3A3A"},{name:"Nike",url:"https://www.nike.com",cats:["Tops","Pants","Shorts","Shoes","Outerwear"],icon:"✓",color:"#111"},{name:"Adidas",url:"https://www.adidas.com",cats:["Tops","Pants","Shorts","Shoes","Outerwear"],icon:"⟁",color:"#000"},{name:"New Balance",url:"https://www.newbalance.com",cats:["Tops","Pants","Shorts","Shoes"],icon:"N",color:"#CF4520"},{name:"On Running",url:"https://www.on-running.com",cats:["Tops","Pants","Shorts","Shoes"],icon:"◉",color:"#1A1A1A"},{name:"Nordstrom",url:"https://www.nordstrom.com",cats:["Tops","Jeans","Pants","Shorts","Dresses","Shoes","Outerwear"],icon:"🏬",color:"#1A3A6B"},{name:"Topshop",url:"https://www.topshop.com",cats:["Tops","Jeans","Shorts","Dresses","Outerwear"],icon:"T",color:"#000"}];
const BRANDS=BRAND_DIRECTORY.map(b=>b.name);
function brandDomain(url){try{return new URL(url).hostname.replace(/^www\./,"");}catch{return null;}}
function brandLogoUrl(brand){const d=brandDomain(brand.url);return d?`https://logo.clearbit.com/${d}?size=128`:null;}
function BrandLogo({brand,size=40,radius=10,fontSize=18}){
  const [failed,setFailed]=useState(false);
  const logo=brandLogoUrl(brand);
  return(
    <div style={{width:size,height:size,borderRadius:radius,background:`${brand.color}18`,border:`1px solid ${brand.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize,overflow:"hidden",flexShrink:0}}>
      {logo&&!failed
        ?<img src={logo} alt={`${brand.name} logo`} loading="lazy" onError={()=>setFailed(true)} style={{width:"100%",height:"100%",objectFit:"contain",padding:size*0.16}}/>
        :brand.icon}
    </div>
  );
}
const CATEGORIES=["Tops","Jeans","Pants","Shorts","Dresses","Outerwear","Shoes"];
const FIT_RATINGS=[
  {id:"runs_small",label:"Runs Small",color:"var(--amber-deep, #B45309)",bg:"var(--amber-pale)"},
  {id:"true_to_size",label:"True to Size",color:"var(--green-deep)",bg:"var(--green-pale)"},
  {id:"runs_large",label:"Runs Large",color:"var(--sky-deep)",bg:"var(--sky-pale)"},
];

const FIT_SCORES={"Abercrombie & Fitch":{Jeans:50,Tops:50,Shorts:50,Dresses:50},"Zara":{Jeans:55,Tops:57,Shorts:55,Dresses:58},"H&M":{Tops:55,Jeans:54,Shorts:54},"Madewell":{Jeans:50,Tops:50,Dresses:50,Shorts:50},"AGOLDE":{Jeans:44,Shorts:44,Pants:44},"Good American":{Jeans:52,Tops:51,Dresses:51},"Reformation":{Jeans:48,Tops:50,Dresses:50},"Frame":{Jeans:42,Tops:50,Shorts:42},"Levi's":{Jeans:50,Shorts:50,Tops:50},"Free People":{Tops:52,Jeans:53,Dresses:54},"Aritzia":{Tops:38,Jeans:40,Pants:38,Dresses:40},"& Other Stories":{Tops:56,Jeans:57,Dresses:58},"COS":{Tops:50,Jeans:50,Dresses:52},"Nike":{Tops:54,Pants:53,Shorts:53},"Adidas":{Tops:50,Pants:50,Shorts:50},"New Balance":{Shoes:55,Tops:52},"On Running":{Shoes:50,Tops:52},"ASOS":{Tops:52,Jeans:53,Dresses:54},"Shein":{Tops:57,Jeans:58,Dresses:58},"Princess Polly":{Tops:52,Jeans:53,Dresses:54},"Anthropologie":{Tops:51,Jeans:50,Dresses:52},"Revolve":{Tops:50,Jeans:51,Dresses:52},"Nordstrom":{Tops:50,Jeans:50,Dresses:50,Shoes:50},"Topshop":{Tops:54,Jeans:55,Dresses:56}};
function getFitLabel(s){if(s<=40)return{label:"Runs Very Small",color:"var(--red)",bg:"var(--red-pale)"};if(s<=47)return{label:"Runs Small",color:"#D97706",bg:"var(--amber-pale)"};if(s<=53)return{label:"True to Size",color:"var(--green-deep)",bg:"var(--green-pale)"};if(s<=60)return{label:"Runs Large",color:"#D97706",bg:"var(--amber-pale)"};return{label:"Runs Very Large",color:"var(--red)",bg:"var(--red-pale)"};}

function ago(ts){const d=Date.now()-ts;if(d<60000)return"just now";if(d<3600000)return`${Math.floor(d/60000)}m`;if(d<86400000)return`${Math.floor(d/3600000)}h`;return`${Math.floor(d/86400000)}d ago`;}
const AVC=["#4EA8DE","#9B72CF","#E0828A","#5BAD8F","#D4943A"];
function avc(s){let h=0;for(let c of(s||"x"))h=(c.charCodeAt(0)+h*31)%AVC.length;return AVC[h];}

const Ic={
  search:<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  feed:<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  post:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  brands:<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  user:<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  link:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  check:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  back:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>,
  ext:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  heart:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  camera:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  bell:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  x:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  comment:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>,
  message:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  trash:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  send:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  share:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
};

function FitScoreBar({brand,category,count=null}){
  const score=FIT_SCORES[brand]?.[category];
  if(!score)return null;
  const {label,color,bg}=getFitLabel(score);
  return(
    <div className="fit-score-wrap">
      <div className="fit-score-label"><span>Fit Score</span><span style={{background:bg,color,padding:"2px 9px",borderRadius:20,fontSize:10,fontWeight:700}}>{label}</span></div>
      <div className="fit-score-bar-wrap">
        <div className="fit-score-bar-fill" style={{width:`${score}%`,background:`linear-gradient(90deg,var(--green),${score>53?"var(--amber)":"var(--green)"})`}}/>
        <div className="fit-score-tick" style={{left:`${score}%`,background:color}}/>
      </div>
      <div className="fit-score-labels"><span className="fit-score-lbl">Runs Small</span><span className="fit-score-lbl">True to Size</span><span className="fit-score-lbl">Runs Large</span></div>
      {count!==null&&<div className="fit-score-count">{count} community notes</div>}
    </div>
  );
}

function SizeSelect({value,onChange,chart,disabled}){
  const isGrouped=chart?.groups!=null;
  return(
    <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled||!chart}>
      <option value="">Select size...</option>
      {isGrouped
        ?chart.groups.map(g=><optgroup key={g.label} label={g.label}>{g.sizes.map(s=><option key={s}>{s}</option>)}</optgroup>)
        :(chart?.sizes||[]).map(s=><option key={s}>{s}</option>)
      }
    </select>
  );
}

function friendStatus(userId,follows,pendingOut){
  if(follows&&userId&&follows.includes(userId))return"accepted";
  if(pendingOut&&userId&&pendingOut.includes(userId))return"pending";
  return"none";
}

function FollowButton({status,onClick}){
  const label=status==="accepted"?"Friends":status==="pending"?"Requested":"+ Add Friend";
  return(
    <button className={`follow-btn${status==="accepted"?" following":status==="pending"?" pending":""}`} onClick={onClick}>
      {label}
    </button>
  );
}

function FollowOnlyButton({following,onClick}){
  return(
    <button className={`follow-btn${following?" following":""}`} onClick={onClick}>
      {following?"Following":"+ Follow"}
    </button>
  );
}

function PostCard({post,onLinkClick,onUpvote,onPhotoClick,currentUserId,currentUsername,follows,pendingOut,onFollow,onDelete}){
  const init=post.anonymous?"?":(post.username||"?").replace("@","").slice(0,2).toUpperCase();
  const c=avc(post.username||"anon");
  const [voted,setVoted]=useState(false);
  const [upvotes,setUpvotes]=useState(post.upvotes||0);
  function handleUpvote(){if(!voted){setVoted(true);setUpvotes(u=>u+1);onUpvote(post.id);}}
  const isOwnPost=currentUserId&&post.userId===currentUserId;
  const status=friendStatus(post.userId,follows,pendingOut);
  const canFollow=!post.anonymous&&post.userId&&!isOwnPost&&onFollow;

  const [showComments,setShowComments]=useState(false);
  const [comments,setComments]=useState(null);
  const [commentCount,setCommentCount]=useState(null);
  const [commentText,setCommentText]=useState("");
  const [posting,setPosting]=useState(false);

  useEffect(()=>{
    supabase.from("comments").select("id",{count:"exact",head:true}).eq("post_id",post.id)
      .then(({count})=>setCommentCount(count||0));
  },[post.id]);

  function toggleComments(){
    const next=!showComments;
    setShowComments(next);
    if(next&&comments===null){
      supabase.from("comments").select("*").eq("post_id",post.id).order("created_at",{ascending:true})
        .then(({data})=>setComments(data||[]));
    }
  }

  async function submitComment(){
    const body=commentText.trim();
    if(!body||!currentUserId||posting)return;
    setPosting(true);
    const row={post_id:post.id,user_id:currentUserId,username:currentUsername||"user",body};
    const {data,error}=await supabase.from("comments").insert(row).select().single();
    if(!error&&data){
      setComments(prev=>[...(prev||[]),data]);
      setCommentCount(c=>(c||0)+1);
      setCommentText("");
      if(post.userId&&post.userId!==currentUserId){
        await supabase.from("notifications").insert({user_id:post.userId,actor_id:currentUserId,type:"comment",post_id:post.id});
      }
    }
    setPosting(false);
  }

  return(
    <div className="pcard">
      <div className="pmeta">
        <div className="pav" style={post.anonymous?{background:"#F0F2F7",color:"#AAB",borderRadius:12,border:"1px solid #E4E8F0"}:{background:`${c}18`,color:c,borderRadius:12,border:`1px solid ${c}30`}}>{init}</div>
        <div className="pav-info">
          <div className="puname" style={{display:"flex",alignItems:"center",gap:8}}>
            {post.anonymous?"Anonymous":post.username}
            {canFollow&&<FollowButton status={status} onClick={e=>{e.stopPropagation();onFollow(post.userId,status);}}/>}
          </div>
          <div className="ptime">{ago(post.ts)}</div>
        </div>
        {isOwnPost&&onDelete&&(
          <button className="post-delete-btn" title="Delete post" onClick={e=>{e.stopPropagation();if(window.confirm("Delete this post? This can't be undone."))onDelete(post.id);}}>{Ic.trash}</button>
        )}
      </div>
      {post.photo&&<img className="fit-photo" src={post.photo} alt="Fit" onClick={()=>onPhotoClick(post.photo)}/>}
      <div className="pcat-row" style={{marginBottom:10}}>
        <span className="chip chip-sky">{post.category}</span>
        {post.fromBrand&&<span className="chip chip-sky">{post.fromBrand}</span>}
        {post.fitRating&&FIT_RATINGS.find(r=>r.id===post.fitRating)&&(
          <span className="chip" style={{color:FIT_RATINGS.find(r=>r.id===post.fitRating).color,background:FIT_RATINGS.find(r=>r.id===post.fitRating).bg,border:"1px solid currentColor"}}>
            {FIT_RATINGS.find(r=>r.id===post.fitRating).label}
          </span>
        )}
      </div>
      {post.fromSize&&<div style={{fontSize:13,fontWeight:600,color:"var(--ink)",marginBottom:10}}>Wears size: {post.fromSize}</div>}
      <p className="fit-quote">{post.fitNote}</p>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        {post.link&&<a className="shop-btn" href={post.link} target="_blank" rel="noopener noreferrer" onClick={()=>onLinkClick(post.id)}>{Ic.link}<span className="shop-btn-text">{post.linkLabel||post.link}</span></a>}
        <button className={`upvote-btn${voted?" voted":""}`} onClick={handleUpvote}>{Ic.heart} {upvotes}</button>
        <button className={`comment-btn${showComments?" open":""}`} onClick={toggleComments}>{Ic.comment} {commentCount===null?"":commentCount}</button>
      </div>
      {showComments&&(
        <div className="comments-wrap">
          {comments===null
            ?<div style={{fontSize:12,color:"var(--muted)"}}>Loading…</div>
            :comments.length===0
              ?<div style={{fontSize:12,color:"var(--muted)"}}>No comments yet — be the first!</div>
              :comments.map(cm=>{
                return(
                  <div key={cm.id} className="comment-item">
                    <span className="comment-uname">{cm.username}</span>
                    <span className="comment-text">{cm.body}</span>
                    <span className="comment-time">{ago(new Date(cm.created_at).getTime())}</span>
                  </div>
                );
              })
          }
          {currentUserId&&(
            <div className="comment-input-row">
              <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment..." onKeyDown={e=>{if(e.key==="Enter")submitComment();}}/>
              <button className="comment-send" disabled={!commentText.trim()||posting} onClick={submitComment}>Post</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchPage({savedSizes}){
  const [fromBrand,setFromBrand]=useState("Abercrombie & Fitch");
  const [fromSize,setFromSize]=useState("");
  const [toBrand,setToBrand]=useState("Zara");
  const [cat,setCat]=useState("");
  const [result,setResult]=useState(null);
  const [fitScore,setFitScore]=useState(null);
  const shared=sharedCats(fromBrand,toBrand);
  useEffect(()=>{setFromSize("");setCat(shared[0]||"");setResult(null);},[fromBrand,toBrand]);
  useEffect(()=>{setFromSize("");setResult(null);},[cat]);
  const chartRaw=BRAND_SIZES[fromBrand]?.[cat];
  const canSearch=fromSize&&cat&&toBrand;

  function handleFind(){
    if(!canSearch)return;
    const r=convertBrandSize(fromBrand,fromSize,toBrand,cat);
    setResult(r);
    setFitScore(FIT_SCORES[toBrand]?.[cat]||null);
  }

  return(
    <div className="page"><div className="inner">
      <div className="search-hero">
        <div className="eyebrow">Size Converter</div>
        <div className="hero-h1">What's My<br/><em>Size In…?</em></div>
        <div className="hero-sub">Tell us what you own — we'll tell you what to buy.</div>
      </div>

      {savedSizes.length>0&&(
        <div style={{marginBottom:14}}>
          <div className="lbl" style={{marginBottom:8}}>Quick Fill from Your Profile</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {savedSizes.map((s,i)=>(
              <button key={i} className="btn btn-ghost btn-sm" onClick={()=>{setFromBrand(s.brand);setCat(s.cat);setResult(null);setTimeout(()=>setFromSize(s.size),50);}}>
                {s.brand} · {s.cat} {s.size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div style={{marginBottom:6,fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--sky-deep)"}}>I own</div>
        <div className="field"><label className="lbl">Brand</label>
          <select value={fromBrand} onChange={e=>{setFromBrand(e.target.value);setResult(null);}}>
            {BRANDS.map(b=><option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="row2">
          <div className="field"><label className="lbl">Category</label>
            <select value={cat} onChange={e=>{setCat(e.target.value);setResult(null);}} disabled={!shared.length}>
              {shared.length?shared.map(c=><option key={c}>{c}</option>):<option>No overlap</option>}
            </select>
          </div>
          <div className="field"><label className="lbl">My size</label>
            <SizeSelect value={fromSize} onChange={v=>{setFromSize(v);setResult(null);}} chart={chartRaw} disabled={!cat}/>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"4px 0 18px"}}>
          <div style={{flex:1,height:1,background:"var(--border2)"}}/>
          <div style={{width:32,height:32,borderRadius:10,background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,flexShrink:0}}>↓</div>
          <div style={{flex:1,height:1,background:"var(--border2)"}}/>
        </div>

        <div style={{marginBottom:6,fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)"}}>I want to know my size at</div>
        <div className="field" style={{marginBottom:16}}><label className="lbl">Brand</label>
          <select value={toBrand} onChange={e=>{setToBrand(e.target.value);setResult(null);}}>
            {BRANDS.filter(b=>b!==fromBrand).map(b=><option key={b}>{b}</option>)}
          </select>
        </div>

        <button className="btn btn-sky btn-full" onClick={handleFind} disabled={!canSearch}>
          Find My Size →
        </button>
      </div>

      {result&&(
        <div className="result-panel" style={{marginBottom:14}}>
          <div className="result-eyebrow">{fromBrand} · {fromSize} · {cat}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.35)",marginBottom:8,position:"relative",zIndex:1}}>in {toBrand}, you're a</div>
          <div className="result-num"><span className="result-accent">{result.size}</span></div>
          <div className={`result-tag${result.exact||result.close?" match":""}`} style={{marginTop:14}}>
            {result.exact?<>{Ic.check} Exact match</>:result.close?<>{Ic.check} Very close fit</>:<>⚡ Approximate — check community notes</>}
          </div>
        </div>
      )}
      {result&&fitScore&&<FitScoreBar brand={toBrand} category={cat}/>}
      <div className="info-row">💡 Sizes are based on brand-specific charts. Real fit varies — see <strong>Community</strong> for firsthand notes.</div>
    </div></div>
  );
}

function UserProfilePage({userId,username,posts,follows,pendingOut,onFollow,currentUserId,currentUsername,onBack,onLinkClick,onUpvote,onPhotoClick,onOpenChat,oneWayFollows,onToggleFollow,onDelete}){
  const userPosts=posts.filter(p=>p.userId===userId||(!p.userId&&p.username===username));
  const status=friendStatus(userId,follows,pendingOut);
  const isOwn=currentUserId===userId;
  const c=avc(username||"user");
  const init=(username||"?").replace("@","").slice(0,1).toUpperCase();
  const [extra,setExtra]=useState(null);
  const [friendCount,setFriendCount]=useState(null);
  const [followerCount,setFollowerCount]=useState(null);
  const isFollowing=oneWayFollows&&userId&&oneWayFollows.includes(userId);
  useEffect(()=>{
    if(!userId){setExtra(null);return;}
    supabase.from("profiles").select("bio,fav_brands").eq("id",userId).maybeSingle()
      .then(({data})=>setExtra(data||null));
  },[userId]);
  useEffect(()=>{
    if(!userId){setFriendCount(null);return;}
    supabase.from("follows").select("id",{count:"exact",head:true}).eq("follower_id",userId).eq("status","accepted")
      .then(({count})=>setFriendCount(count||0));
  },[userId]);
  useEffect(()=>{
    if(!userId){setFollowerCount(null);return;}
    supabase.from("followers").select("id",{count:"exact",head:true}).eq("followed_id",userId)
      .then(({count})=>setFollowerCount(count||0));
  },[userId]);
  return(
    <div className="page">
      <div className="uprofile-header">
        <button className="bdh-back" onClick={onBack} style={{marginBottom:14,zIndex:1,position:"relative"}}>{Ic.back} Back</button>
        <div className="uprofile-av" style={{background:`${c}25`,color:c}}>{init}</div>
        <div className="uprofile-name">{username||"User"}</div>
        <div className="uprofile-sub">{userPosts.length} post{userPosts.length!==1?"s":""}{friendCount!==null?` · ${friendCount} friend${friendCount!==1?"s":""}`:""}{followerCount!==null?` · ${followerCount} follower${followerCount!==1?"s":""}`:""} · knop member</div>
        {!isOwn&&(
          <div style={{marginTop:12,position:"relative",zIndex:1,display:"flex",gap:8,flexWrap:"wrap"}}>
            <FollowButton status={status} onClick={()=>onFollow(userId,status)}/>
            <FollowOnlyButton following={isFollowing} onClick={()=>onToggleFollow(userId)}/>
            {status==="accepted"&&(
              <button className="message-btn" onClick={()=>onOpenChat(userId,username)}>{Ic.message} Message</button>
            )}
          </div>
        )}
      </div>
      <div className="inner">
        {extra?.bio&&(
          <div className="measurements-card" style={{marginTop:18}}>
            <div className="measurements-head">Bio</div>
            <div className="bio-text">{extra.bio}</div>
          </div>
        )}
        {extra?.fav_brands&&extra.fav_brands.length>0&&(
          <div className="measurements-card">
            <div className="measurements-head">Favorite Brands</div>
            <div className="brand-chip-grid">
              {extra.fav_brands.map(name=>(
                <div key={name} className="brand-chip readonly active">{name}</div>
              ))}
            </div>
          </div>
        )}
        {userPosts.length===0
          ?<div className="empty"><div className="empty-ico">✦</div>No posts yet.</div>
          :userPosts.map(p=><PostCard key={p.id} post={p} onLinkClick={onLinkClick} onUpvote={onUpvote} onPhotoClick={onPhotoClick} currentUserId={currentUserId} currentUsername={currentUsername} follows={follows} pendingOut={pendingOut} onFollow={onFollow} onDelete={onDelete}/>)
        }
      </div>
    </div>
  );
}

function FeedPage({posts,onLinkClick,onUpvote,onPhotoClick,currentUserId,currentUsername,follows,pendingOut,onFollow,onOpenChat,oneWayFollows,onToggleFollow,onDelete}){
  const [cf,setCf]=useState("All");
  const [sort,setSort]=useState("recent");
  const [feedView,setFeedView]=useState("everyone");
  const [searchQ,setSearchQ]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const [searching,setSearching]=useState(false);
  const [selectedUser,setSelectedUser]=useState(null);

  useEffect(()=>{
    if(!searchQ.trim()){setSearchResults([]);return;}
    const t=setTimeout(async()=>{
      setSearching(true);
      const {data}=await supabase.from("profiles").select("id,username").ilike("username",`%${searchQ.trim()}%`).limit(20);
      setSearchResults(data||[]);
      setSearching(false);
    },300);
    return()=>clearTimeout(t);
  },[searchQ]);

  if(selectedUser){
    return <UserProfilePage
      userId={selectedUser.id} username={selectedUser.username}
      posts={posts} follows={follows} pendingOut={pendingOut} onFollow={onFollow}
      currentUserId={currentUserId} currentUsername={currentUsername} onBack={()=>setSelectedUser(null)}
      onLinkClick={onLinkClick} onUpvote={onUpvote} onPhotoClick={onPhotoClick} onOpenChat={onOpenChat}
      oneWayFollows={oneWayFollows} onToggleFollow={onToggleFollow} onDelete={onDelete}
    />;
  }

  let filtered=cf==="All"?[...posts]:posts.filter(p=>p.category===cf);
  if(feedView==="following"&&follows){
    filtered=filtered.filter(p=>p.userId&&follows.includes(p.userId));
  }
  if(sort==="top")filtered=[...filtered].sort((a,b)=>(b.upvotes||0)-(a.upvotes||0));

  return(
    <div className="page"><div className="inner">
      <div className="feed-header"><div className="pg-title">Community</div><div className="pg-sub">Real sizes, honest notes.</div></div>

      {/* User search */}
      <div className="search-input-wrap" style={{marginBottom:12}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search people by username..."/>
      </div>

      {/* Search results */}
      {searchQ.trim()&&(
        <div style={{marginBottom:16}}>
          {searching&&<div style={{fontSize:13,color:"var(--muted)",padding:"8px 0"}}>Searching...</div>}
          {!searching&&searchResults.length===0&&<div style={{fontSize:13,color:"var(--muted)",padding:"8px 0"}}>No users found.</div>}
          {searchResults.map(u=>{
            const c=avc(u.username||"user");
            const init=(u.username||"?").replace("@","").slice(0,1).toUpperCase();
            const status=friendStatus(u.id,follows,pendingOut);
            const isOwn=currentUserId===u.id;
            return(
              <div key={u.id} className="user-card" onClick={()=>setSelectedUser(u)}>
                <div className="user-av" style={{background:`${c}18`,color:c}}>{init}</div>
                <div className="user-info">
                  <div className="user-name">{u.username}</div>
                  <div className="user-meta">{posts.filter(p=>p.userId===u.id).length} posts</div>
                </div>
                {!isOwn&&(
                  <FollowButton status={status} onClick={e=>{e.stopPropagation();onFollow(u.id,status);}}/>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!searchQ.trim()&&(<>
        <div style={{display:"flex",gap:8,marginBottom:4}}>
          <button className={`fpill${feedView==="everyone"?" on":""}`} onClick={()=>setFeedView("everyone")} style={{flex:1,textAlign:"center"}}>Everyone</button>
          <button className={`fpill${feedView==="following"?" on":""}`} onClick={()=>setFeedView("following")} style={{flex:1,textAlign:"center"}}>Following {follows&&follows.length>0?`(${follows.length})`:""}</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0 0"}}>
          <div className="filter-row" style={{padding:0,flex:1,marginRight:6}}>{["All",...CATEGORIES].map(c=><button key={c} className={`fpill${cf===c?" on":""}`} onClick={()=>setCf(c)}>{c}</button>)}</div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{width:"auto",padding:"7px 32px 7px 12px",fontSize:12,flexShrink:0}}>
            <option value="recent">Recent</option><option value="top">Top</option>
          </select>
        </div>
        {filtered.length===0
          ?<div className="empty"><div className="empty-ico">✦</div>{feedView==="following"?"Follow people to see their posts here.":"No posts yet. Be the first to share."}</div>
          :filtered.map(p=><PostCard key={p.id} post={p} onLinkClick={onLinkClick} onUpvote={onUpvote} onPhotoClick={onPhotoClick} currentUserId={currentUserId} currentUsername={currentUsername} follows={follows} pendingOut={pendingOut} onFollow={onFollow} onDelete={onDelete}/>)
        }
      </>)}
    </div></div>
  );
}

function PostPage({onPost,defaultUsername}){
  const [cat,setCat]=useState("Tops");
  const [brand,setBrand]=useState("Abercrombie & Fitch");
  const [size,setSize]=useState("");
  const [note,setNote]=useState("");
  const [link,setLink]=useState("");const [lbl,setLbl]=useState("");
  const [anon,setAnon]=useState(false);const [uname,setUname]=useState(defaultUsername||"");
  const [photoPreview,setPhotoPreview]=useState(null);
  const [photoFile,setPhotoFile]=useState(null);
  const [fitRating,setFitRating]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const fileRef=useRef();
  const chart=BRAND_SIZES[brand]?.[cat];
  useEffect(()=>{setSize("");},[cat,brand]);
  const ok=note.trim()&&!submitting;
  function handlePhoto(e){const f=e.target.files?.[0];if(!f)return;setPhotoFile(f);setPhotoPreview(URL.createObjectURL(f));}
  async function submit(){
    if(!ok)return;
    setSubmitting(true);
    await onPost({username:anon?null:`@${uname||"user"}`,anonymous:anon,category:cat,fromBrand:brand,fromSize:size||null,toBrand:null,toSize:null,fitNote:note,fitRating:fitRating||null,photoFile,link:link||null,linkLabel:lbl||link});
    setNote("");setLink("");setLbl("");setSize("");setPhotoPreview(null);setPhotoFile(null);setFitRating("");
    setSubmitting(false);
  }
  return(
    <div className="page"><div className="inner">
      <div className="page-ttl">Share a Fit</div>
      <div className="page-sub">What are you wearing and how does it fit?</div>
      <div className="card">
        <div className="form-section">Brand & Category</div>
        <div className="field"><label className="lbl">Brand</label><select value={brand} onChange={e=>setBrand(e.target.value)}>{BRANDS.map(b=><option key={b}>{b}</option>)}</select></div>
        <div className="row2">
          <div className="field"><label className="lbl">Category</label><select value={cat} onChange={e=>setCat(e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="field"><label className="lbl">Size worn <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></label><SizeSelect value={size} onChange={setSize} chart={chart}/></div>
        </div>
        <div className="sdiv"/>
        <div className="form-section">Fit Photo <span style={{textTransform:"none",letterSpacing:0,fontWeight:400,color:"var(--muted)",fontSize:11}}>— recommended</span></div>
        {photoPreview
          ?<div className="photo-preview-wrap"><img src={photoPreview} style={{width:"100%",borderRadius:12,maxHeight:240,objectFit:"cover"}} alt="preview"/><button className="photo-remove" onClick={()=>setPhotoPreview(null)}>✕</button></div>
          :<button className="photo-upload-btn" onClick={()=>fileRef.current?.click()}>{Ic.camera} Add a fit photo</button>
        }
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        <div className="sdiv"/>
        <div className="form-section">Rate the Fit <span style={{textTransform:"none",letterSpacing:0,fontWeight:400,color:"var(--muted)",fontSize:11}}>— optional</span></div>
        <div className="filter-row" style={{padding:"0 0 2px"}}>
          {FIT_RATINGS.map(r=>(
            <button key={r.id} type="button" className={`fpill${fitRating===r.id?" on":""}`} onClick={()=>setFitRating(fitRating===r.id?"":r.id)}>{r.label}</button>
          ))}
        </div>
        <div className="sdiv"/>
        <div className="form-section">How does it fit? *</div>
        <div className="field"><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Describe the fit — true to size? Runs small? Best for what body type? Any tips..."/></div>
        <div className="sdiv"/>
        <div className="form-section">Shop Link <span style={{textTransform:"none",letterSpacing:0,fontWeight:400,color:"var(--muted)",fontSize:11}}>— optional</span></div>
        <div className="field"><input type="url" value={link} onChange={e=>setLink(e.target.value)} placeholder="Paste a link to the item..."/></div>
        <div className="field"><input type="text" value={lbl} onChange={e=>setLbl(e.target.value)} placeholder="e.g. Zara High Rise Straight Leg"/></div>
        <div className="sdiv"/>
        <label className="togwrap" style={{marginBottom:16}}>
          <div className="tog"><input type="checkbox" checked={anon} onChange={e=>setAnon(e.target.checked)}/><div className="tog-trk"/></div>
          <span className="tog-lbl">Post anonymously</span>
        </label>
        {!anon&&<div className="field"><label className="lbl">Username</label><input type="text" value={uname} onChange={e=>setUname(e.target.value)} placeholder="@yourhandle"/></div>}
        <button className="btn btn-sky btn-full" onClick={submit} disabled={!ok}>{submitting?"Sharing...":"Share Fit"}</button>
      </div>
    </div></div>
  );
}

function BrandsPage({posts,onSelectBrand,favBrands,onToggleFav}){
  const [q,setQ]=useState("");
  const [cf,setCf]=useState("All");
  const [view,setView]=useState("all"); // "all" | "favorites"
  function pc(n){return posts.filter(p=>p.fromBrand===n||p.toBrand===n).length;}

  const allFiltered=BRAND_DIRECTORY.filter(b=>
    b.name.toLowerCase().includes(q.toLowerCase())&&(cf==="All"||b.cats.includes(cf))
  );
  const favList=BRAND_DIRECTORY.filter(b=>favBrands.includes(b.name));
  const displayed=view==="favorites"?favList:allFiltered;

  function BrandCard({b}){
    const count=pc(b.name);
    const score=FIT_SCORES[b.name]?.[b.cats[0]];
    const fit=score?getFitLabel(score):null;
    const isFav=favBrands.includes(b.name);
    return(
      <div className="brand-tile" style={{position:"relative"}} onClick={()=>onSelectBrand(b)}>
        <button
          onClick={e=>{e.stopPropagation();onToggleFav(b.name);}}
          style={{position:"absolute",top:10,right:10,background:"none",border:"none",cursor:"pointer",fontSize:16,lineHeight:1,color:isFav?"#F59E0B":"var(--muted3)",transition:"color .2s"}}
          title={isFav?"Remove from favorites":"Add to favorites"}
        >
          {isFav?"★":"☆"}
        </button>
        <BrandLogo brand={b} size={40} radius={10} fontSize={18}/>
        <div className="bt-name">{b.name}</div>
        <div className="bt-cat">{b.cats.slice(0,2).join(", ")}{b.cats.length>2?` +${b.cats.length-2}`:""}</div>
        {fit&&<div style={{fontSize:10,fontWeight:700,color:fit.color,background:fit.bg,padding:"2px 7px",borderRadius:20,alignSelf:"flex-start"}}>{fit.label}</div>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span className="brand-count">{count>0?`${count} note${count!==1?"s":""}`:"Be first"}</span>
          <span style={{color:"var(--sky-deep)",fontSize:12}}>→</span>
        </div>
      </div>
    );
  }

  return(
    <div className="page"><div className="inner">
      <div style={{paddingTop:24,marginBottom:4}}><div className="pg-title">Brands</div><div className="pg-sub">Search any brand to see sizing notes & shop.</div></div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button className={`fpill${view==="all"?" on":""}`} onClick={()=>setView("all")} style={{flex:1,textAlign:"center"}}>All Brands</button>
        <button className={`fpill${view==="favorites"?" on":""}`} onClick={()=>setView("favorites")} style={{flex:1,textAlign:"center"}}>
          ★ Favorites {favBrands.length>0&&`(${favBrands.length})`}
        </button>
      </div>

      {view==="all"&&(
        <>
          <div className="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search brands..."/>
          </div>
          <div className="filter-row">{["All",...CATEGORIES].map(c=><button key={c} className={`fpill${cf===c?" on":""}`} onClick={()=>setCf(c)}>{c}</button>)}</div>
        </>
      )}

      {view==="favorites"&&favList.length===0&&(
        <div className="empty">
          <div className="empty-ico">☆</div>
          No favorites yet.<br/>
          <span style={{color:"var(--muted)",fontSize:13}}>Tap the ★ on any brand to save it here.</span>
        </div>
      )}

      {displayed.length===0&&view==="all"
        ?<div className="empty"><div className="empty-ico">🔍</div>No brands found.</div>
        :<div className="brand-grid">{displayed.map(b=><BrandCard key={b.name} b={b}/>)}</div>
      }
    </div></div>
  );
}

function BrandDetailPage({brand,posts,onBack,onLinkClick,onUpvote,onPhotoClick,favBrands,onToggleFav,currentUserId,currentUsername,onDelete}){
  const bp=posts.filter(p=>p.fromBrand===brand.name||p.toBrand===brand.name);
  const [cf,setCf]=useState("All");
  const filtered=cf==="All"?bp:bp.filter(p=>p.category===cf);
  const activeCats=["All",...CATEGORIES.filter(c=>brand.cats.includes(c))];
  const isFav=favBrands.includes(brand.name);
  return(
    <div className="page">
      <div className="brand-detail-header">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <button className="bdh-back" onClick={onBack} style={{marginBottom:0}}>{Ic.back} All Brands</button>
          <button onClick={()=>onToggleFav(brand.name)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:isFav?"#F59E0B":"rgba(255,255,255,.3)",transition:"color .2s",padding:"4px 8px",lineHeight:1}}>
            {isFav?"★":"☆"}
          </button>
        </div>
        <div style={{marginBottom:12,position:"relative",zIndex:1}}><BrandLogo brand={brand} size={52} radius={14} fontSize={24}/></div>
        <div className="bdh-name">{brand.name}</div>
        <div className="bdh-meta">
          <span style={{fontSize:10.5,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>{brand.cats.join(" · ")}</span>
          <a className="bdh-visit" href={brand.url} target="_blank" rel="noopener noreferrer">Visit site {Ic.ext}</a>
        </div>
      </div>
      <div className="inner">
        {brand.cats.filter(c=>FIT_SCORES[brand.name]?.[c]).slice(0,2).map(c=>(
          <FitScoreBar key={c} brand={brand.name} category={c} count={posts.filter(p=>(p.fromBrand===brand.name||p.toBrand===brand.name)&&p.category===c).length}/>
        ))}
        <div className="filter-row">{activeCats.map(c=><button key={c} className={`fpill${cf===c?" on":""}`} onClick={()=>setCf(c)}>{c}</button>)}</div>
        {filtered.length===0?<div className="empty"><div className="empty-ico">{brand.icon}</div>No notes for {brand.name} yet.</div>
          :filtered.map(p=><PostCard key={p.id} post={p} onLinkClick={onLinkClick} onUpvote={onUpvote} onPhotoClick={onPhotoClick} currentUserId={currentUserId} currentUsername={currentUsername} onDelete={onDelete}/>)
        }
      </div>
    </div>
  );
}

function AddSizeModal({onClose,onAdd}){
  const [brand,setBrand]=useState("Abercrombie & Fitch");const [cat,setCat]=useState("Jeans");const [size,setSize]=useState("");
  const avail=BRAND_SIZES[brand]?.[cat];
  useEffect(()=>setSize(""),[brand,cat]);
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">Add a Saved Size</div>
        <div className="field"><label className="lbl">Brand</label><select value={brand} onChange={e=>setBrand(e.target.value)}>{BRANDS.map(b=><option key={b}>{b}</option>)}</select></div>
        <div className="row2">
          <div className="field"><label className="lbl">Category</label><select value={cat} onChange={e=>setCat(e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="field"><label className="lbl">My Size</label><SizeSelect value={size} onChange={setSize} chart={avail}/></div>
        </div>
        <button className="btn btn-sky btn-full" disabled={!size} onClick={()=>onAdd({brand,cat,size})}>Save Size</button>
      </div>
    </div>
  );
}

const MEAS_FIELDS=[
  {key:"height",label:"Height",placeholder:'e.g. 5\'7"'},
  {key:"bust",label:"Bust",placeholder:"e.g. 34 in"},
  {key:"waist",label:"Waist",placeholder:"e.g. 27 in"},
  {key:"hips",label:"Hips",placeholder:"e.g. 38 in"},
  {key:"inseam",label:"Inseam",placeholder:"e.g. 30 in"},
  {key:"shoe_size",label:"Shoe Size",placeholder:"e.g. US 8"},
];
function MeasurementsCard({measurements,onSave}){
  const [vals,setVals]=useState({height:"",bust:"",waist:"",hips:"",inseam:"",shoe_size:"",...(measurements||{})});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{if(measurements)setVals(v=>({...v,...measurements}));},[measurements]);
  async function handleSave(){
    setSaving(true);
    await onSave(vals);
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2000);
  }
  return(
    <div className="measurements-card">
      <div className="measurements-head">My Measurements</div>
      <div className="measurements-grid">
        {MEAS_FIELDS.map(f=>(
          <div key={f.key} className="meas-item">
            <span className="meas-label">{f.label}</span>
            <input className="meas-input" value={vals[f.key]||""} onChange={e=>setVals(v=>({...v,[f.key]:e.target.value}))} placeholder={f.placeholder}/>
          </div>
        ))}
      </div>
      <button className="meas-save-btn" disabled={saving} onClick={handleSave}>
        {saving?"Saving…":saved?"Saved ✓":"Save Measurements"}
      </button>
    </div>
  );
}

function BioCard({bio,onSave}){
  const [val,setVal]=useState(bio||"");
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{setVal(bio||"");},[bio]);
  async function handleSave(){
    setSaving(true);
    await onSave({bio:val});
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2000);
  }
  return(
    <div className="measurements-card">
      <div className="measurements-head">My Bio</div>
      <textarea className="bio-textarea" value={val} onChange={e=>setVal(e.target.value)} placeholder="Tell people a bit about yourself, your style, body type, etc."/>
      <button className="meas-save-btn" disabled={saving} onClick={handleSave}>
        {saving?"Saving…":saved?"Saved ✓":"Save Bio"}
      </button>
    </div>
  );
}

function FavBrandsCard({favBrands,onSave}){
  const [sel,setSel]=useState(favBrands||[]);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{setSel(favBrands||[]);},[favBrands]);
  function toggle(name){setSel(prev=>prev.includes(name)?prev.filter(n=>n!==name):[...prev,name]);}
  async function handleSave(){
    setSaving(true);
    await onSave({fav_brands:sel});
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2000);
  }
  return(
    <div className="measurements-card">
      <div className="measurements-head">Favorite Brands</div>
      <div className="brand-chip-grid">
        {BRANDS.map(name=>(
          <div key={name} className={`brand-chip${sel.includes(name)?" active":""}`} onClick={()=>toggle(name)}>{name}</div>
        ))}
      </div>
      <button className="meas-save-btn" disabled={saving} onClick={handleSave} style={{marginTop:14}}>
        {saving?"Saving…":saved?"Saved ✓":"Save Favorites"}
      </button>
    </div>
  );
}

function ProfilePage({posts,savedSizes,onAddSize,onRemoveSize,username,onSignOut,measurements,onSaveMeasurements,follows,pendingOut,currentUserId,onFollow,profile,onSaveProfile,onLinkClick,onUpvote,onPhotoClick,onOpenChat,oneWayFollows,onToggleFollow,myFollowers,onDelete}){
  const currentUsername=username;
  const [viewingUser,setViewingUser]=useState(null);
  const [friendProfiles,setFriendProfiles]=useState([]);
  const [showModal,setShowModal]=useState(false);
  const [showFriends,setShowFriends]=useState(false);
  const [showMyPosts,setShowMyPosts]=useState(false);
  const [showFollowers,setShowFollowers]=useState(false);

  useEffect(()=>{
    if(!follows||follows.length===0){setFriendProfiles([]);return;}
    supabase.from("profiles").select("id,username").in("id",follows)
      .then(({data})=>{if(data)setFriendProfiles(data);});
  },[follows]);

  if(viewingUser){
    return <UserProfilePage
      userId={viewingUser.id} username={viewingUser.username}
      posts={posts} follows={follows} pendingOut={pendingOut} onFollow={onFollow}
      currentUserId={currentUserId} currentUsername={currentUsername}
      onBack={()=>setViewingUser(null)}
      onLinkClick={onLinkClick} onUpvote={onUpvote} onPhotoClick={onPhotoClick} onOpenChat={onOpenChat}
      oneWayFollows={oneWayFollows} onToggleFollow={onToggleFollow} onDelete={onDelete}
    />;
  }

  const myPostsAll=posts.filter(p=>!p.anonymous&&p.username===username);

  if(showFriends){
    return(
      <div className="page"><div className="inner">
        <button className="page-back" onClick={()=>setShowFriends(false)} style={{marginTop:24}}>{Ic.back} Back</button>
        <div className="feed-header"><div className="pg-title">Friends</div><div className="pg-sub">{friendProfiles.length} {friendProfiles.length===1?"friend":"friends"}</div></div>
        {friendProfiles.length===0
          ?<div className="empty"><div className="empty-ico">✦</div>You're not following anyone yet.<br/><span style={{color:"var(--muted)",fontSize:13}}>Search for people in the Feed tab!</span></div>
          :<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16}}>
            {friendProfiles.map(f=>{
              const c=avc(f.username||"user");
              const init=(f.username||"?").replace("@","").slice(0,1).toUpperCase();
              return(
                <div key={f.id} className="user-card" onClick={()=>setViewingUser(f)}>
                  <div className="user-av" style={{background:`${c}18`,color:c}}>{init}</div>
                  <div className="user-info">
                    <div className="user-name">{f.username}</div>
                    <div className="user-meta">{posts.filter(p=>p.userId===f.id).length} posts</div>
                  </div>
                  <span style={{color:"var(--sky-deep)",fontSize:18}}>→</span>
                </div>
              );
            })}
          </div>
        }
      </div></div>
    );
  }

  if(showMyPosts){
    return(
      <div className="page"><div className="inner">
        <button className="page-back" onClick={()=>setShowMyPosts(false)} style={{marginTop:24}}>{Ic.back} Back</button>
        <div className="feed-header"><div className="pg-title">My Posts</div><div className="pg-sub">{myPostsAll.length} {myPostsAll.length===1?"post":"posts"}</div></div>
        {myPostsAll.length===0
          ?<div className="empty"><div className="empty-ico">✦</div>You haven't shared a fit yet.</div>
          :myPostsAll.map(p=><PostCard key={p.id} post={p} onLinkClick={onLinkClick} onUpvote={onUpvote} onPhotoClick={onPhotoClick} currentUserId={currentUserId} currentUsername={currentUsername} follows={follows} pendingOut={pendingOut} onFollow={onFollow} onDelete={onDelete}/>)
        }
      </div></div>
    );
  }

  if(showFollowers){
    return(
      <div className="page"><div className="inner">
        <button className="page-back" onClick={()=>setShowFollowers(false)} style={{marginTop:24}}>{Ic.back} Back</button>
        <div className="feed-header"><div className="pg-title">Followers</div><div className="pg-sub">{myFollowers.length} {myFollowers.length===1?"follower":"followers"}</div></div>
        {myFollowers.length===0
          ?<div className="empty"><div className="empty-ico">✦</div>No one is following you yet.</div>
          :<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16}}>
            {myFollowers.map(f=>{
              const c=avc(f.username||"user");
              const init=(f.username||"?").replace("@","").slice(0,1).toUpperCase();
              return(
                <div key={f.id} className="user-card" onClick={()=>setViewingUser(f)}>
                  <div className="user-av" style={{background:`${c}18`,color:c}}>{init}</div>
                  <div className="user-info">
                    <div className="user-name">{f.username}</div>
                    <div className="user-meta">{posts.filter(p=>p.userId===f.id).length} posts</div>
                  </div>
                  <span style={{color:"var(--sky-deep)",fontSize:18}}>→</span>
                </div>
              );
            })}
          </div>
        }
      </div></div>
    );
  }
  const myPosts=posts.filter(p=>!p.anonymous&&p.username===username);
  const ico={Shoes:"👟",Jeans:"👖",Tops:"👕",Pants:"👗",Shorts:"🩳",Dresses:"🩱",Outerwear:"🧥"};
  const initial=(username||"?").replace("@","").slice(0,1).toUpperCase();

  async function handleInvite(){
    const shareData={
      title:"Knop",
      text:"Join me on Knop, the fashion sizing community app!",
      url:"https://knop-app.com",
    };
    if(navigator.share){
      try{ await navigator.share(shareData); }catch(e){}
    }else{
      try{
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Invite link copied! Paste it in a text or message to share.");
      }catch(e){
        alert(`Share this link: ${shareData.url}`);
      }
    }
  }

  return(
    <div className="page">
      <div style={{maxWidth:680,margin:"0 auto",width:"100%"}}>
        <div className="pro-banner">
          <div className="pro-av" style={{display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:500,color:"var(--sky-deep)"}}>{initial}</div>
          <div className="pro-name">{username||"My Profile"}</div>
          <div className="pro-handle"><span>knop member</span></div>
        </div>
        <div className="inner">
          <div className="stats-row">
            <div className="stat-box" style={{cursor:"pointer"}} onClick={()=>setShowMyPosts(true)}><div className="stat-n">{myPosts.length}</div><div className="stat-l">Posts</div></div>
            <div className="stat-box" style={{cursor:"pointer"}} onClick={()=>setShowFriends(true)}><div className="stat-n">{friendProfiles.length}</div><div className="stat-l">Friends</div></div>
            <div className="stat-box" style={{cursor:"pointer"}} onClick={()=>setShowFollowers(true)}><div className="stat-n">{myFollowers.length}</div><div className="stat-l">Followers</div></div>
            <div className="stat-box"><div className="stat-n">{savedSizes.length}</div><div className="stat-l">Saved Sizes</div></div>
          </div>
          <div className="size-profile-card">
            <div className="sp-head">My Size Profile</div>
            <div className="sp-grid">
              {savedSizes.map((s,i)=>(
                <div key={s.id||i} className="sp-item">
                  <div className="sp-brand">{s.brand}</div>
                  <div className="sp-cat">{s.cat}</div>
                  <div className="sp-size">{s.size}</div>
                  <button className="sp-remove" onClick={()=>onRemoveSize(s,i)}>✕</button>
                </div>
              ))}
              <div className="sp-add" onClick={()=>setShowModal(true)}><span style={{fontSize:18}}>+</span> Add size</div>
            </div>
          </div>
          <MeasurementsCard measurements={measurements} onSave={onSaveMeasurements}/>
          <BioCard bio={profile?.bio} onSave={onSaveProfile}/>
          <FavBrandsCard favBrands={profile?.fav_brands} onSave={onSaveProfile}/>

          <div className="sec-head">Recent Posts</div>
          {myPosts.length===0&&<div style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>You haven't shared a fit yet.</div>}
          {myPosts.slice(0,5).map(p=>(
            <div key={p.id} className="mini-post" style={{cursor:"pointer"}} onClick={()=>setShowMyPosts(true)}>
              <div className="mini-icon">{ico[p.category]||"🛍"}</div>
              <div className="mini-info"><div className="mini-t">{p.fromBrand} → {p.toBrand}</div><div className="mini-s">{p.category} · {p.fromSize} → {p.toSize}</div></div>
              <div className="mini-clk">{p.clicks||0}</div>
            </div>
          ))}
          <div style={{marginBottom:12}}>
            <button className="invite-btn" onClick={handleInvite}>{Ic.share} Invite Friends</button>
          </div>
          <div style={{marginBottom:28}}>
            <button className="signout-btn" onClick={onSignOut}>Sign Out</button>
          </div>
        </div>
      </div>
      {showModal&&<AddSizeModal onClose={()=>setShowModal(false)} onAdd={s=>{onAddSize(s);setShowModal(false);}}/>}
    </div>
  );
}

function AuthPage({onAuthed}){
  const [mode,setMode]=useState("signin"); // "signin" | "signup" | "forgot"
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");
  const [error,setError]=useState("");
  const [info,setInfo]=useState("");
  const [loading,setLoading]=useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    setInfo("");

    if(mode==="forgot"){
      if(!email.trim()){setError("Please enter your email.");return;}
      setLoading(true);
      try{
        const {error:resetError}=await supabase.auth.resetPasswordForEmail(email.trim(),{
          redirectTo:window.location.origin,
        });
        if(resetError)throw resetError;
        setInfo("Check your email for a link to reset your password.");
      }catch(err){
        setError(err.message||"Something went wrong. Please try again.");
      }finally{
        setLoading(false);
      }
      return;
    }

    if(!email.trim()||!password.trim()||(mode==="signup"&&!username.trim())){
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try{
      if(mode==="signup"){
        const {data,error:signUpError}=await supabase.auth.signUp({
          email:email.trim(),
          password,
          options:{data:{username:username.trim()}},
        });
        if(signUpError)throw signUpError;
        if(data.user){
          await supabase.from("profiles").upsert({id:data.user.id,username:username.trim()});
        }
      }else{
        const {error:signInError}=await supabase.auth.signInWithPassword({
          email:email.trim(),
          password,
        });
        if(signInError)throw signInError;
      }
      onAuthed?.();
    }catch(err){
      setError(err.message||"Something went wrong. Please try again.");
    }finally{
      setLoading(false);
    }
  }

  const titles={
    signin:"Welcome back — sign in to continue",
    signup:"Create an account to share your fits",
    forgot:"Enter your email and we'll send you a reset link",
  };

  return(
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">knop<span style={{color:"var(--sky-deep)"}}>.</span></div>
        <div className="auth-sub">{titles[mode]}</div>
        {error&&<div className="auth-err">{error}</div>}
        {info&&<div className="auth-info">{info}</div>}
        <form onSubmit={handleSubmit}>
          {mode==="signup"&&(
            <div className="field">
              <label className="lbl">Username</label>
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="yourhandle" autoComplete="username"/>
            </div>
          )}
          <div className="field">
            <label className="lbl">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/>
          </div>
          {mode!=="forgot"&&(
            <div className="field">
              <label className="lbl">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode==="signup"?"new-password":"current-password"}/>
            </div>
          )}
          {mode==="signin"&&(
            <div style={{textAlign:"right",marginBottom:16,marginTop:-6}}>
              <button type="button" onClick={()=>{setMode("forgot");setError("");setInfo("");}} style={{background:"none",border:"none",color:"var(--sky-deep)",fontSize:12.5,fontWeight:600,cursor:"pointer",padding:0}}>Forgot password?</button>
            </div>
          )}
          <button type="submit" className="btn btn-sky btn-full" disabled={loading}>
            {loading?"Please wait...":mode==="signin"?"Sign In":mode==="signup"?"Create Account":"Send Reset Link"}
          </button>
        </form>
        <div className="auth-toggle">
          {mode==="signin"&&(
            <>New to knop? <button onClick={()=>{setMode("signup");setError("");setInfo("");}}>Create an account</button></>
          )}
          {mode==="signup"&&(
            <>Already have an account? <button onClick={()=>{setMode("signin");setError("");setInfo("");}}>Sign in</button></>
          )}
          {mode==="forgot"&&(
            <>Remembered it? <button onClick={()=>{setMode("signin");setError("");setInfo("");}}>Back to sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPage({onDone}){
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    if(!password.trim()||!confirm.trim()){setError("Please fill in both fields.");return;}
    if(password.length<6){setError("Password must be at least 6 characters.");return;}
    if(password!==confirm){setError("Passwords don't match.");return;}
    setLoading(true);
    try{
      const {error:updateError}=await supabase.auth.updateUser({password});
      if(updateError)throw updateError;
      onDone?.();
    }catch(err){
      setError(err.message||"Something went wrong. Please try again.");
    }finally{
      setLoading(false);
    }
  }

  return(
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">knop<span style={{color:"var(--sky-deep)"}}>.</span></div>
        <div className="auth-sub">Set a new password</div>
        {error&&<div className="auth-err">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="lbl">New Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password"/>
          </div>
          <div className="field">
            <label className="lbl">Confirm Password</label>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" autoComplete="new-password"/>
          </div>
          <button type="submit" className="btn btn-sky btn-full" disabled={loading}>
            {loading?"Please wait...":"Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function rowToPost(row){
  return{
    id:row.id,
    userId:row.user_id,
    username:row.username,
    anonymous:row.anonymous,
    category:row.category,
    fromBrand:row.from_brand,
    fromSize:row.from_size,
    toBrand:row.to_brand,
    toSize:row.to_size,
    fitNote:row.fit_note,
    fitRating:row.fit_rating,
    photo:row.photo,
    link:row.link,
    linkLabel:row.link_label,
    clicks:row.clicks||0,
    upvotes:row.upvotes||0,
    ts:row.created_at?new Date(row.created_at).getTime():Date.now(),
  };
}

export default function App(){
  const [session,setSession]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [profile,setProfile]=useState(null);
  const [passwordRecovery,setPasswordRecovery]=useState(false);

  const [tab,setTab]=useState("feed");
  const [posts,setPosts]=useState([]);
  const [toast,setToast]=useState(null);
  const [selectedBrand,setSelectedBrand]=useState(null);
  const [lightboxImg,setLightboxImg]=useState(null);
  const [favBrands,setFavBrands]=useState(["Madewell","Aritzia"]);
  const [savedSizes,setSavedSizes]=useState([]);
  const [follows,setFollows]=useState([]); // array of user_ids the current user follows
  const [pendingOut,setPendingOut]=useState([]); // array of user_ids with a pending request sent by current user
  const [incomingRequests,setIncomingRequests]=useState([]); // [{id,userId,username}]
  const [oneWayFollows,setOneWayFollows]=useState([]); // array of user_ids the current user one-way follows
  const [myFollowers,setMyFollowers]=useState([]); // [{id,username}] people one-way following the current user
  const [notifications,setNotifications]=useState([]); // [{id,type,actorId,actorUsername,postId,read,createdAt}]
  const [notifPanelOpen,setNotifPanelOpen]=useState(false);
  const [measurements,setMeasurements]=useState(null);
  const [dmOpen,setDmOpen]=useState(false);
  const [conversations,setConversations]=useState([]); // [{userId,username,lastBody,lastTime,unread}]
  const [activeChat,setActiveChat]=useState(null); // {userId,username}
  const [chatMessages,setChatMessages]=useState([]);
  const [chatText,setChatText]=useState("");
  const [sendingChat,setSendingChat]=useState(false);

  // ── Auth: track session, persist via localStorage (handled by supabase client) ──
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setSession(data.session);
      setAuthLoading(false);
    });
    const {data:listener}=supabase.auth.onAuthStateChange((event,sess)=>{
      setSession(sess);
      if(event==="PASSWORD_RECOVERY")setPasswordRecovery(true);
    });
    return()=>listener.subscription.unsubscribe();
  },[]);

  // ── Load profile (username) once signed in ──
  useEffect(()=>{
    if(!session?.user){setProfile(null);return;}
    supabase.from("profiles").select("username,bio,fav_brands").eq("id",session.user.id).maybeSingle()
      .then(({data})=>{
        if(data?.username)setProfile(data);
        else setProfile({username:session.user.user_metadata?.username||session.user.email});
      });
  },[session]);

  // ── Save bio / favorite brands to profile ──
  async function handleSaveProfile(vals){
    if(!session?.user)return;
    const row={id:session.user.id};
    if("bio" in vals)row.bio=vals.bio;
    if("fav_brands" in vals)row.fav_brands=vals.fav_brands;
    const {data,error}=await supabase.from("profiles").upsert(row,{onConflict:"id"}).select().single();
    if(error){console.error("saveProfile error:",error);showToast("Couldn't save — "+error.message);return;}
    setProfile(prev=>({...prev,...data}));
    showToast("Profile saved ✓");
  }

  // ── Load posts from Supabase ──
  async function loadPosts(){
    const {data,error}=await supabase.from("posts").select("*").order("created_at",{ascending:false});
    if(!error&&data)setPosts(data.map(rowToPost));
  }
  useEffect(()=>{ if(session) loadPosts(); },[session]);

  // ── Load saved sizes for the signed-in user ──
  async function loadSavedSizes(){
    if(!session?.user)return;
    const {data,error}=await supabase.from("saved_sizes").select("*").eq("user_id",session.user.id);
    if(error){console.error("loadSavedSizes error:",error);return;}
    if(data)setSavedSizes(data.map(r=>({id:r.id,brand:r.brand,cat:r.cat,size:r.size})));
  }
  useEffect(()=>{ if(session) loadSavedSizes(); },[session]);

  // ── Load follows for the signed-in user ──
  async function loadFollows(){
    if(!session?.user)return;
    const {data,error}=await supabase.from("follows").select("following_id,status").eq("follower_id",session.user.id);
    if(error){console.error("loadFollows error:",error);return;}
    if(data){
      setFollows(data.filter(r=>r.status==="accepted").map(r=>r.following_id));
      setPendingOut(data.filter(r=>r.status==="pending").map(r=>r.following_id));
    }
  }
  useEffect(()=>{ if(session) loadFollows(); },[session]);

  // ── Load incoming friend requests ──
  async function loadIncomingRequests(){
    if(!session?.user)return;
    const {data,error}=await supabase.from("follows").select("id,follower_id").eq("following_id",session.user.id).eq("status","pending");
    if(error){console.error("loadIncomingRequests error:",error);return;}
    if(!data||data.length===0){setIncomingRequests([]);return;}
    const ids=data.map(r=>r.follower_id);
    const {data:profs}=await supabase.from("profiles").select("id,username").in("id",ids);
    setIncomingRequests(data.map(r=>({id:r.id,userId:r.follower_id,username:profs?.find(p=>p.id===r.follower_id)?.username||"user"})));
  }
  useEffect(()=>{ if(session) loadIncomingRequests(); },[session]);

  // ── Load one-way follows (people I follow, no approval needed) ──
  async function loadOneWayFollows(){
    if(!session?.user)return;
    const {data,error}=await supabase.from("followers").select("followed_id").eq("follower_id",session.user.id);
    if(error){console.error("loadOneWayFollows error:",error);return;}
    if(data)setOneWayFollows(data.map(r=>r.followed_id));
  }
  useEffect(()=>{ if(session) loadOneWayFollows(); },[session]);

  // ── Load people who one-way follow me ──
  async function loadMyFollowers(){
    if(!session?.user)return;
    const {data,error}=await supabase.from("followers").select("follower_id").eq("followed_id",session.user.id);
    if(error){console.error("loadMyFollowers error:",error);return;}
    if(!data||data.length===0){setMyFollowers([]);return;}
    const ids=data.map(r=>r.follower_id);
    const {data:profs}=await supabase.from("profiles").select("id,username").in("id",ids);
    setMyFollowers(profs||[]);
  }
  useEffect(()=>{ if(session) loadMyFollowers(); },[session]);

  // ── Toggle one-way follow ──
  async function handleToggleFollow(userId){
    if(!session?.user||!userId)return;
    if(oneWayFollows.includes(userId)){
      setOneWayFollows(prev=>prev.filter(id=>id!==userId));
      await supabase.from("followers").delete().eq("follower_id",session.user.id).eq("followed_id",userId);
    }else{
      setOneWayFollows(prev=>[...prev,userId]);
      await supabase.from("followers").insert({follower_id:session.user.id,followed_id:userId});
      await supabase.from("notifications").insert({user_id:userId,actor_id:session.user.id,type:"follow"});
    }
  }

  // ── Load notifications ──
  async function loadNotifications(){
    if(!session?.user)return;
    const {data,error}=await supabase.from("notifications").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(50);
    if(error){console.error("loadNotifications error:",error);return;}
    if(!data)return;
    const actorIds=[...new Set(data.map(n=>n.actor_id))];
    const {data:profs}=actorIds.length?await supabase.from("profiles").select("id,username").in("id",actorIds):{data:[]};
    setNotifications(data.map(n=>({
      id:n.id,type:n.type,actorId:n.actor_id,
      actorUsername:profs?.find(p=>p.id===n.actor_id)?.username||"someone",
      postId:n.post_id,read:n.read,createdAt:n.created_at,
    })));
  }
  useEffect(()=>{ if(session) loadNotifications(); },[session]);

  // ── Load DM conversations (latest message per other user) ──
  async function loadConversations(){
    if(!session?.user)return;
    const me=session.user.id;
    const {data,error}=await supabase.from("messages").select("*")
      .or(`sender_id.eq.${me},recipient_id.eq.${me}`)
      .order("created_at",{ascending:false});
    if(error){console.error("loadConversations error:",error);return;}
    if(!data)return;
    const byUser=new Map();
    for(const m of data){
      const other=m.sender_id===me?m.recipient_id:m.sender_id;
      if(!byUser.has(other)){
        byUser.set(other,{userId:other,lastBody:m.body,lastTime:m.created_at,unread:0});
      }
      if(m.recipient_id===me&&!m.read)byUser.get(other).unread++;
    }
    const ids=[...byUser.keys()];
    const {data:profs}=ids.length?await supabase.from("profiles").select("id,username").in("id",ids):{data:[]};
    setConversations(ids.map(id=>({
      ...byUser.get(id),
      username:profs?.find(p=>p.id===id)?.username||"user",
    })).sort((a,b)=>new Date(b.lastTime)-new Date(a.lastTime)));
  }
  useEffect(()=>{ if(session) loadConversations(); },[session]);

  // ── Realtime: refresh conversations / open thread on new incoming messages ──
  useEffect(()=>{
    if(!session?.user)return;
    const channel=supabase.channel(`messages-${session.user.id}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`recipient_id=eq.${session.user.id}`},payload=>{
        loadConversations();
        setActiveChat(curr=>{
          if(curr&&curr.userId===payload.new.sender_id){
            setChatMessages(prev=>[...prev,payload.new]);
            supabase.from("messages").update({read:true}).eq("id",payload.new.id).then(()=>{});
          }
          return curr;
        });
      })
      .subscribe();
    return()=>{supabase.removeChannel(channel);};
  },[session]);

  // ── Open a chat thread with a user, marking their messages as read ──
  async function openChat(userId,username){
    if(!session?.user)return;
    setActiveChat({userId,username});
    setChatMessages([]);
    const me=session.user.id;
    const {data,error}=await supabase.from("messages").select("*")
      .or(`and(sender_id.eq.${me},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${me})`)
      .order("created_at",{ascending:true});
    if(error){console.error("openChat error:",error);return;}
    setChatMessages(data||[]);
    setDmOpen(true);
    const unreadIds=(data||[]).filter(m=>m.recipient_id===me&&!m.read).map(m=>m.id);
    if(unreadIds.length>0){
      await supabase.from("messages").update({read:true}).in("id",unreadIds);
      setConversations(prev=>prev.map(c=>c.userId===userId?{...c,unread:0}:c));
    }
  }

  // ── Send a DM ──
  async function sendChatMessage(){
    const body=chatText.trim();
    if(!body||!activeChat||!session?.user||sendingChat)return;
    setSendingChat(true);
    setChatText("");
    const row={sender_id:session.user.id,recipient_id:activeChat.userId,body};
    const {data,error}=await supabase.from("messages").insert(row).select().single();
    setSendingChat(false);
    if(error){console.error("sendChatMessage error:",error);showToast("Couldn't send message");return;}
    setChatMessages(prev=>[...prev,data]);
    setConversations(prev=>{
      const existing=prev.find(c=>c.userId===activeChat.userId);
      const updated={userId:activeChat.userId,username:activeChat.username,lastBody:body,lastTime:data.created_at,unread:0};
      const rest=prev.filter(c=>c.userId!==activeChat.userId);
      return [updated,...rest];
    });
  }

  // ── Follow / friend-request / unfollow a user ──
  async function handleFollow(userId,status){
    if(!session?.user||!userId)return;
    if(status==="accepted"){
      setFollows(prev=>prev.filter(id=>id!==userId));
      await supabase.from("follows").delete().eq("follower_id",session.user.id).eq("following_id",userId);
    } else if(status==="pending"){
      setPendingOut(prev=>prev.filter(id=>id!==userId));
      await supabase.from("follows").delete().eq("follower_id",session.user.id).eq("following_id",userId);
    } else {
      setPendingOut(prev=>[...prev,userId]);
      await supabase.from("follows").insert({follower_id:session.user.id,following_id:userId,status:"pending"});
      await supabase.from("notifications").insert({user_id:userId,actor_id:session.user.id,type:"friend_request"});
    }
  }

  // ── Accept / decline incoming friend requests ──
  async function handleAcceptRequest(reqId,requesterId){
    setIncomingRequests(prev=>prev.filter(r=>r.id!==reqId));
    setFollows(prev=>prev.includes(requesterId)?prev:[...prev,requesterId]);
    await supabase.from("follows").update({status:"accepted"}).eq("id",reqId);
    const {data:existing}=await supabase.from("follows").select("id").eq("follower_id",session.user.id).eq("following_id",requesterId).maybeSingle();
    if(existing){
      await supabase.from("follows").update({status:"accepted"}).eq("id",existing.id);
    }else{
      await supabase.from("follows").insert({follower_id:session.user.id,following_id:requesterId,status:"accepted"});
    }
    await supabase.from("notifications").insert({user_id:requesterId,actor_id:session.user.id,type:"friend_accept"});
    showToast("Friend request accepted ✓");
  }
  async function handleDeclineRequest(reqId){
    setIncomingRequests(prev=>prev.filter(r=>r.id!==reqId));
    await supabase.from("follows").delete().eq("id",reqId);
  }

  // ── Mark all notifications as read ──
  async function markNotificationsRead(){
    const unread=notifications.filter(n=>!n.read);
    if(unread.length===0)return;
    setNotifications(prev=>prev.map(n=>({...n,read:true})));
    await supabase.from("notifications").update({read:true}).eq("user_id",session.user.id).eq("read",false);
  }

  function toggleFav(name){setFavBrands(prev=>prev.includes(name)?prev.filter(n=>n!==name):[...prev,name]);}
  // ── Load & save measurements ──
  async function loadMeasurements(){
    if(!session?.user)return;
    const {data,error}=await supabase.from("measurements").select("*").eq("user_id",session.user.id).maybeSingle();
    if(error){console.error("loadMeasurements error:",error);return;}
    if(data)setMeasurements(data);
  }
  useEffect(()=>{if(session) loadMeasurements();},[session]);
  async function handleSaveMeasurements(vals){
    if(!session?.user)return;
    const row={user_id:session.user.id,...vals};
    const {data,error}=await supabase.from("measurements").upsert(row,{onConflict:"user_id"}).select().single();
    if(error){console.error("saveMeasurements error:",error);showToast("Couldn't save — "+error.message);return;}
    setMeasurements(data);
    showToast("Measurements saved ✓");
  }

  function showToast(m){setToast(m);setTimeout(()=>setToast(null),2400);}
  function handleTabChange(id){setTab(id);if(id!=="brands")setSelectedBrand(null);}

  // ── Create a new post in Supabase ──
  async function handlePost(p){
    if(!session?.user)return;
    let photoUrl=null;
    if(p.photoFile){
      const ext=p.photoFile.name.split(".").pop();
      const path=`${session.user.id}/${Date.now()}.${ext}`;
      const {error:uploadError}=await supabase.storage.from("post-photos").upload(path,p.photoFile);
      if(uploadError){
        console.error("photo upload error:",uploadError);
        showToast("Couldn't upload photo — try again");
        return;
      }
      const {data:pub}=supabase.storage.from("post-photos").getPublicUrl(path);
      photoUrl=pub.publicUrl;
    }
    const row={
      user_id:session.user.id,
      username:p.username,
      anonymous:p.anonymous,
      category:p.category,
      from_brand:p.fromBrand,
      from_size:p.fromSize,
      to_brand:p.toBrand,
      to_size:p.toSize,
      fit_note:p.fitNote,
      fit_rating:p.fitRating,
      photo:photoUrl,
      link:p.link,
      link_label:p.linkLabel,
      clicks:0,
      upvotes:0,
    };
    const {data,error}=await supabase.from("posts").insert(row).select().single();
    if(error){showToast("Couldn't share — try again");return;}
    setPosts(prev=>[rowToPost(data),...prev]);
    showToast("Shared ✓");
    setTab("feed");

    const {data:followers}=await supabase.from("follows").select("follower_id").eq("following_id",session.user.id).eq("status","accepted");
    if(followers&&followers.length>0){
      await supabase.from("notifications").insert(followers.map(f=>({user_id:f.follower_id,actor_id:session.user.id,type:"new_post",post_id:data.id})));
    }
  }

  // ── Increment link clicks via the increment_clicks SQL function ──
  async function handleLinkClick(id){
    setPosts(prev=>prev.map(p=>p.id===id?{...p,clicks:p.clicks+1}:p));
    await supabase.rpc("increment_clicks",{post_id:id});
  }

  // ── Increment upvotes via the increment_upvotes SQL function ──
  async function handleUpvote(id){
    setPosts(prev=>prev.map(p=>p.id===id?{...p,upvotes:(p.upvotes||0)+1}:p));
    await supabase.rpc("increment_upvotes",{post_id:id});
  }

  // ── Delete a post (owner only) ──
  async function handleDeletePost(id){
    setPosts(prev=>prev.filter(p=>p.id!==id));
    await supabase.from("posts").delete().eq("id",id);
  }

  // ── Saved sizes: insert/delete in Supabase ──
  async function handleAddSize(s){
    if(!session?.user)return;
    const {data,error}=await supabase.from("saved_sizes")
      .insert({user_id:session.user.id,brand:s.brand,cat:s.cat,size:s.size})
      .select().single();
    if(error){console.error("handleAddSize error:",error);showToast("Couldn't save size — "+error.message);return;}
    setSavedSizes(prev=>[...prev,{id:data.id,brand:data.brand,cat:data.cat,size:data.size}]);
  }
  async function handleRemoveSize(s,i){
    setSavedSizes(prev=>prev.filter((_,j)=>j!==i));
    if(s.id) await supabase.from("saved_sizes").delete().eq("id",s.id);
  }

  async function handleSignOut(){
    await supabase.auth.signOut();
    setTab("feed");
    setSelectedBrand(null);
  }

  const username=profile?.username?(profile.username.startsWith("@")?profile.username:`@${profile.username}`):null;

  const HDR={search:"Size Finder",feed:`${posts.length} Posts`,post:"Share a Fit",brands:selectedBrand?selectedBrand.name:"Brands",profile:"My Profile"};
  const NAV=[
    {id:"search",lbl:"Sizes",icon:Ic.search,special:false},
    {id:"feed",lbl:"Feed",icon:Ic.feed,special:false},
    {id:"post",lbl:"Share",icon:Ic.post,special:true},
    {id:"brands",lbl:"Brands",icon:Ic.brands,special:false},
    {id:"profile",lbl:"Profile",icon:Ic.user,special:false},
  ];

  if(authLoading){
    return(<><G/><div className="auth-wrap"><div className="auth-logo">knop<span style={{color:"var(--sky-deep)"}}>.</span></div></div></>);
  }

  if(passwordRecovery){
    return(<><G/><ResetPasswordPage onDone={()=>{setPasswordRecovery(false);showToast("Password updated ✓");}}/></>);
  }

  if(!session){
    return(<><G/><AuthPage onAuthed={()=>{}}/></>);
  }

  return(
    <>
      <G/>
      <div style={{display:"flex",flexDirection:"column",height:"100dvh",width:"100%",background:"var(--bg)",position:"relative",isolation:"isolate"}}>
        <div className="hdr">
          <div className="logo">knop<span className="logo-dot">.</span></div>
          <div className="hdr-tag">{HDR[tab]}</div>
          <button className="bell-btn" onClick={()=>{setActiveChat(null);setDmOpen(true);}}>
            {Ic.message}
            {conversations.some(c=>c.unread>0)&&<span className="bell-dot"/>}
          </button>
          <button className="bell-btn" onClick={()=>{setNotifPanelOpen(true);markNotificationsRead();}}>
            {Ic.bell}
            {notifications.some(n=>!n.read)&&<span className="bell-dot"/>}
          </button>
        </div>
        {tab==="search"&&<SearchPage savedSizes={savedSizes}/>}
        {tab==="feed"&&<FeedPage posts={posts} onLinkClick={handleLinkClick} onUpvote={handleUpvote} onPhotoClick={setLightboxImg} currentUserId={session?.user?.id} currentUsername={username} follows={follows} pendingOut={pendingOut} onFollow={handleFollow} onOpenChat={openChat} oneWayFollows={oneWayFollows} onToggleFollow={handleToggleFollow} onDelete={handleDeletePost}/>}
        {tab==="post"&&<PostPage onPost={handlePost} defaultUsername={username?username.replace("@",""):""}/>}
        {tab==="brands"&&!selectedBrand&&<BrandsPage posts={posts} onSelectBrand={setSelectedBrand} favBrands={favBrands} onToggleFav={toggleFav}/>}
        {tab==="brands"&&selectedBrand&&<BrandDetailPage brand={selectedBrand} posts={posts} onBack={()=>setSelectedBrand(null)} onLinkClick={handleLinkClick} onUpvote={handleUpvote} onPhotoClick={setLightboxImg} favBrands={favBrands} onToggleFav={toggleFav} currentUserId={session?.user?.id} currentUsername={username} onDelete={handleDeletePost}/>}
        {tab==="profile"&&<ProfilePage posts={posts} savedSizes={savedSizes} onAddSize={handleAddSize} onRemoveSize={handleRemoveSize} username={username} onSignOut={handleSignOut} measurements={measurements} onSaveMeasurements={handleSaveMeasurements} follows={follows} pendingOut={pendingOut} currentUserId={session?.user?.id} onFollow={handleFollow} profile={profile} onSaveProfile={handleSaveProfile} onLinkClick={handleLinkClick} onUpvote={handleUpvote} onPhotoClick={setLightboxImg} onOpenChat={openChat} oneWayFollows={oneWayFollows} onToggleFollow={handleToggleFollow} myFollowers={myFollowers} onDelete={handleDeletePost}/>}
        <nav className="bnav">
          {NAV.map(n=>(
            <button key={n.id} className={`ni${tab===n.id?" on":""}`} onClick={()=>handleTabChange(n.id)}>
              {tab===n.id&&!n.special&&<div className="ni-bar"/>}
              {n.special?<div className="ni-share-btn">{n.icon}</div>:n.icon}
              {!n.special&&<span className="ni-lbl">{n.lbl}</span>}
            </button>
          ))}
        </nav>
        {toast&&<div className="toast">{toast}</div>}
        {lightboxImg&&<div className="lightbox" onClick={()=>setLightboxImg(null)}><img src={lightboxImg} alt="Fit"/></div>}
        {notifPanelOpen&&(
          <div className="notif-overlay" onClick={()=>setNotifPanelOpen(false)}>
            <div className="notif-panel" onClick={e=>e.stopPropagation()}>
              <div className="notif-head">
                <div className="notif-title">Notifications</div>
                <button className="notif-close" onClick={()=>setNotifPanelOpen(false)}>{Ic.x}</button>
              </div>
              <div style={{padding:16}}>
                {incomingRequests.map(r=>(
                  <div key={`req-${r.id}`} className="notif-item unread">
                    <div className="notif-text"><strong>{r.username}</strong> sent you a friend request</div>
                    <div className="notif-actions">
                      <button className="notif-accept" onClick={()=>handleAcceptRequest(r.id,r.userId)}>Accept</button>
                      <button className="notif-decline" onClick={()=>handleDeclineRequest(r.id)}>Decline</button>
                    </div>
                  </div>
                ))}
                {notifications.filter(n=>n.type!=="friend_request").length===0&&incomingRequests.length===0&&(
                  <div style={{fontSize:13,color:"var(--muted)",padding:"8px 0"}}>No notifications yet.</div>
                )}
                {notifications.filter(n=>n.type!=="friend_request").map(n=>(
                  <div key={n.id} className={`notif-item${n.read?"":" unread"}`}>
                    <div className="notif-text">
                      {n.type==="friend_accept"&&<><strong>{n.actorUsername}</strong> accepted your friend request</>}
                      {n.type==="new_post"&&<><strong>{n.actorUsername}</strong> shared a new fit</>}
                      {n.type==="comment"&&<><strong>{n.actorUsername}</strong> commented on your post</>}
                      {n.type==="follow"&&<><strong>{n.actorUsername}</strong> started following you</>}
                      <div className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {dmOpen&&(
          <div className="notif-overlay" onClick={()=>{setDmOpen(false);setActiveChat(null);}}>
            <div className="notif-panel" onClick={e=>e.stopPropagation()}>
              {activeChat?(
                <div className="chat-panel">
                  <div className="notif-head">
                    <button className="notif-close" onClick={()=>setActiveChat(null)} style={{marginRight:10}}>{Ic.back}</button>
                    <div className="notif-title" style={{flex:1}}>{activeChat.username}</div>
                    <button className="notif-close" onClick={()=>{setDmOpen(false);setActiveChat(null);}}>{Ic.x}</button>
                  </div>
                  <div className="chat-msgs">
                    {chatMessages.length===0&&<div className="chat-empty">Say hi 👋</div>}
                    {chatMessages.map(m=>(
                      <div key={m.id} className={`chat-bubble ${m.sender_id===session.user.id?"me":"them"}`}>{m.body}</div>
                    ))}
                  </div>
                  <div className="chat-input-row">
                    <input
                      placeholder="Type a message…"
                      value={chatText}
                      onChange={e=>setChatText(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")sendChatMessage();}}
                    />
                    <button className="chat-send" disabled={!chatText.trim()||sendingChat} onClick={sendChatMessage}>{Ic.send}</button>
                  </div>
                </div>
              ):(
                <>
                  <div className="notif-head">
                    <div className="notif-title">Messages</div>
                    <button className="notif-close" onClick={()=>setDmOpen(false)}>{Ic.x}</button>
                  </div>
                  <div style={{padding:16}}>
                    {conversations.length===0&&(
                      <div style={{fontSize:13,color:"var(--muted)",padding:"8px 0"}}>No messages yet. Visit a friend's profile to start a conversation.</div>
                    )}
                    {conversations.map(c=>{
                      const cc=avc(c.username||"user");
                      const init=(c.username||"?").replace("@","").slice(0,1).toUpperCase();
                      return(
                        <div key={c.userId} className={`conv-item${c.unread>0?" unread":""}`} onClick={()=>openChat(c.userId,c.username)}>
                          <div className="conv-av" style={{background:`${cc}25`,color:cc}}>{init}</div>
                          <div className="conv-info">
                            <div className="conv-name">{c.username}</div>
                            <div className="conv-preview">{c.lastBody}</div>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                            <div className="conv-time">{new Date(c.lastTime).toLocaleDateString()}</div>
                            {c.unread>0&&<div className="conv-unread-dot"/>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
