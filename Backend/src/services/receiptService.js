const pdfDocument = require("pdfkit"); // importing pdfkit from npm package
const imageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const ImageKit = new imageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
});

async function generateTransactionReceipt(transaction){
    return new Promise((resolve, reject) => {
        const doc = new pdfDocument({
            margin: 50
        });

        const chunks = [];

        doc.on("data", (chunk) => {
            chunks.push(chunk); // push - to add new elements to the array
        })
        
        doc.on("end", async() => {
            try {
                const pdfBuffer = Buffer.concat(chunks);
                console.log("PDF BUFFER:", pdfBuffer);
                console.log("PDF BUFFER LENGTH:", pdfBuffer?.length);
                const file = await toFile(
    pdfBuffer,
    `transaction-recipt-${transaction._id}.pdf`
);
                const uploadResponse = await ImageKit.files.upload({
                    file: file,
                    fileName: `transaction-recipt-${transaction._id}.pdf`,
                    folder: "/banking-recipts"
                });
                resolve(uploadResponse);
            }
            catch(error){
                reject(error);
            }
        });

         doc.on("error", reject);

         // PDF Content
         doc.fontSize(24)   // doc.fontSize - fontSize is method of doc object provided by pdfkit library - npm install pdfkit
                  .text("Banking Transaction Recipt", {
            align: "center"
         });

         doc.moveDown(2);

         doc.fontSize(12)
         .text(`Transaction ID: ${transaction._id}`);

         doc.moveDown();

         doc.text(`From Account: ${transaction.fromAccount._id}`);
         console.log("FROM ACCOUNT:", transaction.fromAccount);
         doc.text(
            `From User: ${transaction.fromAccount.user.name}`
        );
        doc.text(
            `Email: ${transaction.fromAccount.user.email}`
        )
         doc.moveDown();

         doc.text(
            `To Account: ${transaction.toAccount._id}`
        );
         console.log("To ACCOUNT:", transaction.toAccount);
        doc.text(
            `To User: ${transaction.toAccount.user.name}`
        );
        doc.text(
            `Email: ${transaction.toAccount.user.email}`
        )
                doc.moveDown();

        doc.text(
            `Amount Transferred: INR ${transaction.amount}`
        );
        doc.moveDown();

         doc.text(
            `Status: ${transaction.status}`
        );
        doc.moveDown();

        doc.text(
            `Idempotency Key: ${transaction.idempotencyKey}`
        );
        doc.moveDown();

        doc.text(
            `Transaction Date: ${new Date(
                transaction.createdAt
            ).toLocaleString()}`
        );
        doc.moveDown(2);

        doc
            .fontSize(15)
            .text(
                "This is a system generated transaction receipt.",
                {
                    align: "center"
                }
            );
        doc.end();


    })
} 

module.exports = {
    generateTransactionReceipt
};