function dumpBookmarks() {
  const candidateNum = 20;
  chrome.bookmarks.getRecent(candidateNum).then(function (resp) {
    const bookmarkTreeNodes = resp;
    document.querySelector("#recent").append(dumpTreeNodes(bookmarkTreeNodes));
  });
}
// コールバック
// function dumpBookmarks() {
// const candidateNum = 20;
//   chrome.bookmarks.getRecent(candidateNum, function (bookmarkTreeNodes) {
//     document.querySelector("#recent").append(dumpTreeNodes(bookmarkTreeNodes));
//   });
// }

function dumpTreeNodes(bookmarkNodes) {
  let frag = document.createDocumentFragment();

  // bookmark barを除外
  const displayNum = 10;
  let j = 0;
  i = 0;
  while (j < displayNum) {
    if (bookmarkNodes[i].parentId !== "1") {
      frag.append(dumpNode(bookmarkNodes[i]));
      j++;
      i++;
    } else {
      i++;
    }
  }
  // bookmark barも含む（bookmarkNodes.length=candidateNum）
  // for (i = 0; i < bookmarkNodes.length; i++) {
  //   frag.append(dumpNode(bookmarkNodes[i]));
  // }

  return frag;
}

function dumpNode(bookmarkNode) {
  let list = bookmarkNode;
  let li;
  let anchor;
  li = document.createElement("li");

  li.classList.add(`m${i}`);

  const span = document.createElement("span");
  span.id = `tooltip${i}`;

  const stylespan = document.createElement("style");
  stylespan.innerHTML = `
  #tooltip${i} {
    display: none;
    position: absolute;
    background-color: #333;
    color: #ddd;
    margin-right: 10px;
    padding: 5px;
    border-radius: 3px;
    font-size: 10px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  #tooltip${i}.visible {
    opacity: 1;
  }
    `;
  document.body.appendChild(stylespan);

  anchor = document.createElement("a");
  anchor.classList.add(`data-tooltip${i}`);
  anchor.href = list.url;
  anchor.text = list.title;
  li.append(anchor, span);

  let faviconurl = list.url;
  const img = document.createElement("img");
  img.src = faviconURL(faviconurl);

  // icon並ぶ！
  // document.body.appendChild(img);

  const style = document.createElement("style");
  style.innerHTML = `
  .m${i} {
    list-style-image: url("${img.src}");
    }
  #recent a {
    top: -4px;
    position: relative;
  }
    `;
  document.body.appendChild(style);

  const tooltip = span;

  function showTooltip(text) {
    tooltip.style.display = "block";
    // 70文字数以上の場合に改行を挿入する
    const lineBreaks = 70;
    if (text.length > lineBreaks) {
      // 配列にして改行文字挿入
      text = [...text];
      text.splice(lineBreaks - 1, 0, "<br />");
      // 配列を文字列にもどす
      text = text.join("");
    }
    tooltip.innerHTML = text;
    setTimeout(() => {
      tooltip.classList.add("visible");
    }, 1000);
  }

  function hideTooltip() {
    tooltip.style.display = "none";
    tooltip.classList.remove("visible");
  }

  anchor.addEventListener("mouseover", function () {
    const text = list.url;
    showTooltip(text);
  });

  anchor.addEventListener("mouseout", function () {
    hideTooltip();
  });

  anchor.addEventListener("click", function () {
    chrome.tabs.create({ url: list.url });
  });

  return li;
}

// get favicon
function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u); // this encodes the URL as well
  url.searchParams.set("size", "16");
  return url.toString();
}

document.addEventListener("DOMContentLoaded", function () {
  dumpBookmarks();
});

// iconをクリック時に動的に生成
// const canvas = new OffscreenCanvas(16, 16);
// const context = canvas.getContext("2d");
// context.clearRect(0, 0, 16, 16);
// context.fillStyle = "#0000ff";
// context.fillRect(0, 0, 16, 16);
// const imageData = context.getImageData(0, 0, 16, 16);
// chrome.action.setIcon({imageData: imageData});
