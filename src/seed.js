import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import Question from "./modules/Question.js";

dotenv.config();

const URL = "https://www.geeksforgeeks.org/dsa/dsa-sheet-by-love-babbar/";

const seedDB = async () => {
  try {
    await connectDB();
    console.log("✅ DB Connected");

    console.log("🔍 Scraping data...");

    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const questions = [];
    let currentTopic = "General";

    // 🔥 ONLY SCRAPING HERE
    $("h2, h3, table").each((i, el) => {
      const tag = el.tagName;

      if (tag === "h2" || tag === "h3") {
        currentTopic = $(el).text().trim();
      }

      if (tag === "table") {
        $(el)
          .find("tr")
          .each((i, row) => {
            const cols = $(row).find("td");

            if (cols.length >= 2) {
              const title = $(cols[0])
                .text()
                .replace(/\s+/g, " ")
                .trim();

              // ❌ skip invalid rows
              if (!title || title.toLowerCase().includes("problem")) return;

              const links = $(row).find("a");

              let practiceLink = null;
              let articleLink = null;

              links.each((i, a) => {
                const href = $(a).attr("href");
                if (!href) return;

                if (href.includes("practice.geeksforgeeks.org")) {
                  practiceLink = href;
                } else if (
                  href.includes("leetcode.com") ||
                  href.includes("geeksforgeeks.org")
                ) {
                  articleLink = href;
                }
              });

              const finalLink = practiceLink || articleLink;

              if (title && finalLink) {
                questions.push({
                  title,
                  link: finalLink,
                  topic: currentTopic,
                  difficulty: "Medium",
                  platform: finalLink.includes("leetcode")
                    ? "LeetCode"
                    : "GeeksforGeeks",
                });
              }
            }
          });
      }
    });

    // ✅ NOW OUTSIDE LOOP

    console.log(`📊 Total scraped: ${questions.length}`);

    const uniqueQuestions = Array.from(
      new Map(questions.map(q => [q.link, q])).values()
    );

    console.log(`📊 After dedupe: ${uniqueQuestions.length}`);

    await Question.deleteMany();

    await Question.insertMany(uniqueQuestions);

    console.log("🎉 All questions inserted successfully");

    process.exit();

  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};

seedDB();