const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Ensure downloads folder exists
const downloadDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

app.get("/download", (req, res) => {
    const url = req.query.url;
    if (!url)
        return res.status(400).send("❌ Please provide a video URL: /download?url=YOUR_URL");

    // File name with timestamp
    const output = path.join(downloadDir, `video_${Date.now()}.mp4`);

    // yt-dlp command to download video + audio and merge to mp4
    const cmd = `py -m yt_dlp -f "bv*+ba/b" --merge-output-format mp4 -o "${output}" "${url}"`;

    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
        if (error) {
            console.error("Download error:", error.message);
            return res.status(500).send(`❌ Download failed!`);
        }

        // Simple success message
        console.log("Downloaded successfully:", output);
        res.send("✅ Video downloaded successfully!");
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
