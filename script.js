"use strict";

// ClipPilot dashboard elements
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const startButton = document.getElementById("startButton");
const videoFile = document.getElementById("videoFile");
const videoUrl = document.getElementById("videoUrl");
const importMessage = document.getElementById("importMessage");
const facebookMessage = document.getElementById("facebookMessage");

let selectedVideo = null;
let videoPreviewUrl = null;

const startButtonParent = startButton
  ? startButton.parentNode
  : null;

const startButtonNextSibling = startButton
  ? startButton.nextSibling
  : null;

// Preview container
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

// Restore Start Clipping
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

// Format video duration
function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "Unavailable";

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return (
      hours + ":" +
      String(minutes).padStart(2, "0") + ":" +
      String(remainingSeconds).padStart(2, "0")
    );
  }

  return (
    minutes + ":" +
    String(remainingSeconds).padStart(2, "0")
  );
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }

  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// Clear previous preview
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

// Display video information
function displayVideoInformation(video, file) {
  const information = document.createElement("div");

  information.style.marginTop = "14px";
  information.style.padding = "14px";
  information.style.background = "#f3f7fc";
  information.style.borderRadius = "10px";

  const title = document.createElement("p");
  title.textContent = "Video Information";
  title.style.fontWeight = "600";
  title.style.marginBottom = "10px";

  const details = [
    ["Duration", "Reading..."],
    ["Resolution", "Reading..."],
    ["File size", formatFileSize(file.size)],
    ["Format", file.type || "Unknown"]
  ];

  const values = {};

  details.forEach(([label, value]) => {
    const line = document.createElement("p");

    line.style.fontSize = "13px";
    line.style.margin = "7px 0";

    const labelText = document.createElement("strong");
    labelText.textContent = label + ": ";

    const valueText = document.createElement("span");
    valueText.textContent = value;

    line.append(labelText, valueText);
    information.appendChild(line);

    values[label] = valueText;
  });

  information.prepend(title);

  video.addEventListener("loadedmetadata", () => {
    values["Duration"].textContent =
      formatDuration(video.duration);

    values["Resolution"].textContent =
      video.videoWidth + " × " + video.videoHeight;
  }, { once: true });

  video.addEventListener("error", () => {
    values["Duration"].textContent = "Could not read";
    values["Resolution"].textContent = "Could not read";
  }, { once: true });

  previewContainer.appendChild(information);
}

// Show video preview
function showVideoPreview(file) {
  clearVideoPreview();

  selectedVideo = file;
  videoPreviewUrl = URL.createObjectURL(file);

  const heading = document.createElement("p");
  heading.textContent = "Video Preview";
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

  previewContainer.append(heading, video, fileName);

  displayVideoInformation(video, file);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove video";
  removeButton.style.marginTop = "12px";
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

  previewContainer.appendChild(removeButton);

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
      "Video loaded. Reading video information...";
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
        "Video information extracted successfully. AI highlight detection is the next development stage.";
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
        "The link is valid, but online video importing is not enabled yet.";
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
