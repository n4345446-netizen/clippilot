
"use strict";

// ClipPilot dashboard elements
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const startButton = document.getElementById("startButton");
const videoFile = document.getElementById("videoFile");
const videoUrl = document.getElementById("videoUrl");
const importMessage = document.getElementById("importMessage");
const facebookMessage = document.getElementById("facebookMessage");

let videosProcessed = 0;

// Mobile navigation menu
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

// Video file selection
if (videoFile && importMessage) {
  videoFile.addEventListener("change", () => {
    const file = videoFile.files[0];

    if (file) {
      importMessage.textContent = "Selected video: " + file.name;
    } else {
      importMessage.textContent = "No video selected.";
    }
  });
}

// Video submission
if (startButton) {
  startButton.addEventListener("click", () => {
    const file = videoFile ? videoFile.files[0] : null;
    const url = videoUrl ? videoUrl.value.trim() : "";

    if (!file && !url) {
      importMessage.textContent =
        "Please upload a video or enter a video link.";
      return;
    }

    if (file && !file.type.startsWith("video/")) {
      importMessage.textContent =
        "Please select a valid video file.";
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
    }

    videosProcessed++;

    const videosCount = document.getElementById("videosCount");

    if (videosCount) {
      videosCount.textContent = videosProcessed;
    }

    const recentActivity = document.getElementById("recentActivity");

    if (recentActivity) {
      recentActivity.textContent =
        "Latest video submitted: " + (file ? file.name : url);
    }

    importMessage.textContent =
      "Video received successfully. AI clipping is not yet enabled. This is the next development stage.";
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
