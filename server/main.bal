import ballerina/http;
import ballerina/jwt;
import ballerinax/postgresql;
import ballerina/crypto;
import ballerina/sql;
import ballerina/time;

// Supabase DB connection config
configurable string host = ?;
configurable int port = ?;
configurable string username = ?;
configurable string password = ?;
configurable string databaseName = ?;
configurable string supabaseJwtSecret = ?;

service /store on new http:Listener(9090) {
    final postgresql:Client databaseClient;

    public function init() returns error? {
        self.databaseClient = check new (host, username, password, databaseName, port);
    }

    resource function post register(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        string username = (check payload.username).toString();
        string plainPassword = (check payload.password).toString();
        
        // Hash the password using a secure hashing algorithm (SHA256)
        byte[] hashedPassword = crypto:hashSha256(plainPassword.toBytes());

        // Convert the hashed password to a hexadecimal string
        string hashedPasswordHex = hashedPassword.toBase16();

        // Insert the user into the database
        sql:ExecutionResult result = check self.databaseClient->execute(
            `INSERT INTO users (username, password) VALUES (${username}, ${hashedPasswordHex})`
        );

        if result.affectedRowCount == 1 {
            check caller->respond({ message: "Registration successful" });
        } else {
            check caller->respond({ message: "Registration failed" });
        }
    }

    resource function post login(http:Caller caller, http:Request req) returns error {
        json payload = check req.getJsonPayload();
        string username = (check payload.username).toString();
        string plainPassword = (check payload.password).toString();

        // Retrieve the user from the database
        stream<record {|anydata...;|}, sql:Error?> resultStream = self.databaseClient->query(
            `SELECT password FROM users WHERE username = ${username}`
        );
        
        record {|string password;|}? user = <record {|string password;|}>resultStream.next();
        if user is record {|string password;|} {
            // Compare the hashed passwords
            byte[] hashedPassword = crypto:hashSha256(plainPassword.toBytes());
            string hashedPasswordHex = hashedPassword.toBase16();
            
            if hashedPasswordHex == user.password {
                // Generate JWT token
                jwt:Header jwtHeader = {alg: jwt:HS256};
                jwt:Payload jwtPayload = {
                    iss: "your-supabase-url",
                    sub: username,
                    aud: "your-audience",
                    exp: time:currentTime().unixTime() + 3600 // 1-hour expiration
                };
                // Sign the JWT
                string signedJwt = check jwt:createSignedJwt(jwtHeader, jwtPayload, supabaseJwtSecret.toBytes());

                // Respond with the token
                check caller->respond({ token: signedJwt });
            } else {
                // Incorrect password
                check caller->respond({ message: "Invalid credentials" });
            }
        } else {
            // User not found
            check caller->respond({ message: "User not found" });
        }
    }
}
