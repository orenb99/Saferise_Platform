const puppeteer = require("puppeteer");
const createOrderPDF = async (order) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const customHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Safety Order ${order.orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20mm; }
        h1 { color: #333; }
        p { line-height: 1.5; }
        .highlight { background-color: yellow; padding: 5px; }
      </style>
    </head>
    <body>
      <h1>Safety order for order #${order.orderId}</h1>
      <p>${order.orderContent}</p>
    </body>
    </html>
  `;

  await page.setContent(customHtml, { waitUntil: "networkidle0" });

  await page.pdf({
    path: `${process.env.ORDER_SAVE_PATH}/${order.orderId}.pdf`,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log("PDF generated successfully!");
};
module.exports = { createOrderPDF };
