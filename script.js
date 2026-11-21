
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const opening = $("opening");
  const openHeart = $("openHeart");
  const openBtn = $("openBtn");
  const titleReveal = $("titleReveal");
  const birthday = $("birthday");

  const music = $("music");
  const musicBtn = $("musicBtn");

  const panels = [...document.querySelectorAll(".journey-panel")];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let invitationOpened = false;
  let musicPlaying = false;
  let treeStage = 0;

  // SECTION NAVIGATION
  function showPart(index) {
    if (index < 0 || index >= panels.length) return;

    panels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === index;

      panel.classList.toggle("hidden", !isActive);
      panel.classList.toggle("active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }

  // MUSIC CONTROLS
  function updateMusicButton() {
    if (!musicBtn) return;

    musicBtn.textContent = musicPlaying
      ? "♫ Music on"
      : "♫ Music off";

    musicBtn.setAttribute("aria-pressed", String(musicPlaying));
  }

  async function playMusic() {
    if (!music) return;

    try {
      await music.play();
      musicPlaying = true;
    } catch (error) {
      musicPlaying = false;
      console.warn("Music could not be played. Check music.mp3.", error);
    }

    updateMusicButton();
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", async () => {
      if (!music) return;

      if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        updateMusicButton();
      } else {
        await playMusic();
      }
    });
  }

  // OPENING AND TITLE REVEAL
  function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    playMusic();

    opening.style.opacity = "0";
    opening.style.transform = "scale(1.03)";
    opening.style.pointerEvents = "none";

    window.setTimeout(() => {
      opening.classList.add("hidden");

      titleReveal.classList.remove("hidden");
      titleReveal.setAttribute("aria-hidden", "false");
      titleReveal.style.opacity = "1";

      window.setTimeout(() => {
        titleReveal.style.transition = reducedMotion
          ? "none"
          : "opacity .8s ease";

        titleReveal.style.opacity = "0";

        window.setTimeout(() => {
          titleReveal.classList.add("hidden");
          titleReveal.setAttribute("aria-hidden", "true");

          birthday.classList.remove("hidden");
          showPart(0);
        }, reducedMotion ? 0 : 850);

      }, reducedMotion ? 500 : 2800);

    }, reducedMotion ? 0 : 650);
  }

  [openHeart, openBtn].forEach((button) => {
    if (button) {
      button.addEventListener("click", openInvitation);
    }
  });

  // NEXT SECTION BUTTONS
  document.querySelectorAll(".next-step").forEach((button) => {
    button.addEventListener("click", () => {
      const nextIndex = Number(button.dataset.next);

      if (Number.isInteger(nextIndex)) {
        showPart(nextIndex);
      }
    });
  });

  // BIRTHDAY WISH REVEAL
  const wishBtn = $("wishBtn");
  const secretWish = $("secretWish");

  if (wishBtn && secretWish) {
    wishBtn.addEventListener("click", () => {
      secretWish.classList.remove("hidden");
      wishBtn.textContent = "A little wish, just for you ♡";
      wishBtn.disabled = true;
    });
  }

  // INTERACTIVE GROWING TREE
  const growTreeBtn = $("growTreeBtn");
  const treeCanopy = $("treeCanopy");
  const branchLayer = $("branchLayer");
  const treeMessage = $("treeMessage");

  const treeMessages = [
    "Every beautiful friendship begins with a little seed. 🌱",
    "With every memory, our friendship grows stronger. 💗",
    "Through every season, may we continue growing together. 🌷",
    "No matter how much life changes, I hope this friendship stays. ♡",
    "Rooted in love, growing through life. 🌳"
  ];

  const leafPositions = [
    [160, 70], [120, 95], [195, 100], [90, 135],
    [150, 130], [220, 140], [115, 175], [180, 170],
    [245, 185], [75, 205], [145, 210], [205, 220],
    [105, 245], [175, 255], [235, 245], [135, 65],
    [205, 65], [55, 165], [265, 165], [160, 185]
  ];

  const treePaths = [
    "M160 330 L160 180",
    "M160 275 L115 235 L85 185",
    "M160 250 L205 215 L245 165",
    "M160 220 L125 180 L110 135",
    "M160 195 L190 155 L210 115",
    "M160 290 L115 270 L85 240",
    "M160 275 L205 245 L235 215",
    "M160 180 L155 135 L170 95"
  ];

  function addTreeLeaves(stage) {
    if (!treeCanopy) return;

    const leafCount = Math.min(stage * 4, leafPositions.length);
    treeCanopy.innerHTML = "";

    leafPositions.slice(0, leafCount).forEach(([x, y], index) => {
      const leaf = document.createElement("span");

      leaf.className = "tree-leaf";
      leaf.textContent = index % 3 === 0 ? "♥" : "♡";
      leaf.style.left = `${(x / 320) * 100}%`;
      leaf.style.top = `${(y / 360) * 100}%`;
      leaf.style.animationDelay = `${index * 0.04}s`;

      treeCanopy.appendChild(leaf);
    });
  }

  function drawTreeBranches(stage) {
    if (!branchLayer) return;

    branchLayer.innerHTML = "";

    treePaths.slice(0, Math.min(stage + 2, treePaths.length))
      .forEach((pathData) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );

        path.setAttribute("d", pathData);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#9B6B59");
        path.setAttribute("stroke-width", "5");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");

        branchLayer.appendChild(path);
      });
  }

  function updateTree() {
    treeStage = Math.min(treeStage + 1, 5);

    addTreeLeaves(treeStage);
    drawTreeBranches(treeStage);

    if (treeMessage) {
      treeMessage.textContent = treeMessages[treeStage - 1];
    }

    if (growTreeBtn && treeStage >= 5) {
      growTreeBtn.textContent = "Our friendship keeps growing ♡";
      growTreeBtn.disabled = true;
    }
  }

  if (growTreeBtn) {
    growTreeBtn.addEventListener("click", updateTree);
  }

  // INITIAL TREE
  addTreeLeaves(1);
  drawTreeBranches(1);

  // FINAL CELEBRATION
  const celebrateBtn = $("celebrateBtn");

  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      const symbols = ["♡", "♥", "✧", "✿"];

      for (let i = 0; i < 40; i++) {
        window.setTimeout(() => {
          const heart = document.createElement("span");

          heart.className = "floating-heart";
          heart.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

          heart.style.left = `${Math.random() * 100}%`;
          heart.style.fontSize = `${16 + Math.random() * 24}px`;
          heart.setAttribute("aria-hidden", "true");

          document.body.appendChild(heart);

          heart.addEventListener("animationend", () => {
            heart.remove();
          }, { once: true });

        }, i * 60);
      }

      celebrateBtn.textContent = "Can't wait to see you! ♡";
      celebrateBtn.disabled = true;
    });
  }

  // INITIAL STATE
  panels.forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("active");
    panel.setAttribute("aria-hidden", "true");
  });

  updateMusicButton();
});
