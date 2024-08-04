const SMTPServer = require("smtp-server").SMTPServer;
const fs = require('fs');

const server = new SMTPServer({
    secure: false, // Set to true for TLS support
    authOptional: true, // Disable authentication for simplicity
    onMailFrom: (mail, session, callback) => {
        console.log(mail);
        callback(null);
    },
    onData: (stream, session, callback) => {
        let emailData = '';

        stream.on('data', (chunk) => {
            emailData += chunk;
        });

        stream.on('end', () => {
            fs.writeFileSync('email.eml', emailData); // Save email to a file
            callback(null, 'Message accepted'); // Indicate that the message was accepted
        });
    },

    onAuth(auth, session, callback) {
        callback(null, { user: auth.username }); // Allow any username/password for simplicity
    },
});

server.on("error", (err) => {
    console.log("Error %s", err.message);
});

server.on("close", () => {
    console.log("CLosed");
});
server.listen(25, "0.0.0.0", () => {
    console.log("started")
});