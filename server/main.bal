import ballerina/http;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable string host = ?;
configurable int port = ?;
configurable string username = ?;
configurable string password = ?;
configurable string databaseName = ?;

service /store on new http:Listener(9090) {
    final postgresql:Client databaseClient;

    public function init() returns error? {
        // Initialize the database client without explicit SSL configuration
        self.databaseClient = check new (host, username, password, databaseName, port);
    }

    // Health check endpoint to verify DB connection
    resource function get dbConnection() returns string|error {
        // Test connection by running a simple query
        int count = check self.databaseClient->queryRow(`SELECT 1`);
        if count == 1 {
            return "Database connection is successful";
        }
        return "Database connection failed";
    }
}
