const theme = require("jsonresume-theme-elegant");
const pptr = require("puppeteer");
const express = require("express");
const process = require("process");

async function buildPdf() {
    const app = express();
    app.use(express.static("../../out/resume/"));
    let listener = app.listen(0, "127.0.0.1", async () => {
        const browser = await pptr.launch();
        const page = await browser.newPage();
        await page.emulateMediaType("print");
        await page.goto(
            `http://localhost:${listener.address().port}/resume.html`,
            { waitUntil: "networkidle0" }
        );
        await page.pdf({
            path: "../../out/resume/resume.pdf",
            format: "A4",
            printBackground: true,
        });
        await browser.close();
        console.log("generated pdf");
        listener.close();
    });
}

if (require.main === module) buildPdf();
