document.addEventListener("DOMContentLoaded", () => {
  // --- GLOBAL STATE & CONFIG ---
  let CONFIG = {};
  let FILE_SYSTEM = {};
  let currentLang = "en";
  let availableLangs = [];
  let currentPath = [];
  let historyStack = [];

  // --- DOM ELEMENTS ---
  const getEl = (id) => document.getElementById(id);
  const desktop = getEl("desktop");
  const allWindows = document.querySelectorAll(".window");
  const folderWindow = {
    el: getEl("folderWindow"),
    title: getEl("folderWindow").querySelector(".title-bar-title"),
    body: getEl("folderWindow").querySelector(".window-body"),
    backBtn: getEl("backButton"),
    addressBar: getEl("addressBar"),
  };
  const textViewerWindow = {
    el: getEl("textViewerWindow"),
    title: getEl("textViewerWindow").querySelector(".title-bar-title"),
    body: getEl("textViewerWindow").querySelector(".text-viewer-body"),
  };
  const imageViewerWindow = {
    el: getEl("imageViewerWindow"),
    title: getEl("imageViewerWindow").querySelector(".title-bar-title"),
    img: getEl("imageViewerContent"),
  };
  const gameWindow = {
    el: getEl("gameWindow"),
    title: getEl("gameWindow").querySelector(".title-bar-title"),
    frame: getEl("gameFrame"),
  };
  const settingsWindow = {
    el: getEl("settingsWindow"),
    title: getEl("settingsWindow").querySelector(".title-bar-title"),
  };
  const videoViewerWindow = {
    el: getEl("videoViewerWindow"),
    title: getEl("videoViewerWindow").querySelector(".title-bar-title"),
    video: getEl("videoViewerContent"),
  };
  const iframeViewerWindow = {
    el: getEl("iframeViewerWindow"),
    title: getEl("iframeViewerWindow").querySelector(".title-bar-title"),
    frame: getEl("iframeViewerContent"),
  };
  const clock = getEl("clock");
  const startButton = getEl("startButton");
  const startMenu = getEl("startMenu");
  const languageSwitcher = getEl("languageSwitcher");
  const languageDropdown = getEl("languageDropdown");
  const taskbarApps = getEl("taskbar-apps");

  const windowObjects = [
    folderWindow,
    textViewerWindow,
    imageViewerWindow,
    gameWindow,
    settingsWindow,
    videoViewerWindow,
    iframeViewerWindow,
  ];

  // --- ICONS ---
  const ICONS1 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" fill="#4285F4" viewBox="0 0 48 48"><path d="M40 8H24l-4-4H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z" fill="#90a4ae"/><path d="M34 4v10h8L34 6z" fill="#cfd8dc"/><path d="M18 22h12v2H18zm0 6h12v2H18zm0 6h8v2h-8z" fill="#7f8c8d"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z" fill="#2196f3"/><path d="M34 4v10h8L34 6z" fill="#bbdefb"/><path d="m32 27-6 8-5-6-7 9h26l-8-11z" fill="#0572a9ff"/></g></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z" fill="#ff9800"/><path d="M34 4v10h8L34 6z" fill="#ffcc80"/><path d="M21 23h6v-6h-6v6zm0 12h6v-6h-6v6zm-6-6h6v-6H15v6zm12 0h6v-6h-6v6z" fill="#795548"/></g></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z" fill="#E53935"/><path d="M34 4v10h8L34 6z" fill="#FFCDD2"/><path d="M19 34V18l12 7-12 8z" fill="#B71C1C"/></g></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z" fill="#039BE5"/><path d="M34 4v10h8L34 6z" fill="#B3E5FC"/><g fill="none" stroke="#01579B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 36c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zM16 28h16M24 20c-2.21 2.67-2.21 9.33 0 16"/></g></g></svg>`,
  };

  const ICONS2 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M40 12H24l-4-4H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4z"/><path fill="#FFCA28" d="M40 12H8.1l-4.1 24H44V16c0-2.21-1.79-4-4-4z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#CFD8DC" d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z"/><path fill="#ECEFF1" d="M34 4v10h8L34 6z"/><path fill="#90A4AE" d="M18 24h12v2H18zm0 6h12v2H18zm0 6h8v2h-8z"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4CAF50" d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z"/><path fill="#A5D6A7" d="M34 4v10h8L34 6z"/><path fill="#2E7D32" d="m32 27-6 8-5-6-7 9h26l-8-11z"/></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#F44336" d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z"/><path fill="#FFCDD2" d="M34 4v10h8L34 6z"/><path fill="#C62828" d="M18.6 33l-3.6-2.1 6-10.2 3.6 2.1-6 10.2zm12-12l-6-3.5-2.4 4.1 6 3.5 2.4-4.1z"/></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#2196F3" d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z"/><path fill="#BBDEFB" d="M34 4v10h8L34 6z"/><path fill="#0D47A1" d="M19 34V18l12 7-12 8z"/></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#9C27B0" d="M38 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8z"/><path fill="#E1BEE7" d="M34 4v10h8L34 6z"/><path fill="#4A148C" d="M24 36c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zM16 28h16M24 20c-2.21 2.67-2.21 9.33 0 16"/></svg>`,
  };

  const ICONS3 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6b7280"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 015.25 7.5h13.5a2.25 2.25 0 012.25 2.25m-18 0v6.75a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V9.75M6 7.5h.008v.008H6V7.5z" /></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6b7280"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6b7280"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm16.5-1.5H3.75" /></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6b7280"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h3.75c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 16.875v-3.75zM12 15.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-3.75A1.125 1.125 0 0112 19.125v-3.75zM12 3.75c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-3.75A1.125 1.125 0 0112 7.5V3.75zM4.5 3.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM4.5 6.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM4.5 9.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" /></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6b7280"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6b7280"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25l-9 9m9-3.75l-6 6" /></svg>`,
  };

  const ICONS4 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFC107"><path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E8EAF6"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-14zM18 20H6v-4.58l3.42 3.42 5.16-5.16L18 17.58V20zM18 14l-3-3.01-3 3.01L6 8l3.01-3.01L12 8l6 6z"/></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F44336"><path d="M21 6H3v12h18V6zm-9 2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.88 9.5 8.5 10.62 6 12 6zm-5.5 1.5h3v1h-3v-1zm0 3h3v1h-3v-1zm10 0h3v1h-3v-1z"/></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2196F3"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM12 15l-4-4h8l-4 4z"/></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9C27B0"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-5-3h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>`,
  };

  const ICONS5 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V7l-4-4H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`,
  };

  const ICONS6 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="folder-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#FDD835;stop-opacity:1" /><stop offset="100%" style="stop-color:#FBC02D;stop-opacity:1" /></linearGradient></defs><path fill="url(#folder-gradient)" d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="file-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#CFD8DC;stop-opacity:1" /><stop offset="100%" style="stop-color:#90A4AE;stop-opacity:1" /></linearGradient></defs><path fill="url(#file-gradient)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="image-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#81C784;stop-opacity:1" /><stop offset="100%" style="stop-color:#4CAF50;stop-opacity:1" /></linearGradient></defs><path fill="url(#image-gradient)" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-14zM18 20H6v-4.58l3.42 3.42 5.16-5.16L18 17.58V20zM18 14l-3-3.01-3 3.01L6 8l3.01-3.01L12 8l6 6z"/></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="game-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#E57373;stop-opacity:1" /><stop offset="100%" style="stop-color:#F44336;stop-opacity:1" /></linearGradient></defs><path fill="url(#game-gradient)" d="M21 6H3v12h18V6zm-9 2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.88 9.5 8.5 10.62 6 12 6zm-5.5 1.5h3v1h-3v-1zm0 3h3v1h-3v-1zm10 0h3v1h-3v-1z"/></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="video-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#64B5F6;stop-opacity:1" /><stop offset="100%" style="stop-color:#2196F3;stop-opacity:1" /></linearGradient></defs><path fill="url(#video-gradient)" d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM12 15l-4-4h8l-4 4z"/></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="iframe-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#BA68C8;stop-opacity:1" /><stop offset="100%" style="stop-color:#9C27B0;stop-opacity:1" /></linearGradient></defs><path fill="url(#iframe-gradient)" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-5-3h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>`,
  };

  const ICONS7 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm-2 4h18" /></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h12M9 9l-3 3 3 3m6-6l3 3-3 3" /><circle cx="12" cy="12" r="10" /></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" /><path d="M12 12L8 8m8 8l-4-4" /></svg>`,
  };

  const ICONS8 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#607D8B"><path d="M20 6h-8l-2-2H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.1-.89-2-2-2z" /></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#B0BEC5"><polygon points="14,2 6,2 6,22 18,22 18,8" /><polygon points="13,9 18,9 13,4" /></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#78909C"><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="10" cy="10" r="3" /><path d="M14.99 15.5l-3.5-3.5-3.5 3.5h7z" /></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#546E7A"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" /></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#455A64"><path d="M10 16.5v-9l6 4.5-6 4.5zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" /></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#37474F"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 16H5V5h14v14z" /><path d="M8 11h8v2H8z" /></svg>`,
  };

  const ICONS9 = {
    folder: `<svg xmlns="http://www.w3.org/2000/svg" fill="#90A4AE" viewBox="0 0 24 24"><path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" fill="#424242" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" fill="#616161" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-14zM18 20H6v-4.58l3.42 3.42 5.16-5.16L18 17.58V20zM18 14l-3-3.01-3 3.01L6 8l3.01-3.01L12 8l6 6z" /></svg>`,
    game: `<svg xmlns="http://www.w3.org/2000/svg" fill="#757575" viewBox="0 0 24 24"><path d="M21 6H3v12h18V6zm-9 2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.88 9.5 8.5 10.62 6 12 6zm-5.5 1.5h3v1h-3v-1zm0 3h3v1h-3v-1zm10 0h3v1h-3v-1z" /></svg>`,
    video: `<svg xmlns="http://www.w3.org/2000/svg" fill="#BDBDBD" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM12 15l-4-4h8l-4 4z" /></svg>`,
    iframe: `<svg xmlns="http://www.w3.org/2000/svg" fill="#EEEEEE" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-5-3h-2v-2h2v2zm0-4h-2V8h2v4z" /></svg>`,
  };

  const ALL_ICON_PACKS = [
    ICONS1,
    ICONS2,
    ICONS3,
    ICONS4,
    ICONS5,
    ICONS6,
    ICONS7,
    ICONS8,
    ICONS9,
  ];

  let ICONS = {};

  // --- UTILITIES & HELPERS ---
  const logError = (...args) => console.error("[App]", ...args);
  const getQuestPath = () =>
    new URLSearchParams(window.location.search).get("config") || "demo.json";
  const getLangString = (key, fallback = key) =>
    CONFIG.localization?.[currentLang]?.[key] ||
    CONFIG.localization?.["en"]?.[key] ||
    fallback;

  const getLocalizedName = (key) => {
    const systemNames = getLangString("systemNames", {});
    if (systemNames[key]) return systemNames[key];

    const folderMatch = key.match(/^folder_(\d+)$/);
    if (folderMatch) {
      const template = getLangString("folderNameTemplate", "Folder {}");
      return template.replace("{}", folderMatch[1]);
    }

    return key;
  };

  /**
   * Recursively processes the file system to generate folders based on the `generateFolders` property.
   * @param {object} object - The current node in the file system to process.
   */
  const processGeneratedFolders = (object) => {
    // Loop through each key in the current object level (e.g., "PC", "C_DRIVE")
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const item = object[key];

        if (item && typeof item === "object") {
          // If the item is a folder with the generateFolders property, generate them.
          if (
            item.type === "folder" &&
            typeof item.generateFolders === "number" &&
            item.generateFolders > 0
          ) {
            if (!item.children) {
              item.children = {};
            }
            for (let i = 1; i <= item.generateFolders; i++) {
              const folderName = `folder_${i}`;
              if (!item.children[folderName]) {
                item.children[folderName] = {
                  type: "folder",
                  children: {},
                };
              }
            }
          }

          // If the item has children, recurse into them.
          // This is now outside the "type" check, allowing it to traverse the whole tree.
          if (item.children) {
            processGeneratedFolders(item.children);
          }
        }
      }
    }
  };

  // --- WINDOW MANAGEMENT ---
  const setActiveWindow = (winEl) => {
    allWindows.forEach((win) => {
      win.classList.remove("active");
      win.style.zIndex = 998;
    });
    if (winEl) {
      winEl.classList.add("active");
      winEl.style.zIndex = 999;
    }
  };

  const openWindow = (winObj, title) => {
    winObj.el.classList.remove("hidden");
    winObj.el.dataset.minimized = "false";
    setActiveWindow(winObj.el);
    if (title) winObj.title.textContent = title;
    updateTaskbar();
  };

  const closeWindow = (winObj) => {
    winObj.el.classList.add("hidden");
    winObj.el.dataset.minimized = "false";
    if (winObj.el.classList.contains("maximized"))
      winObj.el.classList.remove("maximized");

    if (winObj.video) {
      winObj.video.pause();
      winObj.video.src = "";
    }
    if (winObj.frame) {
      winObj.frame.src = "about:blank";
    }

    if (winObj === folderWindow) {
      currentPath = [];
      historyStack = [];
    }
    updateTaskbar();
  };

  const handleMinimize = (winObj) => {
    winObj.el.classList.add("hidden");
    winObj.el.dataset.minimized = "true";
    updateTaskbar();
  };

  const handleMaximize = (winObj) => {
    const winEl = winObj.el;
    if (winEl.classList.contains("maximized")) {
      const old = winEl.dataset.oldPosition.split(",");
      winEl.style.left = old[0];
      winEl.style.top = old[1];
      winEl.style.width = old[2];
      winEl.style.height = old[3];
      winEl.classList.remove("maximized");
    } else {
      winEl.dataset.oldPosition = `${winEl.style.left},${winEl.style.top},${winEl.offsetWidth}px,${winEl.offsetHeight}px`;
      winEl.classList.add("maximized");
    }
  };

  const makeDraggable = (windowEl) => {
    const titleBarEl = windowEl.querySelector(".title-bar");
    if (!titleBarEl) return;
    let isDragging = false,
      offsetX,
      offsetY;
    const dragStart = (e) => {
      if (
        e.target.closest("button") ||
        windowEl.classList.contains("maximized")
      )
        return;
      isDragging = true;
      const event = e.type === "touchstart" ? e.touches[0] : e;
      offsetX = event.clientX - windowEl.offsetLeft;
      offsetY = event.clientY - windowEl.offsetTop;
      document.body.style.cursor = "move";
      setActiveWindow(windowEl);
    };
    const dragMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        const event = e.type === "touchmove" ? e.touches[0] : e;
        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;
        const taskbarHeight = 48;
        const desktopRect = desktop.getBoundingClientRect();
        newX = Math.max(
          -windowEl.offsetWidth + 120,
          Math.min(newX, desktopRect.width - 120)
        );
        newY = Math.max(
          0,
          Math.min(newY, desktopRect.height - taskbarHeight - 30)
        );
        windowEl.style.left = `${newX}px`;
        windowEl.style.top = `${newY}px`;
      }
    };
    const dragEnd = () => {
      isDragging = false;
      document.body.style.cursor = "default";
    };
    titleBarEl.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
    titleBarEl.addEventListener("touchstart", dragStart, { passive: false });
    document.addEventListener("touchmove", dragMove, { passive: false });
    document.addEventListener("touchend", dragEnd);
    windowEl.addEventListener("mousedown", () => setActiveWindow(windowEl));
  };

  // --- TASKBAR ---
  const updateTaskbar = () => {
    taskbarApps.innerHTML = "";
    windowObjects.forEach((winObj) => {
      const win = winObj.el;
      if (
        !win.classList.contains("hidden") ||
        win.dataset.minimized === "true"
      ) {
        const appBtn = document.createElement("button");
        appBtn.className = "taskbar-app";
        appBtn.textContent = winObj.title.textContent;
        appBtn.onclick = () => {
          if (win.dataset.minimized === "true")
            openWindow(winObj, winObj.title.textContent);
          else if (win.classList.contains("active")) handleMinimize(winObj);
          else setActiveWindow(win);
        };
        taskbarApps.appendChild(appBtn);
      }
    });
  };

  // --- FILE SYSTEM & NAVIGATION ---
  const goBack = () => {
    if (historyStack.length > 0) {
      currentPath = historyStack.pop();
      renderFolderContents(currentPath);
    }
  };

  const getObjectByPath = (pathArray) => {
    let currentLevel = FILE_SYSTEM;
    for (const part of pathArray) {
      // Check if currentLevel has children and the part exists within it
      if (
        currentLevel.children &&
        typeof currentLevel.children[part] !== "undefined"
      ) {
        currentLevel = currentLevel.children[part];
      } else {
        // If not, maybe currentLevel *is* the children object
        if (typeof currentLevel[part] === "undefined") {
          logError(
            "Path not found. Failed at part:",
            part,
            "in path",
            pathArray
          );
          return null;
        }
        currentLevel = currentLevel[part];
      }
    }
    return currentLevel.children || currentLevel;
  };

  const renderFolderContents = (pathArray) => {
    const content = getObjectByPath(pathArray);
    folderWindow.body.innerHTML = "";
    if (!content) {
      folderWindow.body.innerHTML = `<p>${getLangString(
        "folderAccessError",
        "Cannot access this folder."
      )}</p>`;
      updateWindowTitleAndAddress();
      return;
    }

    const sortedKeys = Object.keys(content).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
    sortedKeys.forEach((key) => {
      const item = content[key];
      if (typeof item !== "object" || item === null) return; // Skip non-object entries

      const iconDiv = document.createElement("div");
      iconDiv.className = "folder-icon";
      iconDiv.tabIndex = 0;
      iconDiv.innerHTML = ICONS[item.type] || ICONS.file;
      const p = document.createElement("p");
      p.textContent = getLocalizedName(key);
      iconDiv.appendChild(p);
      iconDiv.addEventListener("dblclick", () =>
        handleItemDoubleClick(key, item)
      );
      folderWindow.body.appendChild(iconDiv);
    });
    updateWindowTitleAndAddress();
  };

  const handleItemDoubleClick = (key, item) => {
    const displayName = getLocalizedName(key);
    switch (item.type) {
      case "folder":
        historyStack.push([...currentPath]);
        currentPath.push(key);
        renderFolderContents(currentPath);
        break;
      case "file":
        openWindow(
          textViewerWindow,
          `${displayName} ${getLangString("notepadTitleSuffix")}`
        );
        const fileContent =
          item.content?.[currentLang] ||
          item.content?.["en"] ||
          (typeof item.content === "string"
            ? item.content
            : "Content not available in this language.");
        textViewerWindow.body.textContent = fileContent;
        break;
      case "image":
        openWindow(imageViewerWindow, displayName);
        imageViewerWindow.img.src = item.src || "";
        break;
      case "game":
        openWindow(gameWindow, displayName);
        if (item.src) gameWindow.frame.src = item.src;
        if (item.srcdoc) gameWindow.frame.srcdoc = item.srcdoc;
        break;
      case "video":
        openWindow(videoViewerWindow, displayName);
        videoViewerWindow.video.src = item.src || "";
        break;
      case "iframe":
        openWindow(iframeViewerWindow, displayName);
        if (item.src) iframeViewerWindow.frame.src = item.src;
        if (item.srcdoc) iframeViewerWindow.frame.srcdoc = item.srcdoc;
        break;
      default:
        logError("Unknown file type:", item.type);
    }
  };

  const updateWindowTitleAndAddress = () => {
    const displayPath = currentPath.map((p) => getLocalizedName(p));
    const title =
      displayPath.length > 0
        ? displayPath[displayPath.length - 1]
        : getLocalizedName("PC");
    folderWindow.title.textContent = title;
    folderWindow.addressBar.innerHTML = "";

    displayPath.forEach((part, index) => {
      const span = document.createElement("span");
      span.textContent = part;
      span.className = "breadcrumb-part";
      span.onclick = () => {
        historyStack.push([...currentPath]);
        currentPath = currentPath.slice(0, index + 1);
        renderFolderContents(currentPath);
      };
      folderWindow.addressBar.appendChild(span);
      if (index < displayPath.length - 1) {
        const separator = document.createElement("span");
        separator.className = "breadcrumb-separator";
        separator.textContent = ` ${getLangString("addressSeparator")} `;
        folderWindow.addressBar.appendChild(separator);
      }
    });
    folderWindow.addressBar.scrollLeft = folderWindow.addressBar.scrollWidth;
    updateTaskbar();
  };

  const openRootExplorer = () => {
    currentPath = ["PC"];
    historyStack = [];
    openWindow(folderWindow);
    renderFolderContents(currentPath);
  };

  // --- UI & APP LIFECYCLE ---
  const updateClock = () => {
    if (clock)
      clock.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  };
  const setTheme = (themeName) =>
    (document.body.className = `${themeName}-theme`);

  const setLanguage = (langCode) => {
    if (!CONFIG.localization?.[langCode])
      return logError(`Language "${langCode}" not found.`);
    currentLang = langCode;
    const langConfig = CONFIG.localization[currentLang];
    document.documentElement.lang = currentLang;
    document.documentElement.dir = langConfig.rtl ? "rtl" : "ltr";
    languageSwitcher.textContent = langConfig.nativeName;
    translateUI();
  };

  const populateLanguageSwitcher = () => {
    languageDropdown.innerHTML = "";
    availableLangs.forEach((langCode) => {
      const lang = CONFIG.localization[langCode];
      const option = document.createElement("button");
      option.className = "language-option";
      option.textContent = lang.nativeName;
      option.onclick = () => {
        setLanguage(langCode);
        languageDropdown.classList.add("hidden");
      };
      languageDropdown.appendChild(option);
    });
  };

  const setIconSet = (index) => {
    const packIndex = parseInt(index, 10);
    if (ALL_ICON_PACKS[packIndex]) {
      ICONS = ALL_ICON_PACKS[packIndex];

      // Redraw UI elements that use icons
      setupDesktop();
      if (!folderWindow.el.classList.contains("hidden")) {
        renderFolderContents(currentPath);
      }
    }
  };

  const populateIconSetSelector = () => {
    const selector = getEl("iconSetSelector");
    selector.innerHTML = "";
    ALL_ICON_PACKS.forEach((pack, index) => {
      const option = document.createElement("option");
      option.value = index;
      // You can create more descriptive names if you want
      option.textContent = `Icon Set ${index + 1}`;
      selector.appendChild(option);
    });
  };

  const translateUI = () => {
    getEl("wallpaperOverlay").textContent = getLangString("welcomeText");
    getEl("startMenuTitle").textContent = getLangString("startMenuTitle");
    getEl("startMenuExplorer").textContent = getLangString("startExplorer");
    getEl("startMenuSettings").textContent = getLangString("startSettings");
    getEl("startMenuShutdown").textContent = getLangString("startShutdown");
    settingsWindow.title.textContent = getLangString("settingsWindowTitle");
    getEl("themeLabel").textContent = getLangString("themeLabel");
    getEl("iconSetLabel").textContent = getLangString("iconSetLabel");
    getEl("themeDarkOption").textContent = getLangString("themeDark");
    getEl("themeLightOption").textContent = getLangString("themeLight");
    imageViewerWindow.img.alt = getLangString("imagePreview");

    setupDesktop(); // Re-render desktop icons with new language
    if (!folderWindow.el.classList.contains("hidden"))
      renderFolderContents(currentPath);
    updateTaskbar();
  };

  const setupDesktop = () => {
    const desktopContainer = getEl("desktop");
    desktopContainer.innerHTML = ""; // Clear previous icons before re-rendering

    // --- START: MODIFICATION ---
    // Define the path to the desktop folder in the file system
    const desktopPath = ["PC", "C_DRIVE", "Users", "Admin", "Desktop"];
    const desktopContents = getObjectByPath(desktopPath);

    if (desktopContents) {
      Object.entries(desktopContents).forEach(([key, item]) => {
        // Skip non-object items and the FeatureDemo folder if it's already a desktop shortcut
        if (
          typeof item !== "object" ||
          item === null ||
          CONFIG.desktopItems.demoIcon.name === key
        )
          return;

        const iconEl = document.createElement("div");
        iconEl.className = "icon";
        iconEl.tabIndex = 0;
        iconEl.innerHTML = item.iconSVG || ICONS[item.type] || ICONS.file;
        const p = document.createElement("p");
        p.textContent = getLocalizedName(key);
        iconEl.appendChild(p);

        iconEl.addEventListener("dblclick", () => {
          // Construct the full path to the item
          const itemPath = [...desktopPath, key];
          currentPath = itemPath;
          historyStack = [];
          openWindow(folderWindow);
          renderFolderContents(currentPath);
        });
        desktopContainer.appendChild(iconEl);
      });
    }
    // --- END: MODIFICATION ---

    if (!CONFIG.desktopItems) return;

    Object.entries(CONFIG.desktopItems).forEach(([id, item]) => {
      const iconEl = document.createElement("div");
      iconEl.id = id;
      iconEl.className = "icon";
      iconEl.tabIndex = 0;
      if (item.style) Object.assign(iconEl.style, item.style);
      iconEl.innerHTML = item.iconSVG || ICONS[item.type] || ICONS.file;
      const p = document.createElement("p");
      p.textContent = getLocalizedName(item.name);
      iconEl.appendChild(p);
      iconEl.addEventListener("dblclick", () => {
        currentPath = [...(item.targetPath || [])];
        historyStack = [];
        openWindow(folderWindow);
        renderFolderContents(currentPath);
      });
      desktopContainer.appendChild(iconEl);
    });
  };

  const setupEventListeners = () => {
    windowObjects.forEach((win) => {
      const closeBtn = win.el.querySelector(".close-btn");
      const minBtn = win.el.querySelector(".minimize-btn");
      const maxBtn = win.el.querySelector(".maximize-btn");
      if (closeBtn) closeBtn.addEventListener("click", () => closeWindow(win));
      if (minBtn) minBtn.addEventListener("click", () => handleMinimize(win));
      if (maxBtn) maxBtn.addEventListener("click", () => handleMaximize(win));
    });

    folderWindow.backBtn.addEventListener("click", goBack);
    startButton.addEventListener("click", (e) => {
      e.stopPropagation();
      startMenu.classList.toggle("hidden");
    });
    languageSwitcher.addEventListener("click", (e) => {
      e.stopPropagation();
      languageDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (
        !startMenu.classList.contains("hidden") &&
        !startMenu.contains(e.target) &&
        e.target !== startButton
      )
        startMenu.classList.add("hidden");
      if (
        !languageDropdown.classList.contains("hidden") &&
        !languageDropdown
          .closest(".language-switcher-wrapper")
          .contains(e.target)
      )
        languageDropdown.classList.add("hidden");
    });

    getEl("startMenuExplorer").addEventListener("click", () => {
      startMenu.classList.add("hidden");
      openRootExplorer();
    });
    getEl("startMenuSettings").addEventListener("click", () => {
      startMenu.classList.add("hidden");
      openWindow(settingsWindow, getLangString("settingsWindowTitle"));
    });
    getEl("startMenuShutdown").addEventListener("click", () => {
      startMenu.classList.add("hidden");
      if (confirm(getLangString("shutdownConfirm"))) {
        document.body.innerHTML = "";
        document.body.style.backgroundColor = "black";
      }
    });
    getEl("themeSelector").addEventListener("change", (e) =>
      setTheme(e.target.value)
    );
    getEl("iconSetSelector").addEventListener("change", (e) => {
      setIconSet(e.target.value);
    });
  };

  const setupWelcomeScreen = () => {
    const welcomeConf = CONFIG.settings?.welcomeScreen;
    const wallpaperConf = CONFIG.settings?.wallpapers;
    const overlay = getEl("wallpaperOverlay");

    if (wallpaperConf?.loading)
      desktop.style.backgroundImage = `url('${wallpaperConf.loading}')`;

    if (welcomeConf?.enabled) {
      overlay.classList.remove("hidden");
      setTimeout(() => {
        overlay.classList.add("hidden");
        if (wallpaperConf?.default)
          desktop.style.backgroundImage = `url('${wallpaperConf.default}')`;
      }, welcomeConf.duration || 2500);
    } else {
      overlay.classList.add("hidden");
      if (wallpaperConf?.default)
        desktop.style.backgroundImage = `url('${wallpaperConf.default}')`;
    }
  };

  // --- APP ENTRY POINT ---
  const initApp = async () => {
    try {
      const response = await fetch(getQuestPath());
      if (!response.ok)
        throw new Error(
          `HTTP error ${response.status} fetching ${getQuestPath()}`
        );
      CONFIG = await response.json();

      FILE_SYSTEM = CONFIG.fileSystem;
      processGeneratedFolders(FILE_SYSTEM);
      currentLang = CONFIG.settings?.defaultLanguage || "en";
      availableLangs = Object.keys(CONFIG.localization || { en: {} });

      populateIconSetSelector(); // Create the dropdown options
      setIconSet(0); // Set the default icon pack to the first one

      setupEventListeners();
      populateLanguageSwitcher();
      setLanguage(currentLang);
      setupWelcomeScreen();

      updateClock();
      setInterval(updateClock, 30000);
      windowObjects.forEach((win) => makeDraggable(win.el));
    } catch (error) {
      logError("Fatal error during app initialization:", error);
      document.body.innerHTML = `<div style="color:red;background:black;height:100vh;padding:40px;"><h2>App Initialization Failed</h2><p>${error.message}</p></div>`;
    }
  };

  initApp();
});
