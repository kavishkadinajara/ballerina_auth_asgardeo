// import ballerina/http;
// import ballerina/jwt;
// import ballerinax/postgresql;
// import ballerina/crypto;
// import ballerina/sql;
// import ballerina/time;

// // Supabase DB connection config
// configurable string host = ?;
// configurable int port = ?;
// configurable string username = ?;
// configurable string password = ?;
// configurable string databaseName = ?;
// configurable string supabaseJwtSecret = ?;

// service /store on new http:Listener(9090) {
//     final postgresql:Client databaseClient;

//     public function init() returns error? {
//         self.databaseClient = check new (host, username, password, databaseName, port);
//     }

//     resource function post register(http:Caller caller, http:Request req) returns error? {
//         json payload = check req.getJsonPayload();
//         string username = (check payload.username).toString();
//         string plainPassword = (check payload.password).toString();
        
//         // Hash the password using a secure hashing algorithm (SHA256)
//         byte[] hashedPassword = crypto:hashSha256(plainPassword.toBytes());

//         // Convert the hashed password to a hexadecimal string
//         string hashedPasswordHex = hashedPassword.toBase16();

//         // Insert the user into the database
//         sql:ExecutionResult result = check self.databaseClient->execute(
//             `INSERT INTO users (username, password) VALUES (${username}, ${hashedPasswordHex})`
//         );

//         if result.affectedRowCount == 1 {
//             check caller->respond({ message: "Registration successful" });
//         } else {
//             check caller->respond({ message: "Registration failed" });
//         }
//     }

//     resource function post login(http:Caller caller, http:Request req) returns error {
//         json payload = check req.getJsonPayload();
//         string username = (check payload.username).toString();
//         string plainPassword = (check payload.password).toString();

//         // Retrieve the user from the database
//         stream<record {|anydata...;|}, sql:Error?> resultStream = self.databaseClient->query(
//             `SELECT password FROM users WHERE username = ${username}`
//         );
        
//         record {|string password;|}? user = <record {|string password;|}>resultStream.next();
//         if user is record {|string password;|} {
//             // Compare the hashed passwords
//             byte[] hashedPassword = crypto:hashSha256(plainPassword.toBytes());
//             string hashedPasswordHex = hashedPassword.toBase16();
            
//             if hashedPasswordHex == user.password {
//                 // Generate JWT token
//                 jwt:Header jwtHeader = {alg: jwt:HS256};
//                 jwt:Payload jwtPayload = {
//                     iss: "your-supabase-url",
//                     sub: username,
//                     aud: "your-audience",
//                     exp: time:currentTime().unixTime() + 3600 // 1-hour expiration
//                 };
//                 // Sign the JWT
//                 string signedJwt = check jwt:createSignedJwt(jwtHeader, jwtPayload, supabaseJwtSecret.toBytes());

//                 // Respond with the token
//                 check caller->respond({ token: signedJwt });
//             } else {
//                 // Incorrect password
//                 check caller->respond({ message: "Invalid credentials" });
//             }
//         } else {
//             // User not found
//             check caller->respond({ message: "User not found" });
//         }
//     }
// }


import ballerina/http;
import ballerina/sql;
import ballerinax/postgresql;

service /auth on new http:Listener(8080) {

    post resource function register(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        string email = check payload.email.toString();
        string password = check payload.password.toString();
        
        // Use bcrypt or Argon2 to hash the password here
        string hashedPassword = hashPassword(password);

        // Save user to PostgreSQL
        sql:ExecutionResult result = check dbClient->execute(`INSERT INTO users (email, password_hash, role) VALUES (${email}, ${hashedPassword}, 'user')`);

        check caller->respond({ "message": "Registration successful" });
    }

    post resource function login(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        string email = check payload.email.toString();
        string password = check payload.password.toString();
        
        // Validate user from PostgreSQL
        stream<record {}, error> result = check dbClient->query(`SELECT password_hash FROM users WHERE email = ${email}`);
        var userRecord = check result.next();

        // Check if the password matches
        boolean isValidPassword = validatePassword(password, userRecord.password_hash);
        if (!isValidPassword) {
            check caller->respond({ "error": "Invalid credentials" }, status = 401);
            return;
        }

        // Create a session or JWT token
        string token = createJWTToken(email, userRecord.role);

        check caller->respond({ "token": token });
    }
}
