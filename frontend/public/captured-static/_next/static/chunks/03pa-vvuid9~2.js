(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,741759,409631,194406,400150,119187,124608,986768,243639,522770,711808,225496,888351,994641,226376,792369,800319,347177,984853,e=>{"use strict";var t=e.i(991565);e.s(["templateRender",0,function(e,i){return"u"<typeof window&&null!=i?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("template",{shadowrootmode:"open",dangerouslySetInnerHTML:{__html:i}}),e]}):(0,t.jsx)(t.Fragment,{children:e})}],741759);var i=e.i(639363);function n(e){return`annotation-${"side"in e?`${e.side}-`:""}${e.lineNumber}`}e.s(["getLineAnnotationName",0,n],409631);let a={position:"absolute",top:0,bottom:0,textAlign:"center"};e.s(["renderDiffChildren",0,function({fileDiff:e,oldFile:r,newFile:o,renderHeaderMetadata:s,renderAnnotation:l,renderHoverUtility:d,lineAnnotations:f,getHoveredLine:h}){let c=s?.({fileDiff:e,oldFile:r,newFile:o});return(0,t.jsxs)(t.Fragment,{children:[null!=c&&(0,t.jsx)("div",{slot:i.HEADER_METADATA_SLOT_ID,children:c}),null!=l&&f?.map((e,i)=>(0,t.jsx)("div",{slot:n(e),children:l(e)},i)),null!=d&&(0,t.jsx)("div",{slot:"hover-slot",style:a,children:d(h)})]})}],194406);var r=class{pre;selectedRange=null;renderedSelectionRange;anchor;_queuedRender;constructor(e={}){this.options=e}setOptions(e){this.options={...this.options,...e},this.removeEventListeners(),!0===this.options.enableLineSelection&&this.attachEventListeners()}cleanUp(){this.removeEventListeners(),null!=this._queuedRender&&(cancelAnimationFrame(this._queuedRender),this._queuedRender=void 0),null!=this.pre&&delete this.pre.dataset.interactiveLineNumbers,this.pre=void 0}setup(e){this.setDirty(),this.pre!==e&&this.cleanUp(),this.pre=e;let{enableLineSelection:t=!1}=this.options;t?(this.pre.dataset.interactiveLineNumbers="",this.attachEventListeners()):(this.removeEventListeners(),delete this.pre.dataset.interactiveLineNumbers),this.setSelection(this.selectedRange)}setDirty(){this.renderedSelectionRange=void 0}isDirty(){return void 0===this.renderedSelectionRange}setSelection(e){var t,i;let n=!(e===this.selectedRange||(t=e??void 0,i=this.selectedRange??void 0,t?.start===i?.start&&t?.end===i?.end&&t?.side===i?.side&&t?.endSide===i?.endSide));(this.isDirty()||n)&&(this.selectedRange=e,this.renderSelection(),n&&this.notifySelectionChange())}getSelection(){return this.selectedRange}attachEventListeners(){null!=this.pre&&(this.removeEventListeners(),this.pre.addEventListener("pointerdown",this.handleMouseDown))}removeEventListeners(){null!=this.pre&&(this.pre.removeEventListener("pointerdown",this.handleMouseDown),document.removeEventListener("pointermove",this.handleMouseMove),document.removeEventListener("pointerup",this.handleMouseUp))}handleMouseDown=e=>{let t=0===e.button?this.getMouseEventDataForPath(e.composedPath(),"click"):void 0;if(null==t)return;e.preventDefault();let{lineNumber:i,eventSide:n,lineIndex:a}=t;if(e.shiftKey&&null!=this.selectedRange){let e=this.deriveRowRangeFromDOM(this.selectedRange,this.pre?.dataset.type==="split");if(null==e)return;let t=e.start<=e.end?a>=e.start:a<=e.end;this.anchor={line:t?this.selectedRange.start:this.selectedRange.end,side:(t?this.selectedRange.side:this.selectedRange.endSide??this.selectedRange.side)??"additions"},this.updateSelection(i,n),this.notifySelectionStart(this.selectedRange)}else{if(this.selectedRange?.start===i&&this.selectedRange?.end===i){this.updateSelection(null),this.notifySelectionEnd(null),this.notifySelectionChange();return}this.selectedRange=null,this.anchor={line:i,side:n},this.updateSelection(i,n),this.notifySelectionStart(this.selectedRange)}document.addEventListener("pointermove",this.handleMouseMove),document.addEventListener("pointerup",this.handleMouseUp)};handleMouseMove=e=>{let t=this.getMouseEventDataForPath(e.composedPath(),"move");if(null==t||null==this.anchor)return;let{lineNumber:i,eventSide:n}=t;this.updateSelection(i,n)};handleMouseUp=()=>{this.anchor=void 0,document.removeEventListener("pointermove",this.handleMouseMove),document.removeEventListener("pointerup",this.handleMouseUp),this.notifySelectionEnd(this.selectedRange),this.notifySelectionChange()};updateSelection(e,t){if(null==e)this.selectedRange=null;else{let i=this.anchor?.side??t;this.selectedRange={start:this.anchor?.line??e,end:e,side:i,endSide:i!==t?t:void 0}}this._queuedRender??=requestAnimationFrame(this.renderSelection)}renderSelection=()=>{if(null!=this._queuedRender&&(cancelAnimationFrame(this._queuedRender),this._queuedRender=void 0),null==this.pre||this.renderedSelectionRange===this.selectedRange)return;for(let e of this.pre.querySelectorAll("[data-selected-line]"))e.removeAttribute("data-selected-line");if(this.renderedSelectionRange=this.selectedRange,null==this.selectedRange)return;let e=this.pre.querySelectorAll("[data-code]");if(0===e.length)return;if(e.length>2)throw console.error(e),Error("LineSelectionManager.applySelectionToDOM: Somehow there are more than 2 code elements...");let t="split"===this.pre.dataset.type,i=this.deriveRowRangeFromDOM(this.selectedRange,t);if(null==i)throw console.error({rowRange:i,selectedRange:this.selectedRange}),Error("LineSelectionManager.renderSelection: No valid rowRange");let n=i.start===i.end,a=Math.min(i.start,i.end),r=Math.max(i.start,i.end);for(let i of e)for(let e of i.children){if(!(e instanceof HTMLElement))continue;let i=this.getLineIndex(e,t);if((i??0)>r)break;if(null==i||i<a)continue;let o=n?"single":i===a?"first":i===r?"last":"";e.setAttribute("data-selected-line",o),e.nextSibling instanceof HTMLElement&&e.nextSibling.hasAttribute("data-line-annotation")&&(n?(o="last",e.setAttribute("data-selected-line","first")):i===a?o="":i===r&&e.setAttribute("data-selected-line",""),e.nextSibling.setAttribute("data-selected-line",o))}};deriveRowRangeFromDOM(e,t){if(null==e)return;let i=this.findRowIndexForLineNumber(e.start,e.side,t),n=e.end===e.start&&(null==e.endSide||e.endSide===e.side)?i:this.findRowIndexForLineNumber(e.end,e.endSide??e.side,t);return null!=i&&null!=n?{start:i,end:n}:void 0}findRowIndexForLineNumber(e,t="additions",i){if(null==this.pre)return;let n=Array.from(this.pre.querySelectorAll(`[data-line="${e}"]`));if(n.push(...Array.from(this.pre.querySelectorAll(`[data-alt-line="${e}"]`))),0!==n.length){for(let a of n)if(a instanceof HTMLElement){if(this.getLineSideFromElement(a)===t)return this.getLineIndex(a,i);else if(parseInt(a.dataset.altLine??"")===e)return this.getLineIndex(a,i)}console.error("LineSelectionManager.findRowIndexForLineNumber: Invalid selection",e,t)}}notifySelectionChange(){let{onLineSelected:e}=this.options;null!=e&&e(this.selectedRange??null)}notifySelectionStart(e){let{onLineSelectionStart:t}=this.options;null!=t&&t(e)}notifySelectionEnd(e){let{onLineSelectionEnd:t}=this.options;null!=t&&t(e)}getMouseEventDataForPath(e,t){let i,n,a,r=!1;for(let t of e)if(t instanceof HTMLElement){if(t.hasAttribute("data-column-number")){r=!0;continue}if(t.hasAttribute("data-line")){if(i=this.getLineNumber(t),n=this.getLineIndex(t,this.pre?.dataset.type==="split"),"change-deletion"===t.dataset.lineType?a="deletions":"change-additions"===t.dataset.lineType&&(a="additions"),null==n||null==i){n=void 0,i=void 0;break}if(null!=a)break;continue}if(t.hasAttribute("data-code")){a??=t.hasAttribute("data-deletions")?"deletions":"additions";break}}if(("click"!==t||r)&&null!=n&&null!=i)return{lineIndex:n,lineNumber:i,eventSide:a??"additions"}}getLineNumber(e){let t=parseInt(e.dataset.line??"",10);return Number.isNaN(t)?void 0:t}getLineIndex(e,t){let i=(e.dataset.lineIndex??"").split(",").map(e=>parseInt(e)).filter(e=>!Number.isNaN(e));return t&&2===i.length?i[1]:t?void 0:i[0]}getLineSideFromElement(e){if("change-deletion"===e.dataset.lineType)return"deletions";if("change-addition"===e.dataset.lineType)return"additions";let t=e.closest("[data-code]");return t instanceof HTMLElement&&t.hasAttribute("data-deletions")?"deletions":"additions"}};function o(e,t){return null!=e&&("file"===t?"line"===e.type:"diff-line"===e.type)}e.s(["LineSelectionManager",0,r,"pluckLineSelectionOptions",0,function({enableLineSelection:e,onLineSelected:t,onLineSelectionStart:i,onLineSelectionEnd:n}){return{enableLineSelection:e,onLineSelected:t,onLineSelectionStart:i,onLineSelectionEnd:n}}],400150);var s=class{hoveredLine;pre;hoverSlot;constructor(e,t){this.mode=e,this.options=t}setOptions(e){this.options=e}cleanUp(){this.pre?.removeEventListener("click",this.handleMouseClick),this.pre?.removeEventListener("pointermove",this.handleMouseMove),this.pre?.removeEventListener("pointerout",this.handleMouseLeave),delete this.pre?.dataset.interactiveLines,delete this.pre?.dataset.interactiveLineNumbers,this.pre=void 0}setup(e){let{__debugMouseEvents:t,onLineClick:i,onLineNumberClick:n,onLineEnter:a,onLineLeave:r,onHunkExpand:o,enableHoverUtility:s=!1}=this.options;if(this.cleanUp(),this.pre=e,s&&null==this.hoverSlot){this.hoverSlot=document.createElement("div"),this.hoverSlot.dataset.hoverSlot="";let e=document.createElement("slot");e.name="hover-slot",this.hoverSlot.appendChild(e)}else s||null==this.hoverSlot||(this.hoverSlot.parentNode?.removeChild(this.hoverSlot),this.hoverSlot=void 0);if(null!=i||null!=n||null!=o){let a;e.addEventListener("click",this.handleMouseClick),null!=i?e.dataset.interactiveLines="":null!=n&&(e.dataset.interactiveLineNumbers=""),l(t,"click","FileDiff.DEBUG.attachEventListeners: Attaching click events for:",(a=[],("both"===t||"click"===t)&&(null!=i&&a.push("onLineClick"),null!=n&&a.push("onLineNumberClick"),null!=o&&a.push("expandable hunk separators")),a))}(null!=a||null!=r||s)&&(e.addEventListener("pointermove",this.handleMouseMove),l(t,"move","FileDiff.DEBUG.attachEventListeners: Attaching pointer move event"),e.addEventListener("pointerleave",this.handleMouseLeave),l(t,"move","FileDiff.DEBUG.attachEventListeners: Attaching pointer leave event"))}getHoveredLine=()=>{if(null!=this.hoveredLine){if("diff"===this.mode&&"diff-line"===this.hoveredLine.type)return{lineNumber:this.hoveredLine.lineNumber,side:this.hoveredLine.annotationSide};if("file"===this.mode&&"line"===this.hoveredLine.type)return{lineNumber:this.hoveredLine.lineNumber}}};handleMouseClick=e=>{l(this.options.__debugMouseEvents,"click","FileDiff.DEBUG.handleMouseClick:",e),this.handleMouseEvent({eventType:"click",event:e})};handleMouseMove=e=>{l(this.options.__debugMouseEvents,"move","FileDiff.DEBUG.handleMouseMove:",e),this.handleMouseEvent({eventType:"move",event:e})};handleMouseLeave=e=>{let{__debugMouseEvents:t}=this.options;(l(t,"move","FileDiff.DEBUG.handleMouseLeave: no event"),null==this.hoveredLine)?l(t,"move","FileDiff.DEBUG.handleMouseLeave: returned early, no .hoveredLine"):(this.hoverSlot?.parentElement?.removeChild(this.hoverSlot),this.options.onLineLeave?.({...this.hoveredLine,event:e}),this.hoveredLine=void 0)};handleMouseEvent({eventType:e,event:t}){let{__debugMouseEvents:i}=this.options,n=t.composedPath();l(i,e,"FileDiff.DEBUG.handleMouseEvent:",{eventType:e,composedPath:n});let a=this.getLineData(n);l(i,e,"FileDiff.DEBUG.handleMouseEvent: getLineData result:",a);let{onLineClick:r,onLineNumberClick:s,onLineEnter:d,onLineLeave:f,onHunkExpand:h}=this.options;switch(e){case"move":if(o(a,this.mode)&&this.hoveredLine?.lineElement===a.lineElement){l(i,"move","FileDiff.DEBUG.handleMouseEvent: switch, 'move', returned early because same line");break}null!=this.hoveredLine&&(l(i,"move","FileDiff.DEBUG.handleMouseEvent: switch, 'move', clearing an existing hovered line and firing onLineLeave"),this.hoverSlot?.parentElement?.removeChild(this.hoverSlot),f?.({...this.hoveredLine,event:t}),this.hoveredLine=void 0),o(a,this.mode)&&(l(i,"move","FileDiff.DEBUG.handleMouseEvent: switch, 'move', setting up a new hoveredLine and firing onLineEnter"),this.hoveredLine=a,null!=this.hoverSlot&&a.numberElement?.appendChild(this.hoverSlot),d?.({...this.hoveredLine,event:t}));break;case"click":if(l(i,"click","FileDiff.DEBUG.handleMouseEvent: switch, 'click', with data:",a),null==a)break;if(a?.type==="line-info"&&null!=h){l(i,"click","FileDiff.DEBUG.handleMouseEvent: switch, 'click', expanding a hunk"),h(a.hunkIndex,a.direction);break}o(a,this.mode)&&(null!=s&&a.numberColumn?(l(i,"click","FileDiff.DEBUG.handleMouseEvent: switch, 'click', firing 'onLineNumberClick'"),s({...a,event:t})):null!=r?(l(i,"click","FileDiff.DEBUG.handleMouseEvent: switch, 'click', firing 'onLineClick'"),r({...a,event:t})):l(i,"click","FileDiff.DEBUG.handleMouseEvent: switch, 'click', fell through, no event to fire"))}}getLineData(e){let t,i=!1,n=e.find(e=>e instanceof HTMLElement&&(i=i||"columnNumber"in e.dataset,"line"in e.dataset||"expandIndex"in e.dataset));if(!(n instanceof HTMLElement))return;if(null!=n.dataset.expandIndex){let t,i=parseInt(n.dataset.expandIndex);if(isNaN(i))return;for(let i of e)if(i===n||i instanceof HTMLElement&&null!=(t=t??("expandUp"in i.dataset?"up":void 0)??("expandDown"in i.dataset?"down":void 0)??("expandBoth"in i.dataset?"both":void 0)))break;return null!=t?{type:"line-info",hunkIndex:i,direction:t}:void 0}let a=parseInt(n.dataset.line??"");if(isNaN(a))return;let r=n.dataset.lineType;if("context"!==r&&"context-expanded"!==r&&"change-deletion"!==r&&"change-addition"!==r)return;let o=(t=n.children[0])instanceof HTMLElement&&null!=t.dataset.columnNumber?t:void 0;return"file"===this.mode?{type:"line",lineElement:n,lineNumber:a,numberElement:o,numberColumn:i}:{type:"diff-line",annotationSide:(()=>{if("change-deletion"===r)return"deletions";if("change-addition"===r)return"additions";let e=n.closest("[data-code]");return e instanceof HTMLElement&&"deletions"in e.dataset?"deletions":"additions"})(),lineType:r,lineElement:n,numberElement:o,lineNumber:a,numberColumn:i}}};function l(e="none",t,...i){switch(e){case"none":return;case"both":break;case"click":if("click"!==t)return;break;case"move":if("move"!==t)return}console.log(...i)}e.s(["MouseEventManager",0,s,"pluckMouseEventOptions",0,function({onLineClick:e,onLineNumberClick:t,onLineEnter:i,onLineLeave:n,enableHoverUtility:a,__debugMouseEvents:r},o){return{onLineClick:e,onLineNumberClick:t,onLineEnter:i,onLineLeave:n,enableHoverUtility:a,__debugMouseEvents:r,onHunkExpand:o}}],119187);var d=class{observedNodes=new Map;cleanUp(){this.resizeObserver?.disconnect(),this.observedNodes.clear()}resizeObserver;setup(e){this.cleanUp();let t=e.querySelectorAll('[data-line-annotation*=","]');this.resizeObserver??=new ResizeObserver(this.handleResizeObserver);let i=e.querySelectorAll("code");for(let e of i){let t=e.querySelector("[data-column-number]");t instanceof HTMLElement||(t=null);let i={type:"code",codeElement:e,numberElement:t,codeWidth:"auto",numberWidth:0};this.observedNodes.set(e,i),this.resizeObserver.observe(e),null!=t&&(this.observedNodes.set(t,i),this.resizeObserver.observe(t))}if(i.length<=1)return;let n=new Map;for(let e of t){if(!(e instanceof HTMLElement))continue;let{lineAnnotation:t=""}=e.dataset;if(!/^\d+,\d+$/.test(t)){console.error("DiffFileRenderer.setupResizeObserver: Invalid element or annotation",{lineAnnotation:t,element:e});continue}let i=n.get(t);null==i&&(i=[],n.set(t,i)),i.push(e)}for(let[e,t]of n){if(2!==t.length){console.error("DiffFileRenderer.setupResizeObserver: Bad Pair",e,t);continue}let[i,n]=t,a=i.firstElementChild,r=n.firstElementChild;if(!(i instanceof HTMLElement)||!(n instanceof HTMLElement)||!(a instanceof HTMLElement)||!(r instanceof HTMLElement))continue;let o={type:"annotations",column1:{container:i,child:a,childHeight:0},column2:{container:n,child:r,childHeight:0},currentHeight:"auto"};this.observedNodes.set(a,o),this.observedNodes.set(r,o),this.resizeObserver.observe(a),this.resizeObserver.observe(r)}}handleResizeObserver=e=>{for(let t of e){let{target:e,borderBoxSize:i}=t;if(!(e instanceof HTMLElement)){console.error("FileDiff.handleResizeObserver: Invalid element for ResizeObserver",t);continue}let n=this.observedNodes.get(e);if(null==n){console.error("FileDiff.handleResizeObserver: Not a valid observed node",t);continue}let a=i[0];if("annotations"===n.type){let t=e===n.column1.child?n.column1:e===n.column2.child?n.column2:void 0;if(null==t){console.error("FileDiff.handleResizeObserver: Couldn't find a column for",{item:n,target:e});continue}t.childHeight=a.blockSize;let i=Math.max(n.column1.childHeight,n.column2.childHeight);i!==n.currentHeight&&(n.currentHeight=Math.max(i,0),n.column1.container.style.setProperty("--diffs-annotation-min-height",`${n.currentHeight}px`),n.column2.container.style.setProperty("--diffs-annotation-min-height",`${n.currentHeight}px`))}else"code"===n.type&&(e===n.codeElement?a.inlineSize!==n.codeWidth&&(n.codeWidth=a.inlineSize,n.codeElement.style.setProperty("--diffs-column-content-width",`${Math.max(n.codeWidth-n.numberWidth,0)}px`),n.codeElement.style.setProperty("--diffs-column-width",`${n.codeWidth}px`)):e===n.numberElement&&a.inlineSize!==n.numberWidth&&(n.numberWidth=a.inlineSize,n.codeElement.style.setProperty("--diffs-column-number-width",`${n.numberWidth}px`),"auto"!==n.codeWidth&&n.codeElement.style.setProperty("--diffs-column-content-width",`${Math.max(n.codeWidth-n.numberWidth,0)}px`)))}}};e.s(["ResizeManager",0,d],124608);let f=`<svg data-icon-sprite aria-hidden="true" width="0" height="0">
  <symbol id="diffs-icon-arrow-right-short" viewBox="0 0 16 16">
    <path d="M8.47 4.22a.75.75 0 0 0 0 1.06l1.97 1.97H3.75a.75.75 0 0 0 0 1.5h6.69l-1.97 1.97a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0"/>
  </symbol>
  <symbol id="diffs-icon-brand-github" viewBox="0 0 16 16">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8"/>
  </symbol>
  <symbol id="diffs-icon-chevron" viewBox="0 0 16 16">
    <path d="M1.47 4.47a.75.75 0 0 1 1.06 0L8 9.94l5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 0-1.06"/>
  </symbol>
  <symbol id="diffs-icon-chevrons-narrow" viewBox="0 0 10 16">
    <path d="M4.47 2.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1-1.06 1.06L5 3.81 2.28 6.53a.75.75 0 0 1-1.06-1.06zM1.22 9.47a.75.75 0 0 1 1.06 0L5 12.19l2.72-2.72a.75.75 0 0 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 0 1 0-1.06"/>
  </symbol>
  <symbol id="diffs-icon-diff-split" viewBox="0 0 16 16">
    <path d="M14 0H8.5v16H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m-1.5 6.5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0"/><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5.5V0zm.5 7.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1" opacity=".3"/>
  </symbol>
  <symbol id="diffs-icon-diff-unified" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5h16zm-8-4a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1A.5.5 0 0 0 8 10" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14 0a2 2 0 0 1 2 2v5.5H0V2a2 2 0 0 1 2-2zM6.5 3.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" clip-rule="evenodd" opacity=".4"/>
  </symbol>
  <symbol id="diffs-icon-expand" viewBox="0 0 16 16">
    <path d="M3.47 5.47a.75.75 0 0 1 1.06 0L8 8.94l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06"/>
  </symbol>
  <symbol id="diffs-icon-expand-all" viewBox="0 0 16 16">
    <path d="M11.47 9.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L8 12.94zM7.526 1.418a.75.75 0 0 1 1.004.052l4 4a.75.75 0 1 1-1.06 1.06L8 3.06 4.53 6.53a.75.75 0 1 1-1.06-1.06l4-4z"/>
  </symbol>
  <symbol id="diffs-icon-file-code" viewBox="0 0 16 16">
    <path d="M10.75 0c.199 0 .39.08.53.22l3.5 3.5c.14.14.22.331.22.53v9A2.75 2.75 0 0 1 12.25 16h-8.5A2.75 2.75 0 0 1 1 13.25V2.75A2.75 2.75 0 0 1 3.75 0zm-7 1.5c-.69 0-1.25.56-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V5h-1.25A2.25 2.25 0 0 1 10 2.75V1.5z"/><path d="M7.248 6.19a.75.75 0 0 1 .063 1.058L5.753 9l1.558 1.752a.75.75 0 0 1-1.122.996l-2-2.25a.75.75 0 0 1 0-.996l2-2.25a.75.75 0 0 1 1.06-.063M8.69 7.248a.75.75 0 1 1 1.12-.996l2 2.25a.75.75 0 0 1 0 .996l-2 2.25a.75.75 0 1 1-1.12-.996L10.245 9z"/>
  </symbol>
  <symbol id="diffs-icon-symbol-added" viewBox="0 0 16 16">
    <path d="M8 4a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 8 4"/><path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/>
  </symbol>
  <symbol id="diffs-icon-symbol-deleted" viewBox="0 0 16 16">
    <path d="M4 8a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 4 8"/><path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/>
  </symbol>
  <symbol id="diffs-icon-symbol-diffstat" viewBox="0 0 16 16">
    <path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/><path d="M8.75 4.296a.75.75 0 0 0-1.5 0V6.25h-2a.75.75 0 0 0 0 1.5h2v1.5h1.5v-1.5h2a.75.75 0 0 0 0-1.5h-2zM5.25 10a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z"/>
  </symbol>
  <symbol id="diffs-icon-symbol-ignored" viewBox="0 0 16 16">
    <path d="M1.5 8c0 1.613.088 2.806.288 3.704.196.88.478 1.381.802 1.706s.826.607 1.706.802c.898.2 2.091.288 3.704.288s2.806-.088 3.704-.288c.88-.195 1.381-.478 1.706-.802s.607-.826.802-1.706c.2-.898.288-2.091.288-3.704s-.088-2.806-.288-3.704c-.195-.88-.478-1.381-.802-1.706s-.826-.606-1.706-.802C10.806 1.588 9.613 1.5 8 1.5s-2.806.088-3.704.288c-.88.196-1.381.478-1.706.802s-.606.826-.802 1.706C1.588 5.194 1.5 6.387 1.5 8M0 8c0-6.588 1.412-8 8-8s8 1.412 8 8-1.412 8-8 8-8-1.412-8-8m11.53-2.47a.75.75 0 0 0-1.06-1.06l-6 6a.75.75 0 1 0 1.06 1.06z"/>
  </symbol>
  <symbol id="diffs-icon-symbol-modified" viewBox="0 0 16 16">
    <path d="M1.5 8c0 1.613.088 2.806.288 3.704.196.88.478 1.381.802 1.706s.826.607 1.706.802c.898.2 2.091.288 3.704.288s2.806-.088 3.704-.288c.88-.195 1.381-.478 1.706-.802s.607-.826.802-1.706c.2-.898.288-2.091.288-3.704s-.088-2.806-.288-3.704c-.195-.88-.478-1.381-.802-1.706s-.826-.606-1.706-.802C10.806 1.588 9.613 1.5 8 1.5s-2.806.088-3.704.288c-.88.196-1.381.478-1.706.802s-.606.826-.802 1.706C1.588 5.194 1.5 6.387 1.5 8M0 8c0-6.588 1.412-8 8-8s8 1.412 8 8-1.412 8-8 8-8-1.412-8-8m8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
  </symbol>
  <symbol id="diffs-icon-symbol-moved" viewBox="0 0 16 16">
    <path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/><path d="M8.495 4.695a.75.75 0 0 0-.05 1.06L10.486 8l-2.041 2.246a.75.75 0 0 0 1.11 1.008l2.5-2.75a.75.75 0 0 0 0-1.008l-2.5-2.75a.75.75 0 0 0-1.06-.051m-4 0a.75.75 0 0 0-.05 1.06l2.044 2.248-1.796 1.995a.75.75 0 0 0 1.114 1.004l2.25-2.5a.75.75 0 0 0-.002-1.007l-2.5-2.75a.75.75 0 0 0-1.06-.05"/>
  </symbol>
  <symbol id="diffs-icon-symbol-ref" viewBox="0 0 16 16">
    <path d="M1.5 8c0 1.613.088 2.806.288 3.704.196.88.478 1.381.802 1.706.286.286.71.54 1.41.73V1.86c-.7.19-1.124.444-1.41.73-.324.325-.606.826-.802 1.706C1.588 5.194 1.5 6.387 1.5 8m4 6.397c.697.07 1.522.103 2.5.103 1.613 0 2.806-.088 3.704-.288.88-.195 1.381-.478 1.706-.802s.607-.826.802-1.706c.2-.898.288-2.091.288-3.704s-.088-2.806-.288-3.704c-.195-.88-.478-1.381-.802-1.706s-.826-.606-1.706-.802C10.806 1.588 9.613 1.5 8 1.5c-.978 0-1.803.033-2.5.103zM0 8c0-6.588 1.412-8 8-8s8 1.412 8 8-1.412 8-8 8-8-1.412-8-8m7-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/>
  </symbol>
</svg>`;if(e.s(["SVGSpriteSheet",0,f],986768),e.s(["areFilesEqual",0,function(e,t){return e?.cacheKey===t?.cacheKey&&e?.contents===t?.contents&&e?.name===t?.name&&e?.lang===t?.lang}],243639),e.s(["createAnnotationWrapperNode",0,function(e){let t=document.createElement("div");return t.dataset.annotationSlot="",t.slot=e,t.style.whiteSpace="normal",t}],522770),e.s(["createCodeNode",0,function({pre:e,columnType:t}={}){let i=document.createElement("code");return i.dataset.code="",null!=t&&(i.dataset[t]=""),e?.appendChild(i),i}],711808),e.s(["createHoverContentNode",0,function(){let e=document.createElement("div");return e.slot="hover-slot",e.style.position="absolute",e.style.top="0",e.style.bottom="0",e.style.textAlign="center",e.style.whiteSpace="normal",e}],225496),e.s(["createUnsafeCSSStyleNode",0,function(){let e=document.createElement("style");return e.setAttribute(i.UNSAFE_CSS_ATTRIBUTE,""),e}],888351),e.s(["wrapUnsafeCSS",0,function(e){return`@layer base, theme, unsafe;
@layer unsafe {
  ${e}
}`}],994641),e.s(["prerenderHTMLIfNecessary",0,function(e,t){if(null==t)return;let i=e.shadowRoot??e.attachShadow({mode:"open"});""===i.innerHTML&&(i.innerHTML=t)}],226376),e.s(["setPreNodeProperties",0,function({diffIndicators:e,disableBackground:t,disableLineNumbers:i,overflow:n,pre:a,split:r,themeStyles:o,themeType:s,totalLines:l}){switch("system"===s?delete a.dataset.themeType:a.dataset.themeType=s,e){case"bars":case"classic":a.dataset.indicators=e;break;case"none":delete a.dataset.indicators}return i?a.dataset.disableLineNumbers="":delete a.dataset.disableLineNumbers,t?delete a.dataset.background:a.dataset.background="",a.dataset.type=r?"split":"file",a.dataset.overflow=n,a.dataset.diffs="",a.tabIndex=0,a.style=o,a.style.setProperty("--diffs-min-number-column-width-default",`${`${l}`.length}ch`),a}],792369),"u">typeof HTMLElement&&null==customElements.get(i.DIFFS_TAG_NAME)){let e;class t extends HTMLElement{constructor(){if(super(),null!=this.shadowRoot)return;const t=this.attachShadow({mode:"open"});null==e&&(e=new CSSStyleSheet).replaceSync(`@layer base, theme, unsafe;
@layer base {
@layer base, theme, unsafe;

@layer base {
  :host {
    --diffs-bg: #fff;
    --diffs-fg: #000;
    --diffs-font-fallback:
      'SF Mono', Monaco, Consolas, 'Ubuntu Mono', 'Liberation Mono',
      'Courier New', monospace;
    --diffs-header-font-fallback:
      system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue',
      'Noto Sans', 'Liberation Sans', Arial, sans-serif;

    --diffs-mixer: light-dark(black, white);
    --diffs-gap-fallback: 8px;

    /*
    // Available CSS Color Overrides
    --diffs-bg-buffer-override
    --diffs-bg-hover-override
    --diffs-bg-context-override
    --diffs-bg-separator-override

    --diffs-fg-number-override
    --diffs-fg-number-addition-override
    --diffs-fg-number-deletion-override

    --diffs-deletion-color-override
    --diffs-addition-color-override
    --diffs-modified-color-override

    --diffs-bg-deletion-override
    --diffs-bg-deletion-number-override
    --diffs-bg-deletion-hover-override
    --diffs-bg-deletion-emphasis-override

    --diffs-bg-addition-override
    --diffs-bg-addition-number-override
    --diffs-bg-addition-hover-override
    --diffs-bg-addition-emphasis-override

    // Line Selection Color Overrides (for enableLineSelection)
    --diffs-selection-color-override
    --diffs-bg-selection-override
    --diffs-bg-selection-number-override
    --diffs-bg-selection-background-override
    --diffs-bg-selection-number-background-override

    // Available CSS Layout Overrides
    --diffs-gap-inline
    --diffs-gap-block
    --diffs-gap-style
    --diffs-tab-size
  */

    color-scheme: light dark;
    display: block;
    font-family: var(
      --diffs-header-font-family,
      var(--diffs-header-font-fallback)
    );
    font-size: var(--diffs-font-size, 13px);
    line-height: var(--diffs-line-height, 20px);
    font-feature-settings: var(--diffs-font-features);
  }

  /* NOTE(mdo): Some semantic HTML elements (e.g. \`pre\`, \`code\`) have default
 * user-agent styles. These must be overridden to use our custom styles. */
  pre,
  code,
  [data-error-wrapper] {
    margin: 0;
    padding: 0;
    display: block;
    outline: none;
    font-family: var(--diffs-font-family, var(--diffs-font-fallback));
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  [data-icon-sprite] {
    display: none;
  }

  /* NOTE(mdo): Headers and separators are within pre/code, so we need to reset
 * their font-family explicitly. */
  [data-diffs-header],
  [data-separator] {
    font-family: var(
      --diffs-header-font-family,
      var(--diffs-header-font-fallback)
    );
  }

  [data-file-info] {
    padding: 10px;
    font-weight: 700;
    color: var(--fg);
    /* NOTE(amadeus): we cannot use 'in oklch' because current versions of cursor
   * and vscode use an older build of chrome that appears to have a bug with
   * color-mix and 'in oklch', so use 'in lab' instead */
    background-color: color-mix(in lab, var(--bg) 98%, var(--fg));
    border-block: 1px solid color-mix(in lab, var(--bg) 95%, var(--fg));
  }

  [data-diffs-header],
  [data-diffs],
  [data-error-wrapper] {
    --diffs-bg: light-dark(var(--diffs-light-bg), var(--diffs-dark-bg));
    /* NOTE(amadeus): we cannot use 'in oklch' because current versions of cursor
   * and vscode use an older build of chrome that appears to have a bug with
   * color-mix and 'in oklch', so use 'in lab' instead */
    --diffs-bg-buffer: var(
      --diffs-bg-buffer-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 92%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 92%, var(--diffs-mixer))
      )
    );
    --diffs-bg-hover: var(
      --diffs-bg-hover-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 97%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 91%, var(--diffs-mixer))
      )
    );
    --diffs-bg-context: var(
      --diffs-bg-context-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 98.5%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 92.5%, var(--diffs-mixer))
      )
    );
    --diffs-bg-separator: var(
      --diffs-bg-separator-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 96%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 85%, var(--diffs-mixer))
      )
    );

    --diffs-fg: light-dark(var(--diffs-light), var(--diffs-dark));
    --diffs-fg-number: var(
      --diffs-fg-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-fg) 65%, var(--diffs-bg)),
        color-mix(in lab, var(--diffs-fg) 65%, var(--diffs-bg))
      )
    );

    --diffs-deletion-base: var(
      --diffs-deletion-color-override,
      light-dark(
        var(
          --diffs-light-deletion-color,
          var(--diffs-deletion-color, rgb(255, 0, 0))
        ),
        var(
          --diffs-dark-deletion-color,
          var(--diffs-deletion-color, rgb(255, 0, 0))
        )
      )
    );
    --diffs-addition-base: var(
      --diffs-addition-color-override,
      light-dark(
        var(
          --diffs-light-addition-color,
          var(--diffs-addition-color, rgb(0, 255, 0))
        ),
        var(
          --diffs-dark-addition-color,
          var(--diffs-addition-color, rgb(0, 255, 0))
        )
      )
    );
    --diffs-modified-base: var(
      --diffs-modified-color-override,
      light-dark(
        var(
          --diffs-light-modified-color,
          var(--diffs-modified-color, rgb(0, 0, 255))
        ),
        var(
          --diffs-dark-modified-color,
          var(--diffs-modified-color, rgb(0, 0, 255))
        )
      )
    );

    /* NOTE(amadeus): we cannot use 'in oklch' because current versions of cursor
   * and vscode use an older build of chrome that appears to have a bug with
   * color-mix and 'in oklch', so use 'in lab' instead */
    --diffs-bg-deletion: var(
      --diffs-bg-deletion-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 88%, var(--diffs-deletion-base)),
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-deletion-base))
      )
    );
    --diffs-bg-deletion-number: var(
      --diffs-bg-deletion-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 91%, var(--diffs-deletion-base)),
        color-mix(in lab, var(--diffs-bg) 85%, var(--diffs-deletion-base))
      )
    );
    --diffs-bg-deletion-hover: var(
      --diffs-bg-deletion-hover-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-deletion-base)),
        color-mix(in lab, var(--diffs-bg) 75%, var(--diffs-deletion-base))
      )
    );
    --diffs-bg-deletion-emphasis: var(
      --diffs-bg-deletion-emphasis-override,
      light-dark(
        rgb(from var(--diffs-deletion-base) r g b / 0.15),
        rgb(from var(--diffs-deletion-base) r g b / 0.2)
      )
    );

    --diffs-bg-addition: var(
      --diffs-bg-addition-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 88%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-addition-base))
      )
    );
    --diffs-bg-addition-number: var(
      --diffs-bg-addition-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 91%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 85%, var(--diffs-addition-base))
      )
    );
    --diffs-bg-addition-hover: var(
      --diffs-bg-addition-hover-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 70%, var(--diffs-addition-base))
      )
    );
    --diffs-bg-addition-emphasis: var(
      --diffs-bg-addition-emphasis-override,
      light-dark(
        rgb(from var(--diffs-addition-base) r g b / 0.15),
        rgb(from var(--diffs-addition-base) r g b / 0.2)
      )
    );

    --diffs-selection-base: var(--diffs-modified-base);
    --diffs-selection-number-fg: light-dark(
      color-mix(in lab, var(--diffs-selection-base) 65%, var(--diffs-mixer)),
      color-mix(in lab, var(--diffs-selection-base) 75%, var(--diffs-mixer))
    );
    --diffs-bg-selection: var(
      --diffs-bg-selection-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 82%, var(--diffs-selection-base)),
        color-mix(in lab, var(--diffs-bg) 75%, var(--diffs-selection-base))
      )
    );
    --diffs-bg-selection-number: var(
      --diffs-bg-selection-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 75%, var(--diffs-selection-base)),
        color-mix(in lab, var(--diffs-bg) 60%, var(--diffs-selection-base))
      )
    );

    background-color: var(--diffs-bg);
    color: var(--diffs-fg);
  }

  [data-diffs] {
    --diffs-code-grid: minmax(min-content, max-content) 1fr;

    [data-column-content] span {
      color: light-dark(var(--diffs-light), var(--diffs-dark));
      font-weight: var(--diffs-light-font-weight);
      font-style: var(--diffs-light-font-style);
    }
  }

  [data-column-content] {
    background-color: var(--diffs-line-bg, 'transparent');
    grid-column: 2 / 3;
  }

  [data-diffs][data-dehydrated] {
    --diffs-code-grid: minmax(min-content, max-content) minmax(0, 1fr);
  }

  @media (prefers-color-scheme: dark) {
    [data-diffs-header],
    [data-diffs] {
      color-scheme: dark;
    }

    [data-diffs] [data-column-content] span {
      font-weight: var(--diffs-dark-font-weight);
      font-style: var(--diffs-dark-font-style);
    }
  }

  [data-diffs-header][data-theme-type='light'],
  [data-diffs][data-theme-type='light'] {
    color-scheme: light;
  }

  [data-diffs][data-theme-type='light'] [data-column-content] span {
    font-weight: var(--diffs-light-font-weight);
    font-style: var(--diffs-light-font-style);
  }

  [data-diffs-header][data-theme-type='dark'],
  [data-diffs][data-theme-type='dark'] {
    color-scheme: dark;
  }

  [data-diffs][data-theme-type='dark'] [data-column-content] span {
    font-weight: var(--diffs-dark-font-weight);
    font-style: var(--diffs-dark-font-style);
  }

  [data-type='split'][data-overflow='wrap'] {
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: repeat(2, var(--diffs-code-grid));
  }

  [data-type='split'][data-overflow='scroll'] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }

  [data-code] {
    display: block;
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: var(--diffs-code-grid);
    overflow: scroll clip;
    overscroll-behavior-x: none;
    tab-size: var(--diffs-tab-size, 2);
    align-self: flex-start;
    padding-top: var(--diffs-gap-block, var(--diffs-gap-fallback));
    padding-bottom: max(
      0px,
      calc(var(--diffs-gap-block, var(--diffs-gap-fallback)) - 6px)
    );
  }

  [data-code]::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }

  [data-code]::-webkit-scrollbar-track {
    background: transparent;
  }

  [data-code]::-webkit-scrollbar-thumb {
    background-color: transparent;
    border: 1px solid transparent;
    background-clip: content-box;
    border-radius: 3px;
  }

  [data-diffs]:hover [data-code]::-webkit-scrollbar-thumb {
    background-color: var(--diffs-bg-context);
  }

  [data-code]::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  /*
   * If we apply these rules globally it will mean that webkit will opt into the
   * standards compliant version of custom css scrollbars, which we do not want
   * because the custom stuff will look better
  */
  @supports (-moz-appearance: none) {
    [data-code] {
      scrollbar-width: thin;
      scrollbar-color: var(--diffs-bg-context) transparent;
      padding-bottom: var(--diffs-gap-block, var(--diffs-gap-fallback));
    }
  }

  [data-diffs][data-type='split'][data-overflow='wrap'] {
    padding-block: var(--diffs-gap-block, var(--diffs-gap-fallback));
  }

  [data-diffs-header] ~ [data-diffs] [data-code],
  [data-diffs-header] ~ [data-diffs][data-overflow='wrap'] {
    padding-top: 0;
  }

  [data-type='split'][data-overflow='wrap'] [data-code] {
    display: contents;
  }

  [data-line-annotation],
  [data-no-newline],
  [data-line] {
    position: relative;
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / 3;
  }

  [data-line-annotation][data-selected-line] {
    background-color: unset;

    &::before {
      content: '';
      position: sticky;
      top: 0;
      left: 0;
      display: block;
      border-right: var(--diffs-gap-style, 1px solid var(--diffs-bg));
      background-color: var(--diffs-bg-selection-number);
    }

    [data-annotation-content] {
      background-color: var(--diffs-bg-selection);
    }
  }

  [data-interactive-lines] [data-line] {
    cursor: pointer;
  }

  [data-buffer] {
    position: sticky;
    left: 0;
    grid-column: 1 / 3;
    -webkit-user-select: none;
            user-select: none;
    /* We multiply by 1.414 (√2) to better approximate the diagonal repeat distance */
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent calc(3px * 1.414),
      var(--diffs-bg-buffer) calc(3px * 1.414),
      var(--diffs-bg-buffer) calc(4px * 1.414)
    );
    min-height: 1lh;
    width: var(--diffs-column-width, auto);
  }

  [data-separator] {
    grid-column: span 2;
  }

  [data-separator='metadata'],
  [data-separator]:empty {
    min-height: 4px;
    background-color: var(--diffs-bg-separator);
    display: grid;
    grid-template-columns: subgrid;
  }

  [data-separator-wrapper] {
    -webkit-user-select: none;
            user-select: none;
    fill: currentColor;
    overflow: hidden;
  }

  [data-separator='metadata'] [data-separator-wrapper] {
    grid-column: 2 / 3;
    width: var(--diffs-column-content-width);
    position: sticky;
    left: var(--diffs-column-number-width);
    padding: 4px 1ch;
  }

  [data-separator='line-info'] {
    margin-block: var(--diffs-gap-block, var(--diffs-gap-fallback));
  }

  [data-separator='line-info'][data-separator-first] {
    margin-top: 0;
  }

  [data-separator='line-info'][data-separator-last] {
    margin-bottom: 0;
  }

  [data-separator='line-info'] [data-separator-wrapper] {
    position: sticky;
    display: flex;
    align-items: center;
    gap: 2px;
    width: auto;
    width: calc(var(--diffs-column-width) - var(--diffs-gap-fallback));
    border-radius: 6px;
  }

  @media (pointer: fine) {
    [data-separator-wrapper][data-separator-multi-button] {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-rows: 15px 15px;

      [data-expand-button] {
        height: 15px;
      }
    }

    [data-type='split']
      [data-additions]
      [data-separator-wrapper][data-separator-multi-button] {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    [data-type='split'] [data-additions] [data-expand-button] {
      grid-column: 2;
    }

    [data-type='split'] [data-additions] [data-separator-content] {
      grid-column: 1;
    }
  }

  [data-expand-button],
  [data-separator-content] {
    display: flex;
    align-items: center;
    background-color: var(--diffs-bg-separator);
  }

  [data-expand-button] {
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    width: 32px;
    height: 32px;
    opacity: 0.65;
  }

  [data-hover-slot] {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
  }

  @media (pointer: fine) {
    [data-expand-button]:hover {
      opacity: 1;
    }

    [data-line]:hover {
      z-index: 2;
    }
  }

  [data-expand-up] [data-icon] {
    transform: scaleY(-1);
  }

  [data-separator-content] {
    flex: 1 1 auto;
    padding: 0 1ch;
    height: 32px;
    opacity: 0.65;
    overflow: hidden;
    justify-content: flex-start;

    grid-column: 2;
    grid-row: 1 / -1;
  }

  [data-unmodified-lines] {
    display: block;
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 0 1 auto;
  }

  [data-type='split'] [data-additions] [data-separator-content] {
    justify-content: flex-end;
  }

  [data-type='file']
    [data-code]
    [data-separator='line-info']
    [data-separator-wrapper] {
    left: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    margin-left: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    margin-right: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    width: calc(
      var(--diffs-column-width) -
        (var(--diffs-gap-inline, var(--diffs-gap-fallback)) * 2)
    );
  }

  [data-type='split']
    [data-deletions]
    [data-separator='line-info']
    [data-separator-wrapper] {
    left: var(--diffs-gap-fallback);
    margin-left: var(--diffs-gap-fallback);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  [data-type='split']
    [data-additions]
    [data-separator='line-info']
    [data-separator-wrapper] {
    left: 0;
    margin-right: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    flex-direction: row-reverse;
  }

  [data-line] {
    background-color: var(--diffs-bg);
    color: var(--diffs-fg);
  }

  [data-type='split'][data-overflow='wrap'] [data-deletions] {
    [data-line-annotation],
    [data-buffer],
    [data-line],
    [data-separator] {
      grid-column: 1 / 3;
    }
  }

  [data-line-annotation] {
    min-height: var(--diffs-annotation-min-height, 0);
    background-color: var(--diffs-bg-context);
    z-index: 3;
  }

  [data-type='split'][data-overflow='wrap'] [data-additions] {
    [data-line-annotation],
    [data-buffer],
    [data-line],
    [data-separator] {
      margin-left: 2px;
      grid-column: 3 / 5;
    }
  }

  [data-separator='custom'] {
    display: grid;
    grid-template-columns: subgrid;
  }

  [data-column-content],
  [data-column-number] {
    position: relative;
    padding-inline: 1ch;
  }

  [data-indicators='classic'] [data-column-content] {
    padding-inline-start: 2ch;
  }

  [data-indicators='classic'] {
    [data-line-type='change-addition'] [data-column-content]::before,
    [data-line-type='change-deletion'] [data-column-content]::before {
      display: inline-block;
      width: 1ch;
      height: 1lh;
      position: absolute;
      top: 0;
      left: 0;
      -webkit-user-select: none;
              user-select: none;
    }

    [data-line-type='change-addition'] [data-column-content]::before {
      content: '+';
      color: var(--diffs-addition-base);
    }

    [data-line-type='change-deletion'] [data-column-content]::before {
      content: '-';
      color: var(--diffs-deletion-base);
    }
  }

  [data-indicators='bars'] {
    [data-line-type='change-deletion'] [data-column-number]::before,
    [data-line-type='change-addition'] [data-column-number]::before {
      content: '';
      display: block;
      width: 4px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      -webkit-user-select: none;
              user-select: none;
    }

    [data-line-type='change-deletion'] [data-column-number]::before {
      background-image: linear-gradient(
        0deg,
        var(--diffs-bg-deletion) 50%,
        var(--diffs-deletion-base) 50%
      );
      background-repeat: repeat;
      background-size: 2px 2px;
      background-size: calc(1lh / round(1lh / 2px)) calc(1lh / round(1lh / 2px));
    }

    [data-line-type='change-addition'] [data-column-number]::before {
      background-color: var(--diffs-addition-base);
    }
  }

  [data-overflow='wrap'] [data-column-content],
  [data-overflow='wrap'] [data-annotation-content] {
    white-space: pre-wrap;
    word-break: break-word;
  }

  [data-overflow='scroll'] [data-column-content] {
    white-space: pre;
    min-height: 1lh;
  }

  [data-column-number] {
    grid-column: 1 / 2;
    box-sizing: content-box;
    text-align: right;
    position: sticky;
    left: 0;
    -webkit-user-select: none;
            user-select: none;
    background-color: var(--diffs-bg);
    color: var(--diffs-fg-number);
    z-index: 1;
    min-width: var(
      --diffs-min-number-column-width,
      var(--diffs-min-number-column-width-default, 3ch)
    );
    padding-left: 2ch;
    border-right: var(--diffs-gap-style, 1px solid var(--diffs-bg));
  }

  [data-disable-line-numbers] {
    &[data-indicators='bars'] [data-column-number] {
      min-width: 4px;
      border-right: var(--diffs-gap-style, 1px solid var(--diffs-bg));
    }

    [data-column-number] {
      border-right: none;
      min-width: 0;
      padding: 0;
    }

    [data-line-number-content] {
      display: none;
    }

    [data-hover-slot] {
      right: unset;
      left: 0;
      justify-content: flex-start;
    }

    &[data-indicators='bars'] [data-hover-slot] {
      /* Using 5px here because theres a 1px separator after the bar */
      left: 5px;
    }
  }

  [data-interactive-line-numbers] [data-column-number] {
    cursor: pointer;
  }

  [data-diff-span] {
    border-radius: 3px;
    -webkit-box-decoration-break: clone;
            box-decoration-break: clone;
  }

  [data-line-type='change-addition'] {
    [data-column-number] {
      color: var(
        --diffs-fg-number-addition-override,
        var(--diffs-addition-base)
      );
    }

    [data-diff-span] {
      background-color: var(--diffs-bg-addition-emphasis);
    }
  }

  [data-line-type='change-deletion'] {
    [data-column-number] {
      color: var(
        --diffs-fg-number-deletion-override,
        var(--diffs-deletion-base)
      );
    }

    [data-diff-span] {
      background-color: var(--diffs-bg-deletion-emphasis);
    }
  }

  [data-background] [data-line-type='change-addition'] {
    --diffs-line-bg: var(--diffs-bg-addition);

    [data-column-number] {
      background-color: var(--diffs-bg-addition-number);
    }
  }

  [data-background] [data-line-type='change-deletion'] {
    --diffs-line-bg: var(--diffs-bg-deletion);

    [data-column-number] {
      background-color: var(--diffs-bg-deletion-number);
    }
  }

  [data-line-type='context-expanded'] {
    --diffs-line-bg: var(--diffs-bg-context);

    [data-column-number] {
      background-color: var(--diffs-bg-context);
    }
  }

  /* By wrapping hovers in a pointer: fine, we ensure that mobile devices don't
*  require a double click */
  @media (pointer: fine) {
    [data-line]:hover:not([data-selected-line]) {
      [data-column-number],
      [data-column-content] {
        background-color: var(--diffs-bg-hover);
      }
    }

    [data-background] [data-line]:hover:not([data-selected-line]) {
      &[data-line-type='change-deletion'] [data-column-number],
      &[data-line-type='change-deletion'] [data-column-content] {
        background-color: var(--diffs-bg-deletion-hover);
      }

      &[data-line-type='change-addition'] [data-column-number],
      &[data-line-type='change-addition'] [data-column-content] {
        background-color: var(--diffs-bg-addition-hover);
      }
    }
  }

  [data-diffs-header] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    min-height: calc(
      1lh + (var(--diffs-gap-block, var(--diffs-gap-fallback)) * 3)
    );
    padding-inline: 16px;
  }

  [data-header-content] {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    min-width: 0;
    white-space: nowrap;
  }

  [data-header-content] [data-prev-name],
  [data-header-content] [data-title] {
    direction: rtl;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    white-space: nowrap;
  }

  [data-prev-name] {
    opacity: 0.7;
  }

  [data-rename-icon] {
    fill: currentColor;
    flex-shrink: 0;
    flex-grow: 0;
  }

  [data-diffs-header] [data-metadata] {
    display: flex;
    align-items: center;
    gap: 1ch;
    white-space: nowrap;
  }

  [data-diffs-header] [data-additions-count] {
    font-family: var(--diffs-font-family, var(--diffs-font-fallback));
    color: var(--diffs-addition-base);
  }

  [data-diffs-header] [data-deletions-count] {
    font-family: var(--diffs-font-family, var(--diffs-font-fallback));
    color: var(--diffs-deletion-base);
  }

  [data-no-newline] {
    -webkit-user-select: none;
            user-select: none;

    [data-column-content] {
      opacity: 0.6;
    }
  }

  [data-annotation-content] {
    position: sticky;
    left: var(--diffs-column-number-width, 0);
    grid-column: 2 / -1;
    width: var(--diffs-column-content-width, auto);
    align-self: flex-start;
    z-index: 2;
    height: 100%;
  }

  /* Undo some of the stuff that the 'pre' tag does */
  [data-annotation-slot] {
    text-wrap-mode: wrap;
    word-break: normal;
    white-space-collapse: collapse;
  }

  [data-change-icon] {
    fill: currentColor;
    flex-shrink: 0;
  }

  [data-change-icon='change'],
  [data-change-icon='rename-pure'],
  [data-change-icon='rename-changed'] {
    color: var(--diffs-modified-base);
  }

  [data-change-icon='new'] {
    color: var(--diffs-addition-base);
  }

  [data-change-icon='deleted'] {
    color: var(--diffs-deletion-base);
  }

  [data-change-icon='file'] {
    opacity: 0.6;
  }

  /* Line selection highlighting */
  [data-line-type='context'][data-selected-line] {
    [data-column-number] {
      color: var(--diffs-selection-number-fg);
      background-color: var(--diffs-bg-selection-number);
    }

    [data-column-content] {
      background-color: var(--diffs-bg-selection);
    }
  }

  [data-line-type='context-expanded'],
  [data-line-type='change-addition'],
  [data-line-type='change-deletion'] {
    &[data-selected-line] {
      [data-column-content] {
        background-color: light-dark(
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 82%,
            var(--diffs-selection-base)
          ),
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 75%,
            var(--diffs-selection-base)
          )
        );
      }

      [data-column-number] {
        color: var(--diffs-selection-number-fg);
        background-color: light-dark(
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 75%,
            var(--diffs-selection-base)
          ),
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 60%,
            var(--diffs-selection-base)
          )
        );
      }
    }
  }

  [data-error-wrapper] {
    overflow: auto;
    padding: var(--diffs-gap-block, var(--diffs-gap-fallback))
      var(--diffs-gap-inline, var(--diffs-gap-fallback));
    max-height: 400px;
    scrollbar-width: none;

    [data-error-message] {
      font-weight: bold;
      font-size: 18px;
      color: var(--diffs-deletion-base);
    }

    [data-error-stack] {
      color: var(--diffs-fg-number);
    }
  }
}

}`),t.adoptedStyleSheets=[e]}}customElements.define(i.DIFFS_TAG_NAME,t)}e.s(["DiffsContainerLoaded",0,!0],800319);var h=class{isDeletionsScrolling=!1;isAdditionsScrolling=!1;timeoutId=-1;codeDeletions;codeAdditions;cleanUp(){this.codeDeletions?.removeEventListener("scroll",this.handleDeletionsScroll),this.codeAdditions?.removeEventListener("scroll",this.handleAdditionsScroll),clearTimeout(this.timeoutId),this.codeDeletions=void 0,this.codeAdditions=void 0}setup(e,t,i){if(null==t||null==i)for(let n of e.children??[])n instanceof HTMLElement&&("deletions"in n.dataset?t=n:"additions"in n.dataset&&(i=n));null==i||null==t?this.cleanUp():(this.codeDeletions?.removeEventListener("scroll",this.handleDeletionsScroll),this.codeAdditions?.removeEventListener("scroll",this.handleAdditionsScroll),this.codeDeletions=t,this.codeAdditions=i,t.addEventListener("scroll",this.handleDeletionsScroll,{passive:!0}),i.addEventListener("scroll",this.handleAdditionsScroll,{passive:!0}))}handleDeletionsScroll=()=>{this.isAdditionsScrolling||(this.isDeletionsScrolling=!0,clearTimeout(this.timeoutId),this.timeoutId=setTimeout(()=>{this.isDeletionsScrolling=!1},300),this.codeAdditions?.scrollTo({left:this.codeDeletions?.scrollLeft}))};handleAdditionsScroll=()=>{this.isDeletionsScrolling||(this.isAdditionsScrolling=!0,clearTimeout(this.timeoutId),this.timeoutId=setTimeout(()=>{this.isAdditionsScrolling=!1},300),this.codeDeletions?.scrollTo({left:this.codeAdditions?.scrollLeft}))}};e.s(["ScrollSyncManager",0,h],347177);var c=e.i(187552);function u(e){for(let t of Array.isArray(e)?e:[e])if(!c.AttachedLanguages.has(t))return!1;return!0}var p=e.i(501101),m=e.i(699197),g=e.i(759571);function v(e){for(let t of(0,g.getThemes)(e))if(!m.AttachedThemes.has(t))return!1;return!0}var b=e.i(221063),y=e.i(430103);function x(e){return(0,y.createHastElement)({tagName:"div",children:[(0,y.createHastElement)({tagName:"div",children:e.annotations?.map(e=>(0,y.createHastElement)({tagName:"slot",properties:{name:e}})),properties:{"data-annotation-content":""}})],properties:{"data-line-annotation":`${e.hunkIndex},${e.lineIndex}`}})}var k=e.i(212070);function w(e){return(0,y.createHastElement)({tagName:"div",properties:{"data-buffer":"",style:`grid-row: span ${e};min-height:calc(${e} * 1lh)`}})}function E(e){return(0,y.createHastElement)({tagName:"div",children:[(0,y.createHastElement)({tagName:"span",properties:{"data-column-number":""}}),(0,y.createHastElement)({tagName:"span",children:[(0,y.createTextNodeElement)("No newline at end of file")],properties:{"data-column-content":""}})],properties:{"data-no-newline":"","data-line-type":e}})}function L(e){return(0,y.createHastElement)({tagName:"div",children:[(0,y.createIconElement)({name:"both"===e?"diffs-icon-expand-all":"diffs-icon-expand",properties:{"data-icon":""}})],properties:{"data-expand-button":"","data-expand-both":"both"===e?"":void 0,"data-expand-up":"up"===e?"":void 0,"data-expand-down":"down"===e?"":void 0}})}function S({type:e,content:t,expandIndex:i,chunked:n=!1,slotName:a,isFirstHunk:r,isLastHunk:o}){let s=[];if("metadata"===e&&null!=t&&s.push((0,y.createHastElement)({tagName:"div",children:[(0,y.createTextNodeElement)(t)],properties:{"data-separator-wrapper":""}})),"line-info"===e&&null!=t){let e=[];null!=i&&(n?(r||e.push(L("up")),o||e.push(L("down"))):e.push(L(r||o?r?"down":"up":"both"))),e.push((0,y.createHastElement)({tagName:"div",children:[(0,y.createHastElement)({tagName:"span",children:[(0,y.createTextNodeElement)(t)],properties:{"data-unmodified-lines":""}})],properties:{"data-separator-content":""}})),s.push((0,y.createHastElement)({tagName:"div",children:e,properties:{"data-separator-wrapper":"","data-separator-multi-button":e.length>2?"":void 0}}))}return"custom"===e&&null!=a&&s.push((0,y.createHastElement)({tagName:"slot",properties:{name:a}})),(0,y.createHastElement)({tagName:"div",children:s,properties:{"data-separator":0===s.length?"":e,"data-expand-index":i,"data-separator-first":r?"":void 0,"data-separator-last":o?"":void 0}})}var M=e.i(801179),C=e.i(790070);let T={fromStart:0,fromEnd:0};var N=class{highlighter;diff;expandedHunks=new Map;deletionAnnotations={};additionAnnotations={};computedLang="text";renderCache;constructor(e={theme:i.DEFAULT_THEMES},t,n){this.options=e,this.onRenderUpdate=t,this.workerManager=n,n?.isWorkingPool()!==!0&&(this.highlighter=v(e.theme??i.DEFAULT_THEMES)?(0,p.getHighlighterIfLoaded)():void 0)}cleanUp(){this.highlighter=void 0,this.diff=void 0,this.renderCache=void 0,this.workerManager=void 0,this.onRenderUpdate=void 0}setOptions(e){this.options=e}mergeOptions(e){this.options={...this.options,...e}}setThemeType(e){this.getOptionsWithDefaults().themeType!==e&&this.mergeOptions({themeType:e})}expandHunk(e,t){let{expansionLineCount:i}=this.getOptionsWithDefaults(),n=this.expandedHunks.get(e)??{fromStart:0,fromEnd:0};("up"===t||"both"===t)&&(n.fromStart+=i),("down"===t||"both"===t)&&(n.fromEnd+=i),this.expandedHunks.set(e,n)}setLineAnnotations(e){for(let t of(this.additionAnnotations={},this.deletionAnnotations={},e)){let e=(()=>{switch(t.side){case"deletions":return this.deletionAnnotations;case"additions":return this.additionAnnotations}})(),i=e[t.lineNumber]??[];e[t.lineNumber]=i,i.push(t)}}getOptionsWithDefaults(){let{diffIndicators:e="bars",diffStyle:t="split",disableBackground:n=!1,disableFileHeader:a=!1,disableLineNumbers:r=!1,expandUnchanged:o=!1,expansionLineCount:s=100,hunkSeparators:l="line-info",lineDiffType:d="word-alt",maxLineDiffLength:f=1e3,overflow:h="scroll",theme:c=i.DEFAULT_THEMES,themeType:u="system",tokenizeMaxLineLength:p=1e3,useCSSClasses:m=!1}=this.options;return{diffIndicators:e,diffStyle:t,disableBackground:n,disableFileHeader:a,disableLineNumbers:r,expandUnchanged:o,expansionLineCount:s,hunkSeparators:l,lineDiffType:d,maxLineDiffLength:f,overflow:h,theme:this.workerManager?.getDiffRenderOptions().theme??c,themeType:u,tokenizeMaxLineLength:p,useCSSClasses:m}}async initializeHighlighter(){var e,t;return this.highlighter=await (0,p.getSharedHighlighter)((e=this.computedLang,t=this.options,{langs:[e??"text"],themes:(0,g.getThemes)(t.theme)})),this.highlighter}hydrate(e){if(null==e)return;this.diff=e;let{options:t}=this.getRenderOptions(e),i=this.workerManager?.getDiffResultCache(e);null==i||D(t,i.options)||(i=void 0),this.renderCache??={diff:e,highlighted:!0,options:t,result:i?.result},this.workerManager?.isWorkingPool()===!0&&null==this.renderCache.result?this.workerManager.highlightDiffAST(this,this.diff):this.asyncHighlight(e).then(({result:t,options:i})=>{this.onHighlightSuccess(e,t,i)})}getRenderOptions(e){let t=(()=>{if(this.workerManager?.isWorkingPool()===!0)return this.workerManager.getDiffRenderOptions();let{theme:e,tokenizeMaxLineLength:t,lineDiffType:i}=this.getOptionsWithDefaults();return{theme:e,tokenizeMaxLineLength:t,lineDiffType:i}})();this.getOptionsWithDefaults();let{renderCache:i}=this;return i?.result!=null&&e===i.diff&&D(t,i.options)?{options:t,forceRender:!1}:{options:t,forceRender:!0}}renderDiff(e=this.renderCache?.diff){if(null==e)return;let t=this.workerManager?.getDiffResultCache(e);null!=t&&null==this.renderCache&&(this.renderCache={diff:e,highlighted:!0,...t});let{options:i,forceRender:n}=this.getRenderOptions(e);if(this.renderCache??={diff:e,highlighted:!1,options:i,result:void 0},this.workerManager?.isWorkingPool()===!0)this.renderCache.result??=this.workerManager.getPlainDiffAST(e),(!this.renderCache.highlighted||n)&&this.workerManager.highlightDiffAST(this,e);else{this.computedLang=e.lang??(0,k.getFiletypeFromFileName)(e.name);let t=null!=this.highlighter&&v(i.theme),a=null!=this.highlighter&&u(this.computedLang);if(null!=this.highlighter&&t&&(n||!this.renderCache.highlighted&&a||null==this.renderCache.result)){let{result:t,options:i}=this.renderDiffWithHighlighter(e,this.highlighter,!a);this.renderCache={diff:e,options:i,highlighted:a,result:t}}t&&a||this.asyncHighlight(e).then(({result:t,options:i})=>{this.onHighlightSuccess(e,t,i)})}return null!=this.renderCache.result?this.processDiffResult(this.renderCache.diff,this.renderCache.result):void 0}async asyncRender(e){let{result:t}=await this.asyncHighlight(e);return this.processDiffResult(e,t)}createPreElement(e,t,i,n){var a;let{diffIndicators:r,disableBackground:o,disableLineNumbers:s,overflow:l,themeType:d}=this.getOptionsWithDefaults();return a={diffIndicators:r,disableBackground:o,disableLineNumbers:s,overflow:l,themeStyles:i,split:e,themeType:n??d,totalLines:t},(0,y.createHastElement)({tagName:"pre",properties:function({diffIndicators:e,disableBackground:t,disableLineNumbers:i,overflow:n,split:a,themeType:r,themeStyles:o,totalLines:s}){let l={"data-diffs":"","data-type":a?"split":"file","data-overflow":n,"data-disable-line-numbers":i?"":void 0,"data-background":t?void 0:"","data-indicators":"bars"===e||"classic"===e?e:void 0,"data-theme-type":"system"!==r?r:void 0,style:o,tabIndex:0};return l.style+=`--diffs-min-number-column-width-default:${`${s}`.length}ch;`,l}(a)})}async asyncHighlight(e){this.computedLang=e.lang??(0,k.getFiletypeFromFileName)(e.name);let t=null!=this.highlighter&&v(this.options.theme??i.DEFAULT_THEMES),n=null!=this.highlighter&&u(this.computedLang);return null!=this.highlighter&&t&&n||(this.highlighter=await this.initializeHighlighter()),this.renderDiffWithHighlighter(e,this.highlighter)}renderDiffWithHighlighter(e,t,i=!1){let{options:n}=this.getRenderOptions(e);return{result:(0,M.renderDiffWithHighlighter)(e,t,n,i),options:n}}onHighlightSuccess(e,t,i){if(null==this.renderCache)return;let n=this.renderCache.diff!==e||!this.renderCache.highlighted||!D(this.renderCache.options,i);this.renderCache={diff:e,options:i,highlighted:!0,result:t},n&&this.onRenderUpdate?.()}onHighlightError(e){console.error(e)}processDiffResult(e,{code:t,themeStyles:i,baseThemeType:n}){var a;let r,o,{diffStyle:s,disableFileHeader:l}=this.getOptionsWithDefaults();this.diff=e;let d="unified"===s,f=[],h=[],c=[],u=0,p=[],m=0;for(let i of e.hunks)m+=i.collapsedBefore,m=this.renderHunks({ast:t,hunk:i,prevHunk:r,hunkIndex:u,isLastHunk:u===e.hunks.length-1,additionsAST:f,deletionsAST:h,unifiedAST:c,hunkData:p,lineIndex:m}),u++,r=i;let g=Math.max(null==(o=(a=e.hunks)[a.length-1])?0:Math.max(o.additionStart+o.additionCount,o.deletionStart+o.deletionCount),e.newLines?.length??0,e.oldLines?.length??0);f=!d&&(null!=t.hunks||t.newLines.length>0)?f:void 0,h=!d&&(null!=t.hunks||t.oldLines.length>0)?h:void 0,c=c.length>0?c:void 0;let v=this.createPreElement(null!=h&&null!=f,g,i,n);return{additionsAST:f,deletionsAST:h,unifiedAST:c,hunkData:p,preNode:v,themeStyles:i,baseThemeType:n,headerElement:l?void 0:this.renderHeader(this.diff,i,n),totalLines:g,css:""}}renderFullAST(e,t=[]){return null!=e.unifiedAST&&t.push((0,y.createHastElement)({tagName:"code",children:e.unifiedAST,properties:{"data-code":"","data-unified":""}})),null!=e.deletionsAST&&t.push((0,y.createHastElement)({tagName:"code",children:e.deletionsAST,properties:{"data-code":"","data-deletions":""}})),null!=e.additionsAST&&t.push((0,y.createHastElement)({tagName:"code",children:e.additionsAST,properties:{"data-code":"","data-additions":""}})),{...e.preNode,children:t}}renderFullHTML(e,t=[]){return(0,C.toHtml)(this.renderFullAST(e,t))}renderPartialHTML(e,t){return null==t?(0,C.toHtml)(e):(0,C.toHtml)((0,y.createHastElement)({tagName:"code",children:e,properties:{"data-code":"",[`data-${t}`]:""}}))}renderCollapsedHunks({ast:e,hunkData:t,hunkIndex:i,hunkSpecs:n,isFirstHunk:a,isLastHunk:r,rangeSize:o,lineIndex:s,additionLineNumber:l,deletionLineNumber:d,unifiedAST:f,deletionsAST:h,additionsAST:c}){if(o<=0)return;let{hunkSeparators:u,expandUnchanged:p,diffStyle:m,expansionLineCount:g}=this.getOptionsWithDefaults(),v=null==e.hunks&&e.newLines.length>0&&e.oldLines.length>0,b=this.expandedHunks.get(i)??T,y=o>g,x=Math.max(p?0:o-(b.fromEnd+b.fromStart),0),k=({type:e,linesAST:o})=>{if("line-info"===u||"custom"===u){var s;let n=`hunk-separator-${e}-${i}`;o.push(S({type:u,content:(s=x,`${s} unmodified line${s>1?"s":""}`),expandIndex:v?i:void 0,chunked:y,slotName:n,isFirstHunk:a,isLastHunk:r})),t.push({slotName:n,hunkIndex:i,lines:x,type:e,expandable:v?{up:v&&!a,down:v,chunked:y}:void 0})}else"metadata"===u&&null!=n?o.push(S({type:"metadata",content:n,isFirstHunk:a,isLastHunk:r})):"simple"===u&&i>0&&o.push(S({type:"simple",isFirstHunk:a,isLastHunk:!1}))},w=({rangeLen:t,fromStart:n})=>{if(null==e.newLines||null==e.oldLines)return;let a=r?0:n?o:t,u=d-a,p=l-a,g=s-a;for(let n=0;n<t;n++){let t=e.oldLines[u],n=e.newLines[p];if(null==t||null==n)throw console.error({aLineNumber:p,dLineNumber:u,ast:e}),Error("DiffHunksRenderer.renderHunks prefill context invalid. Must include data for old and new lines");u++,p++,"unified"===m?this.pushLineWithAnnotation({newLine:n,unifiedAST:f,unifiedSpan:this.getAnnotations("unified",u,p,i,g)}):this.pushLineWithAnnotation({newLine:n,oldLine:t,additionsAST:c,deletionsAST:h,...this.getAnnotations("split",u,p,i,g)}),g++}};v&&w({rangeLen:Math.min(0===x||p?o:b.fromStart,o),fromStart:!0}),x>0&&("unified"===m?k({type:"unified",linesAST:f}):(k({type:"deletions",linesAST:h}),k({type:"additions",linesAST:c}))),x>0&&b.fromEnd>0&&!r&&w({rangeLen:Math.min(b.fromEnd,o),fromStart:!1})}renderHunks({hunk:e,hunkData:t,hunkIndex:i,lineIndex:n,isLastHunk:a,prevHunk:r,ast:o,deletionsAST:s,additionsAST:l,unifiedAST:d}){let{diffStyle:f}=this.getOptionsWithDefaults(),h="unified"===f,c=e.additionStart-1,u=e.deletionStart-1;this.renderCollapsedHunks({additionLineNumber:c,additionsAST:l,ast:o,deletionLineNumber:u,deletionsAST:s,hunkData:t,hunkIndex:i,hunkSpecs:e.hunkSpecs,isFirstHunk:null==r,isLastHunk:!1,lineIndex:n,rangeSize:Math.max(e.collapsedBefore,0),unifiedAST:d});let{oldLines:p,newLines:m,oldIndex:g,newIndex:v}=(()=>{if(null!=o.hunks){let e=o.hunks[i];if(null==e)throw console.error({ast:o,hunkIndex:i}),Error("DiffHunksRenderer.renderHunks: lineHunk doesn't exist");return{oldLines:e.oldLines,newLines:e.newLines,oldIndex:0,newIndex:0}}return{oldLines:o.oldLines,newLines:o.newLines,oldIndex:u,newIndex:c}})();for(let t of e.hunkContent)if("context"===t.type){let{length:e}=t.lines;for(let t=0;t<e;t++){let e=p[g],t=m[v];if(g++,v++,c++,u++,h){if(null==t)throw Error("DiffHunksRenderer.renderHunks: newLine doesnt exist for context...");this.pushLineWithAnnotation({newLine:t,unifiedAST:d,unifiedSpan:this.getAnnotations("unified",u,c,i,n)})}else{if(null==t||null==e)throw Error("DiffHunksRenderer.renderHunks: newLine or oldLine doesnt exist for context...");this.pushLineWithAnnotation({oldLine:e,newLine:t,deletionsAST:s,additionsAST:l,...this.getAnnotations("split",u,c,i,n)})}n++}if(t.noEOFCR){let e=E("context");h?d.push(e):(s.push(e),l.push(e))}}else{let{length:e}=t.deletions,{length:a}=t.additions,r=h?e+a:Math.max(e,a),f=0;for(let b=0;b<r;b++){let{oldLine:y,newLine:x}=(()=>{let i=p[g],n=m[v];if(h?b<e?n=void 0:i=void 0:(b>=e&&(i=void 0),b>=a&&(n=void 0)),null==i&&null==n)throw console.error({i:b,len:r,ast:o,hunkContent:t}),Error("renderHunks: oldLine and newLine are null, something is wrong");return{oldLine:i,newLine:n}})();if(null!=y&&(g++,u++),null!=x&&(v++,c++),h)this.pushLineWithAnnotation({oldLine:y,newLine:x,unifiedAST:d,unifiedSpan:this.getAnnotations("unified",null!=y?u:void 0,null!=x?c:void 0,i,n)}),n++;else{(null==y||null==x)&&f++;let t=this.getAnnotations("split",null!=y?u:void 0,null!=x?c:void 0,i,n);null!=t&&f>0&&(a>e?s.push(w(f)):l.push(w(f)),f=0),this.pushLineWithAnnotation({newLine:x,oldLine:y,deletionsAST:s,additionsAST:l,...t}),n++}}!h&&(f>0&&(a>e?s.push(w(f)):l.push(w(f)),f=0),t.noEOFCRDeletions&&(s.push(E("change-deletion")),t.noEOFCRAdditions||l.push(w(1))),t.noEOFCRAdditions&&(l.push(E("change-addition")),t.noEOFCRDeletions||s.push(w(1))))}return a&&null!=o.newLines&&o.newLines.length>0&&this.renderCollapsedHunks({additionLineNumber:c,additionsAST:l,ast:o,deletionLineNumber:u,deletionsAST:s,hunkData:t,hunkIndex:i+1,hunkSpecs:void 0,isFirstHunk:!1,isLastHunk:!0,lineIndex:n,rangeSize:Math.max(o.newLines.length-Math.max(e.additionStart+e.additionCount-1,0),0),unifiedAST:d}),n}pushLineWithAnnotation({newLine:e,oldLine:t,unifiedAST:i,additionsAST:n,deletionsAST:a,unifiedSpan:r,deletionSpan:o,additionSpan:s}){null!=i?(null!=t?i.push(t):null!=e&&i.push(e),null!=r&&i.push(x(r))):null!=a&&null!=n&&(null!=t&&a.push(t),null!=e&&n.push(e),null!=o&&a.push(x(o)),null!=s&&n.push(x(s)))}getAnnotations(e,t,i,a,r){let o={type:"annotation",hunkIndex:a,lineIndex:r,annotations:[]};if(null!=t)for(let e of this.deletionAnnotations[t]??[])o.annotations.push(n(e));let s={type:"annotation",hunkIndex:a,lineIndex:r,annotations:[]};if(null!=i)for(let t of this.additionAnnotations[i]??[])("unified"===e?o:s).annotations.push(n(t));return"unified"===e?o.annotations.length>0?o:void 0:0!==s.annotations.length||0!==o.annotations.length?{deletionSpan:o,additionSpan:s}:void 0}renderHeader(e,t,n){let{themeType:a}=this.getOptionsWithDefaults();return function({fileOrDiff:e,themeStyles:t,themeType:n}){let a="type"in e?e:void 0,r={"data-diffs-header":"","data-change-type":a?.type,"data-theme-type":"system"!==n?n:void 0,style:t};return(0,y.createHastElement)({tagName:"div",children:[function({name:e,prevName:t,iconType:i}){let n=[(0,y.createIconElement)({name:function(e){switch(e){case"file":return"diffs-icon-file-code";case"change":return"diffs-icon-symbol-modified";case"new":return"diffs-icon-symbol-added";case"deleted":return"diffs-icon-symbol-deleted";case"rename-pure":case"rename-changed":return"diffs-icon-symbol-moved"}}(i),properties:{"data-change-icon":i}})];return null!=t&&(n.push((0,y.createHastElement)({tagName:"div",children:[(0,y.createTextNodeElement)(t)],properties:{"data-prev-name":""}})),n.push((0,y.createIconElement)({name:"diffs-icon-arrow-right-short",properties:{"data-rename-icon":""}}))),n.push((0,y.createHastElement)({tagName:"div",children:[(0,y.createTextNodeElement)(e)],properties:{"data-title":""}})),(0,y.createHastElement)({tagName:"div",children:n,properties:{"data-header-content":""}})}({name:e.name,prevName:"prevName"in e?e.prevName:void 0,iconType:a?.type??"file"}),function(e){let t=[];if(null!=e){let i=0,n=0;for(let t of e.hunks)i+=t.additionLines,n+=t.deletionLines;(n>0||0===i)&&t.push((0,y.createHastElement)({tagName:"span",children:[(0,y.createTextNodeElement)(`-${n}`)],properties:{"data-deletions-count":""}})),(i>0||0===n)&&t.push((0,y.createHastElement)({tagName:"span",children:[(0,y.createTextNodeElement)(`+${i}`)],properties:{"data-additions-count":""}}))}return t.push((0,y.createHastElement)({tagName:"slot",properties:{name:i.HEADER_METADATA_SLOT_ID}})),(0,y.createHastElement)({tagName:"div",children:t,properties:{"data-metadata":""}})}(a)],properties:r})}({fileOrDiff:e,themeStyles:t,themeType:n??a})}};function D(e,t){return(0,b.areThemesEqual)(e.theme,t.theme)&&e.tokenizeMaxLineLength===t.tokenizeMaxLineLength&&e.lineDiffType===t.lineDiffType}e.s(["DiffHunksRenderer",0,N],984853)},713201,e=>{"use strict";var t=e.i(639363),i=e.i(108615);function n(e){return"change"===e?{type:"change",additions:[],deletions:[],noEOFCRAdditions:!1,noEOFCRDeletions:!1}:{type:"context",lines:[],noEOFCR:!1}}e.s(["parsePatchFiles",0,function(e,a){let r=[];for(let o of e.split(t.COMMIT_METADATA_SPLIT))try{r.push(function(e,a){let r,o,s=t.GIT_DIFF_FILE_BREAK_REGEX.test(e),l=e.split(s?t.GIT_DIFF_FILE_BREAK_REGEX:t.UNIFIED_DIFF_FILE_BREAK_REGEX),d=[];for(let e of l){if(s&&!t.GIT_DIFF_FILE_BREAK_REGEX.test(e)||!s&&!t.UNIFIED_DIFF_FILE_BREAK_REGEX.test(e)){null==r?r=e:console.error("parsePatchContent: unknown file blob:",e);continue}let l=0,f=e.split(t.FILE_CONTEXT_BLOB);for(let e of(o=void 0,f)){let r=e.split(t.SPLIT_WITH_NEWLINES),f=r.shift();if(null==f){console.error("parsePatchContent: invalid hunk",e);continue}let h=f.match(t.HUNK_HEADER),c=[],u=0,p=0;if(null==h||null==o){if(null!=o){console.error("parsePatchContent: Invalid hunk",e);continue}for(let e of(o={name:"",prevName:void 0,type:"change",hunks:[],splitLineCount:0,unifiedLineCount:0,cacheKey:null!=a?`${a}-${d.length}`:void 0},r.unshift(f),r)){let i=e.match(s?t.FILENAME_HEADER_REGEX_GIT:t.FILENAME_HEADER_REGEX);if(e.startsWith("diff --git")){let[,,i,,n]=e.trim().match(t.ALTERNATE_FILE_NAMES_GIT)??[];o.name=n.trim(),i!==n&&(o.prevName=i.trim())}else if(null!=i){let[,e,t]=i;"---"===e&&"/dev/null"!==t?(o.prevName=t.trim(),o.name=t.trim()):"+++"===e&&"/dev/null"!==t&&(o.name=t.trim())}else if(s){if(e.startsWith("new mode ")&&(o.mode=e.replace("new mode","").trim()),e.startsWith("old mode ")&&(o.oldMode=e.replace("old mode","").trim()),e.startsWith("new file mode")&&(o.type="new",o.mode=e.replace("new file mode","").trim()),e.startsWith("deleted file mode")&&(o.type="deleted",o.mode=e.replace("deleted file mode","").trim()),e.startsWith("similarity index")&&(e.startsWith("similarity index 100%")?o.type="rename-pure":o.type="rename-changed"),e.startsWith("index ")){let[,i]=e.trim().match(t.FILE_MODE_FROM_INDEX)??[];null!=i&&(o.mode=i)}e.startsWith("rename from ")&&(o.prevName=e.replace("rename from ","")),e.startsWith("rename to ")&&(o.name=e.replace("rename to ","").trim())}}continue}{let e,t;for(;r.length>0&&("\n"===r[r.length-1]||""===r[r.length-1]);)r.pop();for(let a of r){let r=function(e){let t=e[0];return"+"!==t&&"-"!==t&&" "!==t&&"\\"!==t?void console.error(`parseLineType: Invalid firstChar: "${t}", full line: "${e}"`):{line:e.substring(1),type:" "===t?"context":"\\"===t?"metadata":"+"===t?"addition":"deletion"}}(a);if(null==r)continue;let{type:o,line:s}=r;if("addition"===o)(null==e||"change"!==e.type)&&(e=n("change"),c.push(e)),e.additions.push(s),u++,t="addition";else if("deletion"===o)(null==e||"change"!==e.type)&&(e=n("change"),c.push(e)),e.deletions.push(s),p++,t="deletion";else if("context"===o)(null==e||"context"!==e.type)&&(e=n("context"),c.push(e)),e.lines.push(s),t="context";else if("metadata"===o&&null!=e){if("context"===e.type)e.noEOFCR=!0;else if("deletion"===t){e.noEOFCRDeletions=!0;let t=e.deletions.length-1;t>=0&&(e.deletions[t]=(0,i.cleanLastNewline)(e.deletions[t]))}else if("addition"===t){e.noEOFCRAdditions=!0;let t=e.additions.length-1;t>=0&&(e.additions[t]=(0,i.cleanLastNewline)(e.additions[t]))}}}}let m={collapsedBefore:0,splitLineCount:0,splitLineStart:0,unifiedLineCount:0,unifiedLineStart:0,additionCount:parseInt(h[4]??"1"),additionStart:parseInt(h[3]),additionLines:u,deletionCount:parseInt(h[2]??"1"),deletionStart:parseInt(h[1]),deletionLines:p,hunkContent:c,hunkContext:h[5],hunkSpecs:f};if(isNaN(m.additionCount)||isNaN(m.deletionCount)||isNaN(m.additionStart)||isNaN(m.deletionStart)){console.error("parsePatchContent: invalid hunk metadata",m);continue}for(let e of(m.collapsedBefore=Math.max(m.additionStart-1-l,0),o.hunks.push(m),l=m.additionStart+m.additionCount-1,c))"context"===e.type?(m.splitLineCount+=e.lines.length,m.unifiedLineCount+=e.lines.length):(m.splitLineCount+=Math.max(e.additions.length,e.deletions.length),m.unifiedLineCount+=e.deletions.length+e.additions.length);m.splitLineStart=o.splitLineCount,m.unifiedLineStart=o.unifiedLineCount,o.splitLineCount+=m.splitLineCount,o.unifiedLineCount+=m.unifiedLineCount}null!=o&&(s||null==o.prevName||o.name===o.prevName||(o.hunks.length>0?o.type="rename-changed":o.type="rename-pure"),"rename-pure"!==o.type&&"rename-changed"!==o.type&&(o.prevName=void 0),d.push(o))}return{patchMetadata:r,files:d}}(o,null!=a?`${a}-${r.length}`:void 0))}catch(e){console.error(e)}return r}],713201)},40138,465185,481147,609881,e=>{"use strict";var t=e.i(639363),i=e.i(741759),n=e.i(194406),a=e.i(400150),r=e.i(119187),o=e.i(124608),s=e.i(409631),l=e.i(986768),d=e.i(243639),f=e.i(522770),h=e.i(711808),c=e.i(225496),u=e.i(888351),p=e.i(994641),m=e.i(226376),g=e.i(792369),v=e.i(800319),b=e.i(347177),y=e.i(984853),x=e.i(713201),k=e.i(65417);class w extends k.default{constructor(){super(...arguments),this.tokenize=L}equals(e,t,i){return i.ignoreWhitespace?(i.newlineIsToken&&e.includes("\n")||(e=e.trim()),i.newlineIsToken&&t.includes("\n")||(t=t.trim())):i.ignoreNewlineAtEof&&!i.newlineIsToken&&(e.endsWith("\n")&&(e=e.slice(0,-1)),t.endsWith("\n")&&(t=t.slice(0,-1))),super.equals(e,t,i)}}let E=new w;function L(e,t){t.stripTrailingCr&&(e=e.replace(/\r\n/g,"\n"));let i=[],n=e.split(/(\n|\r\n)/);n[n.length-1]||n.pop();for(let e=0;e<n.length;e++){let a=n[e];e%2&&!t.newlineIsToken?i[i.length-1]+=a:i.push(a)}return i}function S(e,t,i,n,a,r,o){var s;let l;void 0===(l=o?"function"==typeof o?{callback:o}:o:{}).context&&(l.context=4);let d=l.context;if(l.newlineIsToken)throw Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");if(!l.callback)return f(E.diff(i,n,l));{let{callback:e}=l;s=Object.assign(Object.assign({},l),{callback:t=>{e(f(t))}}),E.diff(i,n,s)}function f(i){if(!i)return;function n(e){return e.map(function(e){return" "+e})}i.push({value:"",lines:[]});let o=[],s=0,l=0,f=[],h=1,c=1;for(let e=0;e<i.length;e++){let t=i[e],a=t.lines||function(e){let t=e.endsWith("\n"),i=e.split("\n").map(e=>e+"\n");return t?i.pop():i.push(i.pop().slice(0,-1)),i}(t.value);if(t.lines=a,t.added||t.removed){if(!s){let t=i[e-1];s=h,l=c,t&&(s-=(f=d>0?n(t.lines.slice(-d)):[]).length,l-=f.length)}for(let e of a)f.push((t.added?"+":"-")+e);t.added?c+=a.length:h+=a.length}else{if(s)if(a.length<=2*d&&e<i.length-2)for(let e of n(a))f.push(e);else{let e=Math.min(a.length,d);for(let t of n(a.slice(0,e)))f.push(t);let t={oldStart:s,oldLines:h-s+e,newStart:l,newLines:c-l+e,lines:f};o.push(t),s=0,l=0,f=[]}h+=a.length,c+=a.length}}for(let e of o)for(let t=0;t<e.lines.length;t++)e.lines[t].endsWith("\n")?e.lines[t]=e.lines[t].slice(0,-1):(e.lines.splice(t+1,0,"\\ No newline at end of file"),t++);return{oldFileName:e,newFileName:t,oldHeader:a,newHeader:r,hunks:o}}}function M(e){if(Array.isArray(e))return e.map(M).join("\n");let t=[];e.oldFileName==e.newFileName&&t.push("Index: "+e.oldFileName),t.push("==================================================================="),t.push("--- "+e.oldFileName+(void 0===e.oldHeader?"":"	"+e.oldHeader)),t.push("+++ "+e.newFileName+(void 0===e.newHeader?"":"	"+e.newHeader));for(let i=0;i<e.hunks.length;i++){let n=e.hunks[i];for(let e of(0===n.oldLines&&(n.oldStart-=1),0===n.newLines&&(n.newStart-=1),t.push("@@ -"+n.oldStart+","+n.oldLines+" +"+n.newStart+","+n.newLines+" @@"),n.lines))t.push(e)}return t.join("\n")+"\n"}function C(e,i,n){let a=(0,x.parsePatchFiles)(function(e,t,i,n,a,r,o){if("function"==typeof o&&(o={callback:o}),null==o?void 0:o.callback){let{callback:s}=o;S(e,t,i,n,a,r,Object.assign(Object.assign({},o),{callback:e=>{e?s(M(e)):s(void 0)}}))}else{let s=S(e,t,i,n,a,r,o);if(!s)return;return M(s)}}(e.name,i.name,e.contents,i.contents,e.header,i.header,n))[0]?.files[0];if(null==a)throw Error("parseDiffFrom: FileInvalid diff -- probably need to fix something -- if the files are the same maybe?");return a.oldLines=e.contents.split(t.SPLIT_WITH_NEWLINES),a.newLines=i.contents.split(t.SPLIT_WITH_NEWLINES),null!=e.cacheKey&&null!=i.cacheKey&&(a.cacheKey=`${e.cacheKey}:${i.cacheKey}`),a}var T=e.i(790070);let N=-1;var D=class{static LoadedCustomComponent=v.DiffsContainerLoaded;__id=++N;fileContainer;spriteSVG;pre;unsafeCSSStyle;hoverContent;headerElement;headerMetadata;customHunkElements=[];errorWrapper;hunksRenderer;resizeManager;scrollSyncManager;mouseEventManager;lineSelectionManager;annotationElements=[];lineAnnotations=[];oldFile;newFile;fileDiff;constructor(e={theme:t.DEFAULT_THEMES},i,n=!1){this.options=e,this.workerManager=i,this.isContainerManaged=n,this.hunksRenderer=new y.DiffHunksRenderer({...e,hunkSeparators:"function"==typeof e.hunkSeparators?"custom":e.hunkSeparators},this.handleHighlightRender,this.workerManager),this.resizeManager=new o.ResizeManager,this.scrollSyncManager=new b.ScrollSyncManager,this.mouseEventManager=new r.MouseEventManager("diff",(0,r.pluckMouseEventOptions)(e,"function"==typeof e.hunkSeparators||(e.hunkSeparators??"line-info")==="line-info"?this.handleExpandHunk:void 0)),this.lineSelectionManager=new a.LineSelectionManager((0,a.pluckLineSelectionOptions)(e)),this.workerManager?.subscribeToThemeChanges(this)}handleHighlightRender=()=>{this.rerender()};setOptions(e){null!=e&&(this.options=e,this.hunksRenderer.setOptions({...this.options,hunkSeparators:"function"==typeof e.hunkSeparators?"custom":e.hunkSeparators}),this.mouseEventManager.setOptions((0,r.pluckMouseEventOptions)(e,"function"==typeof e.hunkSeparators||(e.hunkSeparators??"line-info")==="line-info"?this.handleExpandHunk:void 0)),this.lineSelectionManager.setOptions((0,a.pluckLineSelectionOptions)(e)))}mergeOptions(e){this.options={...this.options,...e}}setThemeType(e){if((this.options.themeType??"system")!==e&&(this.mergeOptions({themeType:e}),this.hunksRenderer.setThemeType(e),null!=this.headerElement&&("system"===e?delete this.headerElement.dataset.themeType:this.headerElement.dataset.themeType=e),null!=this.pre))switch(e){case"system":delete this.pre.dataset.themeType;break;case"light":case"dark":this.pre.dataset.themeType=e}}getHoveredLine=()=>this.mouseEventManager.getHoveredLine();setLineAnnotations(e){this.lineAnnotations=e}setSelectedLines(e){this.lineSelectionManager.setSelection(e)}cleanUp(){this.hunksRenderer.cleanUp(),this.resizeManager.cleanUp(),this.mouseEventManager.cleanUp(),this.scrollSyncManager.cleanUp(),this.lineSelectionManager.cleanUp(),this.workerManager?.unsubscribeToThemeChanges(this),this.workerManager=void 0,this.fileDiff=void 0,this.oldFile=void 0,this.newFile=void 0,this.isContainerManaged||this.fileContainer?.parentNode?.removeChild(this.fileContainer),this.fileContainer?.shadowRoot!=null&&(this.fileContainer.shadowRoot.innerHTML=""),this.fileContainer=void 0,this.pre=void 0,this.headerElement=void 0,this.errorWrapper=void 0}hydrate(e){let{fileContainer:i,prerenderedHTML:n}=e;for(let e of((0,m.prerenderHTMLIfNecessary)(i,n),Array.from(i.shadowRoot?.children??[]))){if(e instanceof SVGElement){this.spriteSVG=e;continue}if(e instanceof HTMLElement){if(e instanceof HTMLPreElement){this.pre=e;continue}if("diffsHeader"in e.dataset){this.headerElement=e;continue}if(e instanceof HTMLStyleElement&&e.hasAttribute(t.UNSAFE_CSS_ATTRIBUTE)){this.unsafeCSSStyle=e;continue}}}if(null==this.pre)this.render(e);else{let{lineAnnotations:t,oldFile:n,newFile:a,fileDiff:r}=e;this.fileContainer=i,delete this.pre.dataset.dehydrated,this.lineAnnotations=t??this.lineAnnotations,this.newFile=a,this.oldFile=n,this.fileDiff=r??(null!=n&&null!=a?C(n,a):void 0),this.hunksRenderer.hydrate(this.fileDiff),this.renderAnnotations(),this.renderHoverUtility(),this.injectUnsafeCSS(),this.mouseEventManager.setup(this.pre),this.lineSelectionManager.setup(this.pre),(this.options.overflow??"scroll")==="scroll"&&(this.resizeManager.setup(this.pre),this.scrollSyncManager.setup(this.pre))}}rerender(){(null!=this.fileDiff||null!=this.newFile||null!=this.oldFile)&&this.render({oldFile:this.oldFile,newFile:this.newFile,fileDiff:this.fileDiff,forceRender:!0})}handleExpandHunk=(e,t)=>{this.expandHunk(e,t)};expandHunk(e,t){this.hunksRenderer.expandHunk(e,t),this.rerender()}render({oldFile:e,newFile:t,fileDiff:i,forceRender:n=!1,lineAnnotations:a,fileContainer:r,containerWrapper:o}){let s=null!=e&&null!=t&&(!(0,d.areFilesEqual)(e,this.oldFile)||!(0,d.areFilesEqual)(t,this.newFile)),l=null!=a&&(a.length>0||this.lineAnnotations.length>0)&&a!==this.lineAnnotations;if(!n&&!l&&(null!=i&&i===this.fileDiff||null==i&&!s)||(this.oldFile=e,this.newFile=t,null!=i?this.fileDiff=i:null!=e&&null!=t&&s&&(this.fileDiff=C(e,t)),null!=a&&this.setLineAnnotations(a),null==this.fileDiff))return;this.hunksRenderer.setOptions({...this.options,hunkSeparators:"function"==typeof this.options.hunkSeparators?"custom":this.options.hunkSeparators}),this.hunksRenderer.setLineAnnotations(this.lineAnnotations);let{disableFileHeader:f=!1}=this.options;f&&null!=this.headerElement&&(this.headerElement.parentNode?.removeChild(this.headerElement),this.headerElement=void 0),r=this.getOrCreateFileContainer(r,o);try{let e=this.hunksRenderer.renderDiff(this.fileDiff);if(null==e){null==this.workerManager||this.workerManager.isInitialized()||this.workerManager.initialize().then(()=>this.rerender());return}null!=e.headerElement&&this.applyHeaderToDOM(e.headerElement,r);let t=this.getOrCreatePreNode(r);this.applyHunksToDOM(t,e),this.renderSeparators(e.hunkData),this.renderAnnotations(),this.renderHoverUtility()}catch(e){e instanceof Error&&this.applyErrorToDOM(e,r)}}renderSeparators(e){let{hunkSeparators:t}=this.options;if(!this.isContainerManaged&&null!=this.fileContainer&&"function"==typeof t){for(let e of this.customHunkElements)e.parentNode?.removeChild(e);for(let i of(this.customHunkElements.length=0,e)){let e=document.createElement("div");e.style.display="contents",e.slot=i.slotName,e.appendChild(t(i,this)),this.fileContainer.appendChild(e),this.customHunkElements.push(e)}}}renderAnnotations(){if(this.isContainerManaged||null==this.fileContainer)return;for(let e of this.annotationElements)e.parentNode?.removeChild(e);this.annotationElements.length=0;let{renderAnnotation:e}=this.options;if(null!=e&&this.lineAnnotations.length>0)for(let t of this.lineAnnotations){let i=e(t);if(null==i)continue;let n=(0,f.createAnnotationWrapperNode)((0,s.getLineAnnotationName)(t));n.appendChild(i),this.annotationElements.push(n),this.fileContainer.appendChild(n)}}renderHoverUtility(){let{renderHoverUtility:e}=this.options;if(null==this.fileContainer||null==e)return;null==this.hoverContent&&(this.hoverContent=(0,c.createHoverContentNode)(),this.fileContainer.appendChild(this.hoverContent));let t=e(this.mouseEventManager.getHoveredLine);this.hoverContent.innerHTML="",null!=t&&this.hoverContent.appendChild(t)}getOrCreateFileContainer(e,i){if(this.fileContainer=e??this.fileContainer??document.createElement(t.DIFFS_TAG_NAME),null!=i&&this.fileContainer.parentNode!==i&&i.appendChild(this.fileContainer),null==this.spriteSVG){let e=document.createElement("div");e.innerHTML=l.SVGSpriteSheet;let t=e.firstChild;t instanceof SVGElement&&(this.spriteSVG=t,this.fileContainer.shadowRoot?.appendChild(this.spriteSVG))}return this.fileContainer}getFileContainer(){return this.fileContainer}getOrCreatePreNode(e){return null==this.pre?(this.pre=document.createElement("pre"),e.shadowRoot?.appendChild(this.pre)):this.pre.parentNode!==e&&e.shadowRoot?.appendChild(this.pre),this.pre}applyHeaderToDOM(e,i){this.cleanupErrorWrapper();let n=document.createElement("div");n.innerHTML=(0,T.toHtml)(e);let a=n.firstElementChild;if(!(a instanceof HTMLElement)||(null!=this.headerElement?i.shadowRoot?.replaceChild(a,this.headerElement):i.shadowRoot?.prepend(a),this.headerElement=a,this.isContainerManaged))return;let{renderHeaderMetadata:r}=this.options;null!=this.headerMetadata&&this.headerMetadata.parentNode?.removeChild(this.headerMetadata);let o=r?.({oldFile:this.oldFile,newFile:this.newFile,fileDiff:this.fileDiff})??void 0;null!=o&&(this.headerMetadata=document.createElement("div"),this.headerMetadata.slot=t.HEADER_METADATA_SLOT_ID,o instanceof Element?this.headerMetadata.appendChild(o):this.headerMetadata.innerText=`${o}`,i.appendChild(this.headerMetadata))}injectUnsafeCSS(){if(this.fileContainer?.shadowRoot==null)return;let{unsafeCSS:e}=this.options;null!=e&&""!==e&&(null==this.unsafeCSSStyle&&(this.unsafeCSSStyle=(0,u.createUnsafeCSSStyleNode)(),this.fileContainer.shadowRoot.appendChild(this.unsafeCSSStyle)),this.unsafeCSSStyle.innerText=(0,p.wrapUnsafeCSS)(e))}applyHunksToDOM(e,t){let i,n;if(this.cleanupErrorWrapper(),this.applyPreNodeAttributes(e,t),e.innerHTML="",null!=t.unifiedAST){let i=(0,h.createCodeNode)({columnType:"unified"});i.innerHTML=this.hunksRenderer.renderPartialHTML(t.unifiedAST),e.appendChild(i)}else null!=t.deletionsAST&&((i=(0,h.createCodeNode)({columnType:"deletions"})).innerHTML=this.hunksRenderer.renderPartialHTML(t.deletionsAST),e.appendChild(i)),null!=t.additionsAST&&((n=(0,h.createCodeNode)({columnType:"additions"})).innerHTML=this.hunksRenderer.renderPartialHTML(t.additionsAST),e.appendChild(n));this.injectUnsafeCSS(),this.mouseEventManager.setup(e),this.lineSelectionManager.setup(e),(this.options.overflow??"scroll")==="scroll"?(this.resizeManager.setup(e),this.scrollSyncManager.setup(e,i,n)):(this.resizeManager.cleanUp(),this.scrollSyncManager.cleanUp())}applyPreNodeAttributes(e,{themeStyles:t,baseThemeType:i,additionsAST:n,deletionsAST:a,totalLines:r}){let{diffIndicators:o="bars",disableBackground:s=!1,disableLineNumbers:l=!1,overflow:d="scroll",themeType:f="system",diffStyle:h="split"}=this.options;(0,g.setPreNodeProperties)({pre:e,diffIndicators:o,disableBackground:s,disableLineNumbers:l,overflow:d,split:"unified"!==h&&null!=n&&null!=a,themeStyles:t,themeType:i??f,totalLines:r})}applyErrorToDOM(e,t){this.cleanupErrorWrapper();let i=this.getOrCreatePreNode(t);i.innerHTML="",i.parentNode?.removeChild(i),this.pre=void 0;let n=t.shadowRoot??t.attachShadow({mode:"open"});this.errorWrapper??=document.createElement("div"),this.errorWrapper.dataset.errorWrapper="",this.errorWrapper.innerHTML="",n.appendChild(this.errorWrapper);let a=document.createElement("div");a.dataset.errorMessage="",a.innerText=e.message,this.errorWrapper.appendChild(a);let r=document.createElement("pre");r.dataset.errorStack="",r.innerText=e.stack??"No Error Stack",this.errorWrapper.appendChild(r)}cleanupErrorWrapper(){this.errorWrapper?.parentNode?.removeChild(this.errorWrapper),this.errorWrapper=void 0}},H=e.i(221063),A=e.i(552954),F=e.i(993238);let R="u"<typeof window?F.useEffect:F.useLayoutEffect;function I({oldFile:e,newFile:i,fileDiff:n,options:a,lineAnnotations:r,selectedLines:o,prerenderedHTML:s}){var l;let d,f=(0,F.useContext)(A.WorkerPoolContext),h=(0,F.useRef)(null),c=(l=t=>{if(null!=t){if(null!=h.current)throw Error("useFileDiffInstance: An instance should not already exist when a node is created");h.current=new D(a,f,!0),h.current.hydrate({fileDiff:n,oldFile:e,newFile:i,fileContainer:t,lineAnnotations:r,prerenderedHTML:s})}else{if(null==h.current)throw Error("useFileDiffInstance: A FileDiff instance should exist when unmounting");h.current.cleanUp(),h.current=null}},d=(0,F.useRef)(l),(0,F.useInsertionEffect)(()=>void(d.current=l)),(0,F.useCallback)((...e)=>d.current(...e),[]));return R(()=>{var s;if(null==h.current)return;let l=h.current,d=(s=l.options,!((0,H.areThemesEqual)(s?.theme??t.DEFAULT_THEMES,a?.theme??t.DEFAULT_THEMES)&&function(e,t,i){if(e===t||null==e||null==t)return e===t;let n=new Set(i),a=Object.keys(e),r=new Set(Object.keys(t));for(let i of a)if(r.delete(i),!n.has(i)&&(!(i in t)||e[i]!==t[i]))return!1;for(let e of Array.from(r))if(!n.has(e))return!1;return!0}(s,a,["theme"])));l.setOptions(a),l.render({forceRender:d,fileDiff:n,oldFile:e,newFile:i,lineAnnotations:r}),void 0!==o&&l.setSelectedLines(o)}),{ref:c,getHoveredLine:(0,F.useCallback)(()=>h.current?.getHoveredLine(),[])}}var W=e.i(991565);e.s(["FileDiff",0,function({fileDiff:e,options:a,lineAnnotations:r,selectedLines:o,className:s,style:l,prerenderedHTML:d,renderAnnotation:f,renderHeaderMetadata:h,renderHoverUtility:c}){let{ref:u,getHoveredLine:p}=I({fileDiff:e,options:a,lineAnnotations:r,selectedLines:o,prerenderedHTML:d});return(0,W.jsx)(t.DIFFS_TAG_NAME,{ref:u,className:s,style:l,children:(0,i.templateRender)((0,n.renderDiffChildren)({fileDiff:e,renderHeaderMetadata:h,renderAnnotation:f,lineAnnotations:r,renderHoverUtility:c,getHoveredLine:p}),d)})}],40138),e.s(["MultiFileDiff",0,function({oldFile:e,newFile:a,options:r,lineAnnotations:o,selectedLines:s,className:l,style:d,prerenderedHTML:f,renderAnnotation:h,renderHeaderMetadata:c,renderHoverUtility:u}){let{ref:p,getHoveredLine:m}=I({oldFile:e,newFile:a,options:r,lineAnnotations:o,selectedLines:s,prerenderedHTML:f});return(0,W.jsx)(t.DIFFS_TAG_NAME,{ref:p,className:l,style:d,children:(0,i.templateRender)((0,n.renderDiffChildren)({oldFile:e,newFile:a,renderHeaderMetadata:c,renderAnnotation:h,lineAnnotations:o,renderHoverUtility:u,getHoveredLine:m}),f)})}],465185);var O=e.i(541158),j=e.i(983199),U=e.i(84297);let _={type:"spring",stiffness:250,damping:25},z=(0,F.forwardRef)(({onMouseEnter:e,onMouseLeave:t,className:i,size:n=28,...a},r)=>{let o=(0,U.useAnimation)(),s=(0,F.useRef)(!1);(0,F.useImperativeHandle)(r,()=>(s.current=!0,{startAnimation:()=>o.start("animate"),stopAnimation:()=>o.start("normal")}));let l=(0,F.useCallback)(t=>{s.current?e?.(t):o.start("animate")},[o,e]),d=(0,F.useCallback)(e=>{s.current?t?.(e):o.start("normal")},[o,t]);return(0,W.jsx)("div",{className:(0,O.cn)(i),onMouseEnter:l,onMouseLeave:d,...a,children:(0,W.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,W.jsx)(j.motion.path,{variants:{normal:{y:0},animate:{y:-2}},transition:_,animate:o,initial:"normal",d:"m7 20 5-5 5 5"}),(0,W.jsx)(j.motion.path,{variants:{normal:{y:0},animate:{y:2}},transition:_,animate:o,initial:"normal",d:"m7 4 5 5 5-5"})]})})});z.displayName="ChevronsDownUpIcon",e.s(["ChevronsDownUpIcon",0,z],481147);let $={type:"spring",stiffness:250,damping:25},P=(0,F.forwardRef)(({onMouseEnter:e,onMouseLeave:t,className:i,size:n=28,...a},r)=>{let o=(0,U.useAnimation)(),s=(0,F.useRef)(!1);(0,F.useImperativeHandle)(r,()=>(s.current=!0,{startAnimation:()=>o.start("animate"),stopAnimation:()=>o.start("normal")}));let l=(0,F.useCallback)(t=>{s.current?e?.(t):o.start("animate")},[o,e]),d=(0,F.useCallback)(e=>{s.current?t?.(e):o.start("normal")},[o,t]);return(0,W.jsx)("div",{className:(0,O.cn)(i),onMouseEnter:l,onMouseLeave:d,...a,children:(0,W.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,W.jsx)(j.motion.path,{variants:{normal:{y:0},animate:{y:2}},transition:$,animate:o,initial:"normal",d:"m7 15 5 5 5-5"}),(0,W.jsx)(j.motion.path,{variants:{normal:{y:0},animate:{y:-2}},transition:$,animate:o,initial:"normal",d:"m7 9 5-5 5 5"})]})})});P.displayName="ChevronsUpDownIcon",e.s(["ChevronsUpDownIcon",0,P],609881)},865124,e=>{"use strict";var t=e.i(713201);let i=[/^diff --git /,/^index [0-9a-f]{7,}/,/^\\ No newline at end of file/,/^new file mode /,/^deleted file mode /,/^similarity index /,/^rename from /,/^rename to /],n=/^@@\s*-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s*@@/,a=/^---\s+(?:a\/|b\/|\/dev\/null)/,r=/^\+\+\+\s+(?:a\/|b\/|\/dev\/null)/,o=e=>e&&0!==e.length?e:"/dev/null",s=(e,t)=>"/dev/null"===e?e:e.startsWith("a/")||e.startsWith("b/")?`${t}/${e.slice(2)}`:`${t}/${e}`,l=e=>{let t=e.lines??[];if(t.length>0){let i=!(t[0]??"").startsWith("@@"),n=`@@ -${e.oldStart??0},${e.oldLines??0} +${e.newStart??0},${e.newLines??0} @@`;return(i?[n,...t]:t).join("\n")}return e.content&&e.content.trim().length>0?e.content.trimEnd():""},d=e=>{if(0===e.hunkContent.length)return!1;let t=!1,i=!1,n=!1;for(let a of e.hunkContent)switch(a.type){case"context":a.lines.length>0&&(t=!0);break;case"change":a.additions.length>0&&(i=!0),a.deletions.length>0&&(n=!0);break;default:return a}return!t&&(!i||!n)&&(!!i&&1!==e.additionStart||!!n&&1!==e.deletionStart)||!1},f=e=>e.lines&&e.lines.length>0?e.lines:e.content&&e.content.length>0?e.content.split("\n"):[],h=e=>{let t=e.match(n);if(!t)return null;let i=Number(t[1]),a=Number(t[2]);return Number.isFinite(i)&&Number.isFinite(a)?{oldStart:i,newStart:a}:null},c=e=>!!(a.test(e)||r.test(e))||i.some(t=>t.test(e)),u=e=>{let t=[],i=[];for(let n of e)for(let e of f(n)){if(e.startsWith("@@")||c(e))continue;if(e.startsWith("-")){t.push(e.substring(1));continue}if(e.startsWith("+")){i.push(e.substring(1));continue}let n=e.startsWith(" ")?e.substring(1):e;t.push(n),i.push(n)}return{originalText:t.join("\n"),modifiedText:i.join("\n")}},p=e=>{let t=new Map,i=new Map;for(let n of e){let e=n.oldStart??1,a=n.newStart??1;for(let r of f(n)){if(r.startsWith("@@")){let t=h(r);t&&(e=t.oldStart,a=t.newStart);continue}if(c(r))continue;if(r.startsWith("-")){i.set(e,r.substring(1)),e+=1;continue}if(r.startsWith("+")){t.set(a,r.substring(1)),a+=1;continue}let n=r.startsWith(" ")?r.substring(1):r;i.set(e,n),t.set(a,n),e+=1,a+=1}}return{additions:t,deletions:i}},m=e=>{if(!e.chunks||0===e.chunks.length)return null;let i=e.chunks.map(l).filter(e=>e.length>0);if(0===i.length)return null;let n=o(e.from),a=o(e.to),r="/dev/null"!==a?a:"/dev/null"!==n?n:"unknown",f=[`diff --git ${s("/dev/null"===n?r:n,"a")} ${s("/dev/null"===a?r:a,"b")}`,`--- ${s(n,"a")}`,`+++ ${s(a,"b")}`,...i].join("\n")+"\n";try{let e=(0,t.parsePatchFiles)(f),i=e[0]?.files?.[0]??null;if(!i||1===i.hunks.length&&d(i.hunks[0]))return null;return i}catch{return null}};function g(e){let t=e.trim();return"/dev/null"===t?"/dev/null":t.startsWith("a/")||t.startsWith("b/")?t.slice(2):t}let v=/^\s*([^\s:]+?)(?::(\d+)\s*(?:-|\u2013|\u2014|\.\.)\s*(\d+))?(?:\s+(.+))?\s*$/;e.s(["buildDiffLineLookupFromChunks",0,p,"buildTourDiffFenceFromRef",0,function(e,t){let i,n=function(e,t){if(void 0===t.diffs)return;let i=e.file,n=e.previousFile??e.file;for(let e of t.diffs)if((e.to??"")===i)return e;for(let e of t.diffs)if((e.from??"")===n)return e;for(let e of t.diffs)if((e.to??"")===n||(e.from??"")===i)return e}(e,t);if(void 0===n)return null;let a=n.chunks??[];if(0===a.length)return null;if(void 0!==e.startLine&&void 0!==e.endLine&&e.endLine>=e.startLine){let t=e.startLine,n=e.endLine;0===(i=a.filter(e=>(function(e,t,i){let n=e.newStart??0,a=e.newLines??0;if(0===a){let n=e.oldStart??0;return n>=t&&n<=i}return n+Math.max(a,1)-1>=t&&n<=i})(e,t,n))).length&&(i=a)}else i=a;let r=m({from:n.from,to:n.to,chunks:i});if(null===r)return null;let{originalText:o,modifiedText:s}=u(i),l=p(i),d=0,f=0;for(let e of r.hunks)d+=e.additionCount??0,f+=e.deletionCount??0;let h=(n.to??"").trim(),c=(n.from??"").trim();return{fileName:h.length>0&&"/dev/null"!==h?h:c.length>0?c:e.file,fileDiffMetadata:r,lineLookup:l,originalText:o,modifiedText:s,addedLines:d,removedLines:f}},"extractPierreFileDiffFromChunks",0,m,"extractPierreFileDiffFromUnifiedDiff",0,(e,i)=>{let n=e.trimEnd();if(0===n.length)return null;let l=n.split("\n"),f=o(i||"file"),h=l.find(e=>/^diff --git /.test(e)),c=l.find(e=>a.test(e)),u=l.find(e=>r.test(e)),p=[/^index [0-9a-f]{7,}/,/^new file mode /,/^deleted file mode /,/^similarity index /,/^rename from /,/^rename to /],m=l.filter(e=>p.some(t=>t.test(e))),g=l.filter(e=>e!==h&&e!==c&&e!==u&&!p.some(t=>t.test(e))),v=[h??`diff --git ${s(f,"a")} ${s(f,"b")}`,...m,c??`--- ${s(f,"a")}`,u??`+++ ${s(f,"b")}`,...g],b=`${v.join("\n")}
`;try{let e=(0,t.parsePatchFiles)(b),i=e[0]?.files?.[0]??null;if(!i||1===i.hunks.length&&d(i.hunks[0]))return null;return i}catch{return null}},"extractTextFromChunks",0,u,"parseTourMarkdownDiffFence",0,function(e){let i=e.trim();if(!i)return null;let n=i;if(!/^diff --git /m.test(i)){let e=i.split("\n"),t=e.findIndex(e=>a.test(e)),o=e.findIndex(e=>r.test(e));if(t>=0&&o>=0){let a=e[t].trim().slice(4).trim(),r=e[o].trim().slice(4).trim(),s=g(a),l=g(r);n=`diff --git a/${"/dev/null"===s?l:s} b/${"/dev/null"===l?s:l}
${i}`}else{if(!e.some(e=>e.startsWith("@@")))return null;let t="tour-snippet";n=[`diff --git a/${t} b/${t}`,`--- a/${t}`,`+++ b/${t}`,i].join("\n")}}let o=n.endsWith("\n")?n:`${n}
`;try{let e=(0,t.parsePatchFiles)(o),i=e[0]?.files?.[0];if(!i||1===i.hunks.length&&d(i.hunks[0]))return null;let n=i.oldLines?.join("\n")??"",a=i.newLines?.join("\n")??"";if(0===n.length&&0===a.length&&0===i.hunks.length)return null;let r=i.name?.trim()&&i.name.length>0?i.name:"tour-snippet",s=0,l=0;for(let e of i.hunks)s+=e.additionCount??0,l+=e.deletionCount??0;return{fileName:r,fileDiffMetadata:i,lineLookup:p([{content:o}]),originalText:n,modifiedText:a,addedLines:s,removedLines:l}}catch{return null}},"parseTourMarkdownDiffRefFence",0,function(e){if("string"!=typeof e)return null;let t=e.trim();if(0===t.length)return null;let i=[];for(let e of t.split(/\r?\n/)){let t,n,a=e.trim();if(0===a.length||a.startsWith("#"))continue;let r=a.match(v);if(!r)continue;let o=r[1];if(!o||0===o.length)continue;let s=r[2],l=r[3],d=function(e){let t={};if(0===e.length)return t;let i=e.match(/(\w+)=("([^"]*)"|'([^']*)'|\S+)/g);if(!i)return t;for(let e of i){let i=e.indexOf("=");if(i<0)continue;let n=e.slice(0,i).trim(),a=e.slice(i+1).trim();(a.startsWith('"')&&a.endsWith('"')||a.startsWith("'")&&a.endsWith("'"))&&(a=a.slice(1,-1)),n.length>0&&(t[n]=a)}return t}(r[4]??"");if(void 0!==s&&void 0!==l){let e=Number(s),i=Number(l);Number.isFinite(e)&&Number.isFinite(i)&&e>0&&i>=e&&(t=e,n=i)}let f=void 0!==d.previousFile&&d.previousFile.length>0?d.previousFile:void 0!==d.prev&&d.prev.length>0?d.prev:void 0;i.push({file:o,previousFile:f,startLine:t,endLine:n})}return 0===i.length?null:i}])},459233,e=>{"use strict";e.s(["getLanguageFromFilePath",0,function(e){switch(e.split(".").pop()?.toLowerCase()){case"js":case"jsx":return"javascript";case"ts":case"tsx":return"typescript";case"py":return"python";case"java":return"java";case"cpp":case"cc":case"cxx":return"cpp";case"c":return"c";case"cs":return"csharp";case"php":return"php";case"rb":return"ruby";case"go":return"go";case"rs":return"rust";case"html":return"html";case"css":return"css";case"scss":return"scss";case"json":return"json";case"md":return"markdown";case"xml":return"xml";case"yaml":case"yml":return"yaml";case"sh":return"zsh";default:return"text"}}])},534524,e=>{"use strict";var t=e.i(991565),i=e.i(541158),n=e.i(40138),a=e.i(465185),r=e.i(335864),o=e.i(412540),s=e.i(569535),l=e.i(529296),d=e.i(993238),f=e.i(481147),h=e.i(609881),c=e.i(230034),u=e.i(865124),p=e.i(459233);let m=d.default.memo(({originalText:e,modifiedText:u,fileName:m="",fileDiff:g,lineLookup:v,height:b,className:y="",compact:x=!1,viewMode:k="split",onDidMountDiffEditor:w,onAddComment:E,hideUnmodifiedLineCounts:L=!1,hideLeadingSeparator:S=!1})=>{let[M,C]=(0,d.useState)(!x),[T,N]=(0,d.useState)(!1),[D,H]=(0,d.useState)(!1),A=(0,d.useRef)(null),F=(0,d.useRef)(null),R=(0,c.useIsMobileDevice)(),{resolvedTheme:I}=(0,l.useTheme)(),W=(0,d.useMemo)(()=>e.split("\n"),[e]),O=(0,d.useMemo)(()=>u.split("\n"),[u]),j=(0,d.useMemo)(()=>Math.max(0,O.length-W.length),[O,W]),U=(0,d.useMemo)(()=>Math.max(0,W.length-O.length),[W,O]),_=(0,d.useCallback)(async e=>{e.stopPropagation();try{await navigator.clipboard.writeText(m),N(!0),setTimeout(()=>N(!1),1500)}catch(e){console.error("Failed to copy filename:",e)}},[m]),z=(0,d.useMemo)(()=>({name:m,contents:e}),[m,e]),$=(0,d.useMemo)(()=>({name:m,contents:u}),[m,u]),P=(0,d.useMemo)(()=>(0,p.getLanguageFromFilePath)(m),[m]),B=(0,d.useMemo)(()=>{if(g)return P&&g.lang!==P?{...g,lang:P}:g},[g,P]);(0,d.useEffect)(()=>{let e=F.current;if(!e||!R)return;let t=e=>{e.stopPropagation()},i=e=>{e.stopPropagation()};return e.addEventListener("touchstart",t,{capture:!0}),e.addEventListener("touchmove",i,{capture:!0}),()=>{e.removeEventListener("touchstart",t,{capture:!0}),e.removeEventListener("touchmove",i,{capture:!0})}},[R]);let G=(0,d.useCallback)(e=>{if(!e||!E)return;let t="deletions"===e.side?"deletions":"additions",i=e.endSide?"deletions"===e.endSide?"deletions":"additions":t,n=Math.min(e.start,e.end),a=Math.max(e.start,e.end),r="additions"===t?O:W,o="additions"===t?v?.additions:v?.deletions,s=r.slice(n-1,a);if(o){s=[];for(let e=n;e<=a;e+=1){let t=o.get(e);void 0!==t&&s.push(t)}}E({fileName:m,startLine:n,endLine:a,side:t,endSide:i,comment:"",lines:s})},[v,E,m,W,O]),q=(0,d.useRef)(G);(0,d.useEffect)(()=>{q.current=G},[G]);let V=(0,d.useCallback)(e=>{q.current(e)},[]),K=(0,d.useMemo)(()=>({disableLineNumbers:R,overflow:R?"scroll":"wrap",diffStyle:k,expandUnchanged:!1,diffIndicators:"bars",disableBackground:!1,hunkSeparators:"line-info",lineDiffType:"word-alt",maxLineDiffLength:1e3,maxLineLengthForHighlighting:1e3,disableFileHeader:!0,lang:P,unsafeCSS:`pre { --diffs-bg: var(--bg-elevated) !important; background: var(--bg-elevated) !important; } [data-separator-content] { background: var(--bg-tertiary) !important; } [data-expand-button] { background: var(--bg-tertiary) !important; } [data-separator='line-info'][data-separator-last] { margin-bottom: var(--diffs-gap-block, var(--diffs-gap-fallback, 8px)) !important; } /* We render our own file header above the diff; remove the library's default top padding so the diff content hugs the header. */ [data-code] { padding-top: 0 !important; } [data-diffs][data-type='split'][data-overflow='wrap'] { padding-top: 0 !important; } /* But if the first visible row is the "unmodified lines" expander, add back the top spacing so it matches the side padding. */ [data-separator='line-info'][data-separator-first] [data-separator-wrapper] { margin-top: var(--diffs-gap-inline, var(--diffs-gap-block, var(--diffs-gap-fallback, 8px))) !important; } [data-separator-first] [data-expand-down] [data-icon] { transform: scaleY(-1); } [data-separator-last] [data-expand-up] [data-icon] { transform: none; }${L?" /* Opt-in (currently used by CommentThreadDiff): hide the \"N unmodified lines\" label on line-info separators. The expand buttons live in a sibling [data-separator-wrapper] so they stay visible and clickable. The library renders into a shadow root, so this rule must be injected via unsafeCSS rather than scoped via outer .comment-thread-diff selectors. */ [data-separator='line-info'] [data-separator-content] { display: none !important; }":""}${S?" [data-separator='line-info'][data-separator-first] { display: none !important; }":""}`,enableHoverUtility:!!E,enableLineSelection:!!E,onLineSelectionEnd:E?V:void 0,themeType:"light"===I?"light":"dark"}),[R,P,k,E,V,I,L,S]),X=(0,d.useCallback)(e=>E?(0,t.jsx)("div",{className:"pointer-events-none flex h-4 w-4 translate-x-0.5 translate-y-0.5 items-center justify-center rounded border border-tertiary bg-quaternary-opaque text-secondary shadow-sm transition-colors",title:"Click to add this line to the input",children:(0,t.jsx)(s.Plus,{size:12})}):null,[E]);return e===u&&void 0===g?(0,t.jsx)("div",{className:"flex flex-col gap-0",children:(0,t.jsx)("div",{className:(0,i.cn)(M?"border-transparent":"border border-white/10",y),children:(0,t.jsx)("div",{className:"flex items-center justify-between px-2 py-1",children:(0,t.jsx)("div",{className:"flex min-w-0 flex-1 items-center gap-1",children:(0,t.jsx)("span",{className:"flex flex-shrink-0 items-center gap-1 text-base text-white/30",children:"No content changes"})})})})}):x?(0,t.jsx)("div",{className:"flex flex-col gap-0",children:(0,t.jsxs)("div",{className:`bg-[#17191d] ${!M?"cursor-pointer":""} border border-gray-500/10 ${y}`,onClick:()=>{M||C(!0)},onMouseEnter:()=>{R||H(!0)},onMouseLeave:()=>{R||H(!1)},children:[(0,t.jsxs)("div",{className:`flex items-center justify-between px-1 py-1 pl-2 ${M?"cursor-pointer":""}`,onClick:()=>{M&&C(!1)},onMouseEnter:()=>A.current?.startAnimation(),onMouseLeave:()=>A.current?.stopAnimation(),children:[(0,t.jsxs)("div",{className:"flex min-w-0 flex-1 items-center gap-1",children:[(0,t.jsx)("div",{className:"min-w-0 flex-shrink truncate text-xs font-medium text-gray-300",children:m}),j>0&&(0,t.jsxs)("span",{className:"diff-addition-text flex flex-shrink-0 items-center gap-1 text-xs",children:["+",j]}),U>0&&(0,t.jsxs)("span",{className:"diff-deletion-text flex flex-shrink-0 items-center gap-1 text-xs",children:["-",U]}),m&&(0,t.jsx)("button",{onClick:_,className:`ml-1 flex items-center justify-center rounded p-1 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 ${D||T||R&&M?"opacity-100":"opacity-0"}`,"aria-label":"Copy file name",children:T?(0,t.jsx)(r.Check,{size:12,className:"text-gray-300"}):(0,t.jsx)(o.Copy,{size:12})})]}),(0,t.jsx)("div",{className:"flex items-center gap-1",children:(0,t.jsx)("button",{className:"flex items-center justify-center rounded p-1 text-white/60 transition-colors hover:bg-white/5","aria-label":"Expand diff",children:M?(0,t.jsx)(f.ChevronsDownUpIcon,{ref:A,size:16}):(0,t.jsx)(h.ChevronsUpDownIcon,{ref:A,size:16})})})]}),M&&(0,t.jsx)("div",{className:`precision-diff-root overflow-hidden rounded-bl-lg rounded-br-lg ${R?"precision-diff-mobile-hover-overrides":""} ${y}`,style:{height:b||"auto"},ref:F,children:B?(0,t.jsx)(n.FileDiff,{fileDiff:B,options:K,renderHoverUtility:E?X:void 0}):(0,t.jsx)(a.MultiFileDiff,{oldFile:z,newFile:$,options:K,renderHoverUtility:E?X:void 0})})]})}):(0,t.jsx)("div",{className:`precision-diff-root flex flex-col ${R?"precision-diff-mobile-hover-overrides":""} ${y}`,style:{height:b||"100%"},children:(0,t.jsx)("div",{className:"bg-theme-card flex-1 overflow-auto",ref:F,children:B?(0,t.jsx)(n.FileDiff,{fileDiff:B,options:K,renderHoverUtility:E?X:void 0}):(0,t.jsx)(a.MultiFileDiff,{oldFile:z,newFile:$,options:K,renderHoverUtility:E?X:void 0})})})},(e,t)=>e.originalText===t.originalText&&e.modifiedText===t.modifiedText&&e.fileName===t.fileName&&e.fileDiff===t.fileDiff&&e.lineLookup===t.lineLookup&&e.height===t.height&&e.className===t.className&&e.compact===t.compact&&e.viewMode===t.viewMode&&e.hideUnmodifiedLineCounts===t.hideUnmodifiedLineCounts&&e.hideLeadingSeparator===t.hideLeadingSeparator&&!!e.onAddComment==!!t.onAddComment),g=d.default.memo(({diffString:e,fileName:i="",chunkIndex:n,compact:a=!1,includeBottomMargin:r=!0,hideLeadingSeparator:o=!1})=>{let s=(0,d.useMemo)(()=>(0,u.extractPierreFileDiffFromUnifiedDiff)(e,i),[e,i]),{originalLines:l,modifiedLines:f}=(0,d.useMemo)(()=>{let t,i,n;return t=[],i=[],n=[/^diff --git /,/^index [0-9a-f]{7,}/,/^--- /,/^\+\+\+ /,/^@@/,/^\\ No newline at end of file/],e.split("\n").forEach(e=>{if(!n.some(t=>t.test(e)))if(e.startsWith("-"))t.push(e.slice(1));else if(e.startsWith("+"))i.push(e.slice(1));else{let n=e.startsWith(" ")?e.slice(1):e;t.push(n),i.push(n)}}),{originalLines:t,modifiedLines:i}},[e]),h=l.join("\n"),c=f.join("\n");return(0,t.jsx)("div",{className:r?"mb-4":"",children:(0,t.jsx)(m,{originalText:h,modifiedText:c,fileName:i,compact:a,fileDiff:s??void 0,viewMode:"unified",hideLeadingSeparator:o})},n)});g.displayName="PrecisionDiffChunk",e.s(["PrecisionDiffChunk",0,g,"PrecisionDiffViewer",0,m])}]);