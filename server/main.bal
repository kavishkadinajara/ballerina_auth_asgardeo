import ballerina/io;
import ballerina/sql;
import ballerina/jdbc;

public function main() returns error? {
    // Initialize the JDBC client for PostgreSQL with Supabase connection details
    jdbc:Client|error supabaseClient = new ({
        url: "jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
        username: "postgres.acqwyyoukqstofbbbwno",
        password: "unNFxZ4yc85fjEbC",
        poolOptions: { maximumPoolSize: 5 },
        dbOptions: { ssl: { mode: "disable" } }
    });

    if supabaseClient is jdbc:Client {
        // Example: Execute a query
        sql:ParameterizedQuery query = `SELECT * FROM your_table`;

        // Fetch results from Supabase
        stream<record {}, sql:Error?> resultStream = supabaseClient->query(query);

        // Iterate through the results
        error? e = resultStream.forEach(function(record {} result) {
            io:println(result);
        });

        // Close the client
        check supabaseClient.close();
    } else {
        io:println("Error initializing client: ", supabaseClient);
    }
}
