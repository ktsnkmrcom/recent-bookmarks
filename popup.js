function recentBookmarks() {
  chrome.bookmarks.getRecent(10, function (bookmarkTreeNodes) {
    const frag = document.createDocumentFragment();

    for (const bookmarkNodes of bookmarkTreeNodes) {
      const li = document.createElement("li");
      const anchor = document.createElement("a");

      anchor.href = bookmarkNodes.url;
      anchor.text = bookmarkNodes.title;

      li.append(anchor);
      frag.append(li);

      anchor.addEventListener("click", function () {
        chrome.tabs.create({ url: bookmarkNodes.url });
      });
    }

    document.querySelector("#recent").append(frag);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  recentBookmarks();
});
