javascript:(function () {
    "use strict";

    if (document.getElementById("toc-panel") || document.getElementById("toc-handle")) {
        return;
    }
    const css = document.createElement("style");
    css.textContent = `
    #toc-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 280px;
      height: 100%;
      background: #fafafa;
      box-shadow: -4px 0 8px rgba(0,0,0,0.1);
      font-family: sans-serif;
      font-size: 0.8rem;
      border-left: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      z-index: 9998;
      transform: translateX(0);
      transition: transform 0.3s ease;
    }
    #toc-panel.collapsed {
      transform: translateX(280px);
    }
    /* Panel Header */
    #toc-header {
      padding: 6px 10px;
      background: #ddd;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
      flex-shrink: 0;
    }
    /* TOC Items */
    #toc-list {
      list-style: none;
      flex: 1;
      overflow-y: auto;
      margin: 0;
      padding: 6px;
    }
    #toc-list li {
      padding: 4px;
      cursor: pointer;
      border-radius: 3px;
      transition: background-color 0.2s;
    }
    #toc-list li:hover {
      background: #f0f0f0;
    }
    #toc-list ul {
      margin-left: 16px;
      padding: 0;
    }
    #toc-list ul li::before {
      content: "";
    }
    /* Always-visible handle */
    #toc-handle {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 30px;
      height: 80px;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      cursor: pointer;
      font-weight: bold;
      user-select: none;
      z-index: 9999;
      transition: background 0.2s;
    }
    #toc-handle:hover {
      background: #bbb;
    }
    /* Highlighting headings in the chat */
    @keyframes highlightFade {
      0% { background-color: #fffa99; }
      100% { background-color: transparent; }
    }
    .toc-highlight {
      animation: highlightFade 1.5s forwards;
    }
    /* ------ Dark Mode Support ------ */
    @media (prefers-color-scheme: dark) {
      #toc-panel {
        background: #333;
        border-left: 1px solid #555;
        box-shadow: -4px 0 8px rgba(0,0,0,0.7);
      }
      #toc-header {
        background: #555;
        border-bottom: 1px solid #666;
        color: #eee;
      }
      #toc-list li:hover {
        background: #444;
      }
      #toc-list {
        color: #eee;
      }
      #toc-handle {
        background: #555;
        color: #ddd;
      }
      #toc-handle:hover {
        background: #666;
      }
    }
  `;
    document.head.appendChild(css);
    const panel = document.createElement("div");
    panel.id = "toc-panel";
    panel.innerHTML = `<div id="toc-header">Conversation TOC</div><ul id="toc-list"></ul>`;
    document.body.appendChild(panel);

    const handle = document.createElement("div");
    handle.id = "toc-handle";
    handle.textContent = "TOC";
    document.body.appendChild(handle);
    let chatContainer = null;
    let observer = null;
    let isScheduled = false;
    let timerId = null;

    function debounceBuildTOC() {
        if (isScheduled) return;
        isScheduled = true;
        timerId = setTimeout(function () {
            buildTOC();
            isScheduled = false;
        }, 300);
    }

    function buildTOC() {
        const list = document.getElementById("toc-list");
        if (!list) return;
        list.innerHTML = "";

        const articles = (chatContainer || document).querySelectorAll("article[data-testid^='conversation-turn-']");
        if (!articles || articles.length === 0) {
            list.innerHTML = '<li style="opacity:0.7;font-style:italic;">Empty chat</li>';
            return;
        }
        const clses = (chatContainer || document).querySelectorAll("div[class^='whitespace-pre-wrap']");
        console.log(clses.length);
        if (!clses || clses.length === 0) {
            list.innerHTML = '<li style="opacity:0.7;font-style:italic;">Empty chat</li>';
            return;
        }

        for (let i = 0; i < articles.length; i++) {
            const art = articles[i];
            const li = document.createElement("li");
            const sr = art.querySelector("h6.sr-only");

            let isAI = false;
            if (sr && sr.textContent.indexOf("ChatGPT") >= 0) {
                isAI = true;
                li.textContent = "Turn " + (i + 1) + " (AI)";
            } else {
                li.textContent = "Turn " + (i + 1) + " (You): " + (clses[index].textContent.slice(0, 50));
            }

            (function (turnElem) {
                li.addEventListener("click", function () {
                    turnElem.scrollIntoView({behavior: "smooth", block: "start"});
                });
            })(art);

            if (isAI) {
                const subUl = document.createElement("ul");
                const heads = art.querySelectorAll("h3:not(.sr-only)");
                for (let h = 0; h < heads.length; h++) {
                    const hd = heads[h];

                    let skip = false;
                    let p = hd;
                    while (p) {
                        if (p.tagName === "PRE" || p.tagName === "CODE") {
                            skip = true;
                            break;
                        }
                        p = p.parentElement;
                    }
                    if (skip) continue;

                    const subLi = document.createElement("li");
                    const txt = (hd.textContent || "").trim() || ("Section " + (h + 1));
                    subLi.textContent = txt;

                    (function (hdElem) {
                        subLi.addEventListener("click", function (ev) {
                            ev.stopPropagation();
                            hdElem.classList.remove("toc-highlight");

                            hdElem.offsetWidth;
                            hdElem.classList.add("toc-highlight");
                            hdElem.scrollIntoView({behavior: "smooth", block: "start"});
                        });
                    })(hd);

                    subUl.appendChild(subLi);
                }
                if (subUl.children.length > 0) {
                    li.appendChild(subUl);
                }
            }

            list.appendChild(li);
        }
    }

    function attachObserver() {
        const c = document.querySelector("main#main") || document.querySelector(".chat-container") || null;
        if (c !== chatContainer) {
            chatContainer = c;
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            if (chatContainer) {
                observer = new MutationObserver(function () {
                    debounceBuildTOC();
                });
                observer.observe(chatContainer, {childList: true, subtree: true});
                buildTOC();
            }
        }
    }

    attachObserver();
    const reAttachInterval = setInterval(attachObserver, 2000);

    handle.addEventListener("click", function () {
        panel.classList.toggle("collapsed");
    });
})();

/* var d=(r||document).querySelectorAll("div[class*='relative'][class*='group'][class*='flex'][class*='flex-col'][class*='justify-center'][class*='w-full'][class*='max-w-3xl'][class*='md:px-4'][class*='pb-2'][class*='gap-2']");
        console.log(d);*/

/*var t=(r||document).querySelectorAll("span[class^='whitespace-pre-wrap']"); */
/*
          if(f){var v=document.createElement("ul"),p=g.querySelectorAll("h3:not(.sr-only)");
                for(var L=0;L<p.length;L++){
                    var x=p[L],y=false,w=x;
                    while(w){
                        if(w.tagName==="PRE"||w.tagName==="CODE"){
                        y=true;break}w=w.parentElement}
                        if(y)continue;
                    
                    var b=document.createElement("li"),H=(x.textContent||"").trim()||"Section "+(L+1);
                    b.textContent=H;
                    
                    (function(M){
                        b.addEventListener("click",function(A){
                            A.stopPropagation(),M.classList.remove("toc-highlight"),M.offsetWidth,M.classList.add("toc-highlight"),M.scrollIntoView({behavior:"smooth",block:"start"})})})(x),
                            v.appendChild(b)}v.children.length>0&&m.appendChild(v)}s.appendChild(m)
*/

/*, div._4f9bf79._43c05b5 */