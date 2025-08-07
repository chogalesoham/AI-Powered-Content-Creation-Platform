const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const FINAL_JSON_PATH = path.join(
  __dirname,
  "../../../../AI/DheerajTSEC/Schedule/final.json"
);

// Update a draft by ID
router.put("/:id", (req, res) => {
  const draftId = parseInt(req.params.id);
  const { generated_draft } = req.body;

  if (!generated_draft) {
    return res
      .status(400)
      .json({ success: false, message: "Missing generated_draft" });
  }

  fs.readFile(FINAL_JSON_PATH, "utf8", (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Failed to read file" });
    let drafts;
    try {
      drafts = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ success: false, message: "Invalid JSON" });
    }
    const idx = drafts.findIndex((d) => d.id === draftId);
    if (idx === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Draft not found" });
    }
    drafts[idx].generated_draft = generated_draft;
    fs.writeFile(FINAL_JSON_PATH, JSON.stringify(drafts, null, 2), (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Failed to write file" });
      res.json({ success: true, draft: drafts[idx] });
    });
  });
});

module.exports = router;
