javascript:(function(){
    "use strict";
    if(document.getElementById("toc-panel")||document.getElementById("toc-handle"))return;
    var e=document.createElement("style");
    e.textContent="#toc-panel{position:fixed;top:0;right:0;width:280px;height:100%;background:#fafafa;box-shadow:-4px 0 8px rgba(0,0,0,.1);font-family:sans-serif;font-size:.8rem;border-left:1px solid #ddd;display:flex;flex-direction:column;z-index:9998;transform:translateX(0);transition:transform .3s ease}#toc-panel.collapsed{transform:translateX(280px)}#toc-header{padding:6px 10px;background:#ddd;border-bottom:1px solid #ccc;font-weight:bold;flex-shrink:0}#toc-list{list-style:none;flex:1;overflow-y:auto;margin:0;padding:6px}#toc-list li{padding:4px;cursor:pointer;border-radius:3px;transition:background-color .2s}#toc-list li:hover{background:#f0f0f0}#toc-list ul{margin-left:16px;padding:0}#toc-list ul li::before{content:\"\"}#toc-handle{position:fixed;top:50%;right:0;transform:translateY(-50%);width:30px;height:80px;background:#ccc;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;text-orientation:mixed;cursor:pointer;font-weight:bold;user-select:none;z-index:9999;transition:background .2s}#toc-handle:hover{background:#bbb}@keyframes highlightFade{0%{background-color:#fffa99}100%{background-color:transparent}}.toc-highlight{animation:highlightFade 1.5s forwards}@media (prefers-color-scheme:dark){#toc-panel{background:#333;border-left:1px solid #555;box-shadow:-4px 0 8px rgba(0,0,0,.7)}#toc-header{background:#555;border-bottom:1px solid #666;color:#eee}#toc-list li:hover{background:#444}#toc-list{color:#eee}#toc-handle{background:#555;color:#ddd}#toc-handle:hover{background:#666}}",document.head.appendChild(e);
    var t=document.createElement("div");
    t.id="toc-panel",t.innerHTML='<div id="toc-header">TOC GROK</div><ul id="toc-list"></ul>',document.body.appendChild(t);
    var n=document.createElement("div");
    n.id="toc-handle",n.textContent="TOC",document.body.appendChild(n);
    var r=null,o=null,i=false,a=null;
    function c()
    {
        if(i)return;i=true;a=setTimeout(function(){l(),i=false},300)}

    function l(){
        var s=document.getElementById("toc-list");
        if(!s)return;
        s.innerHTML="";
        
        var d=(r||document).querySelectorAll("div[class^='relative group flex flex-col justify-center w-full max-w-3xl md:px-4 pb-2 gap-2 items-']");
        if(!d||d.length===0)
            {s.innerHTML='<li style="opacity:0.7;font-style:italic;">Empty chat</li>';return}
        
        for(var u=0;u<d.length;u++){
            var g=d[u],m=document.createElement("li"),h=g.querySelector("span.whitespace-pre-wrap"),f=false;
            var z=Math.ceil(u/2);

            console.log(g.classList.contains("items-start"));
            console.log(h);
            if(g&&g.classList.contains("items-start")){
                f=true,m.textContent="Turn "+(u+1)+" (AI)"}
            else{
                m.textContent="Turn "+(u+1)+" (You): " + (h.textContent.slice(0,70))}
            
            (function(E){
                m.addEventListener("click",function(){
                    E.scrollIntoView({behavior:"smooth",block:"start"})
                })})(g);

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
        }
    }      
    
    function y(){
        var e=document.querySelector(".\\@container\\/main")||document.querySelector(".\\@container\\/mainview")||null;
        if(e!==r){
            r=e,o&&(o.disconnect(),o=null),r&&(o=new MutationObserver(function(){c()}),o.observe(r,{childList:true,subtree:true}),l())}}y();
            var I=setInterval(y,2e3);n.addEventListener("click",function(){t.classList.toggle("collapsed")});})();