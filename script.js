"use strict";

// ClipPilot dashboard elements
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const startButton = document.getElementById("startButton");
const videoFile = document.getElementById("videoFile");
const videoUrl = document.getElementById("videoUrl");
const importMessage = document.getElementById("importMessage");
const facebookMessage = document.getElementById("facebookMessage");
const recentActivity = document.getElementById("recentActivity");

let selectedVideo = null;
let videoPreviewUrl = null;

// Remember the original position of Start Clipping
const startButtonParent = startButton
  ? startButton.parentNode
  : null;

const startButtonNextSibling = startButton
  ? startButton.nextSibling
  : null;

// Create video preview area
const previewContainer = document.createElement("div");
previewContainer.id = "videoPreview";
previewContainer.style.display = "none";
previewContainer.style.marginTop = "16px";

if (importMessage && importMessage.parentNode) {
  importMessage.parentNode.insertBefore(
    previewContainer,
    importMessage.nextSibling
  );
}

// Restore Start Clipping to its original position
function restoreStartButton() {
  if (!startButton || !startButtonParent) return;

  if (
    startButtonNextSibling &&
    startButtonNextSibling.parentNode === startButtonParent
  ) {
    startButtonParent.insertBefore(
      startButton,
      startButtonNextSibling
    );
  } else {
    startButtonParent.appendChild(startButton);
  }
}

// Mobile navigation
if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

// Navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");

    if (sidebar) {
      sidebar.classList.remove("open");
    }
  });
});

// Clear video preview
function clearVideoPreview() {
  previewContainer.replaceChildren();
  previewContainer.style.display = "none";

  if (videoPreviewUrl) {
    URL.revokeObjectURL(videoPreviewUrl);
    videoPreviewUrl = null;
  }

  selectedVideo = null;
  restoreStartButton();
}

// Display selected video
function showVideoPreview(file) {
  clearVideoPreview();

  selectedVideo = file;
  videoPreviewUrl = URL.createObjectURL(file);

  const heading = document.createElement("p");
  heading.textContent = "Video preview";
  heading.style.fontWeight = "600";
  heading.style.marginBottom = "8px";

  const video = document.createElement("video");
  video.src = videoPreviewUrl;
  video.controls = true;
  video.preload = "metadata";
  video.style.display = "block";
  video.style.width = "100%";
  video.style.maxWidth = "520px";
  video.style.maxHeight = "300px";
  video.style.borderRadius = "10px";
  video.style.background = "#000";

  const fileName = document.createElement("p");
  fileName.textContent = file.name;
  fileName.style.fontSize = "13px";
  fileName.style.marginTop = "8px";
  fileName.style.wordBreak = "break-word";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove video";
  removeButton.style.marginTop = "8px";
  removeButton.style.padding = "9px 14px";
  removeButton.style.borderRadius = "7px";
  removeButton.style.border = "1px solid #d5dce5";
  removeButton.style.background = "#ffffff";
  removeButton.style.cursor = "pointer";

  removeButton.addEventListener("click", () => {
    clearVideoPreview();

    if (videoFile) {
      videoFile.value = "";
    }

    if (importMessage) {
      importMessage.textContent =
        "Video removed. Choose another video.";
    }
  });

  previewContainer.append(
    heading,
    video,
    fileName,
    removeButton
  );

  // Move Start Clipping below Remove video
  if (startButton) {
    previewContainer.appendChild(startButton);
  }

  previewContainer.style.display = "block";
}

// Video file selection
if (videoFile && importMessage) {
  videoFile.addEventListener("change", () => {
    const file = videoFile.files && videoFile.files[0];

    if (!file) {
      clearVideoPreview();
      importMessage.textContent = "No video selected.";
      return;
    }

    if (!file.type.startsWith("video/")) {
      clearVideoPreview();
      videoFile.value = "";
      importMessage.textContent =
        "Please select a valid video file.";
      return;
    }

    showVideoPreview(file);

    importMessage.textContent =
      "Video selected successfully. You can preview it below.";
  });
}

// Start clipping
if (startButton && importMessage) {
  startButton.addEventListener("click", () => {
    const url = videoUrl ? videoUrl.value.trim() : "";

    if (!selectedVideo && !url) {
      importMessage.textContent =
        "Please upload a video before continuing.";
      return;
    }

    if (selectedVideo) {
      importMessage.textContent =
        "Your video is ready. AI clipping will be added in the next development stage.";
      return;
    }

    if (url) {
      try {
        const parsedUrl = new URL(url);

        if (
          parsedUrl.protocol !== "https:" &&
          parsedUrl.protocol !== "http:"
        ) {
          throw new Error("Invalid URL");
        }
      } catch (error) {
        importMessage.textContent =
          "Please enter a valid video link.";
        return;
      }

      importMessage.textContent =
        "The link is valid, but importing and processing online videos is not enabled yet.";
    }
  });
}

// Facebook connection placeholder
const connectFacebook = document.getElementById("connectFacebook");

if (connectFacebook && facebookMessage) {
  connectFacebook.addEventListener("click", () => {
    facebookMessage.textContent =
      "Facebook publishing requires a Meta developer app and approved Page permissions. Connection is not active yet.";
  });
}

// Scheduled posts
const scheduledMessage = document.getElementById("scheduledMessage");

if (scheduledMessage) {
  scheduledMessage.textContent =
    "No posts scheduled yet. Scheduling will be added in a later development stage.";
}

// Release preview memory
window.addEventListener("beforeunload", () => {
  if (videoPreviewUrl) {
    URL.revokeObjectURL(videoPreviewUrl);
  }
});
