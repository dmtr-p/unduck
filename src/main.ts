import { bangs } from "./bang";
import "./global.css";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const template = document.querySelector<HTMLTemplateElement>("template")!;
  const content = template.content.cloneNode(true) as DocumentFragment;

  app.innerHTML = "";
  app.appendChild(content);
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;
  const searchForm = app.querySelector<HTMLFormElement>(".search-form")!;
  const searchInput = app.querySelector<HTMLInputElement>(".search-input")!;

  urlInput.value = `${window.location.origin}/?q=%s`;
  searchInput.focus();

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.location.href = url.toString();
  });

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";
    copyButton.classList.add("copied");

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
      copyButton.classList.remove("copied");
    }, 2000);
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs[LS_DEFAULT_BANG as keyof typeof bangs];

function getBangRedirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang =
    bangs[bangCandidate as keyof typeof bangs] ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangRedirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
