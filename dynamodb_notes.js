// DynamoDB
// - hosted NoSQL database offered by AWS
// - reliable performance at scale, managed experience (no SSH into servers), small simple API for key-value access
// and advanced query patterns
// - great for apps with large amounts of data and strict latency requirements, serverless apps with AWS Lambda to provide
// auto-scaling, stateless ephemeral compute in responnse to event triggers, DynamoDB accessible via HTTP API and performs
// authentication and authorization via IAM roles, data sets with simple known access patterns

// Key Concepts
// - table = grouping of data records, similar to collection in MongoDB
// - item = single data record in a table, uniquely identified by stated primary key of table, similar
// to a row in relational database or document in MongoDB
// - attributes = pieces of data attached to a single item, comparable to a column in relational database or
// a filed in MongoDB, only requires attributes for those that make up your primary key
// - each item in a table is uniquely identified by a primary key and must be defined at creation of table
// and provided when inserting a new item
// - two types of primary keys:
// 1. simple primary key made up of just a partition key
// -> similar to standard key-value stores like Memcached or accessing rows in a SQL table by a primary key
// -> i.e. Users table with username primary key
// 2. composite primary key made up of partition key and sort key
// -> sort key to sort items with the same partition; can only have one item with a combo of partition key and sort key
// -> for sophisticated query patterns like grabbing all items with given partition key or using sort key to narrow relevant items for query
// i.e. Orders table for recording customer orders on e-commerce site and partition key would be CustomerId and 
// sort key would be OrderId
// - two types of Secondary Indexes to not just search by partition key
// 1. local secondary index: uses same partition key as underlying table but different sort key
// i.e. from Order table, quickly accessing customer's orders in descending order of amount they spent on order
// and have partition key of CustomerId, sort key of Amount
// 2. global secondary index: can define an entirely different primary key for a table
// i.e. from Order table, we can have a global secondary index with partition key of OrderId so we don't need to know CustomerId
// - Read and Write Capacity: provision read and write capacity units to allow a given number of operations per second
// rather than instance-based world in provisioning a server, has autoscaling

// The Dynamo Paper
// - described learnings of building an in-house, highly available key-value store to meet demands of Amazon.com website
// - no relational model as they found around 70% of operations were key-value where only primary key was used and single row returned
// and 20% would return a set of rows but still operate on only a single table
// - can often prevent dupliation of pieces of data by storing it in one place and refer to it using JOIN operation
// from one table to another but JOIN is expensive and slows down response times, manage data integrity in code
// - availability > consistency (most relational databases use a strongly consistent model which means all clients of server will see same
// data if querying at same time but may result in slower writes/reads for users), settle for eventual consistency meaning different users
// will eventually see the same view of the data -> speed and availability important
// - infinitely scalable without any negative performance impacts
// -> can vertically scale (use larger server instance with more CPUs or RAM) - expensive and hits limits on hardware or horizontally scale by splitting
// data across multiple machines, each of which has a subset of your full dataset - cheaper but more difficult to achieve
// -> uses consistent hashing to spread items across a number of nodes to handle increasing amount of data in table
// -> avoids multiple-machine problem by essentially requiring that all read operations use the primary key (other than Scans)
// -> eventual consistency and easier replication strategies of your data
// -> query latencies in single-digit milliseconds for unlimited amounts of data (100TB+)

// Single-item actions
// Anatomy of an Item
// - each item uniquely identifiable by a primary key set on a table level, composed of attributes
// with types such as strings, numbers, lists, sets, etc.
// - primary keys: must be included with every item written to DynamoDB table, uniquely identifies item
// 1. simple primary key: single attribute to identify an item like Username or OrderId
// 2. composite primary key: uses combo of two attributes to identify a particular item
// -> partition or hash key to segment and distribute items across shards
// -> sort or range key to order items with same partition key
// - attributes: different elements of data on particular item, each item must have the attributes for defined 
// primary key of table
// -> must specify type in a map like S - string, N - number, L - list
// -> string type representing Unicode string with UTF-8 encoding, useful for sorting last names of ISO timestamps
// -> number type for positive and negative numbers or zero, send it up as string value
// -> B for binary type: like image or compressed data, but generally should be stored in S3, base 64 encoding
// -> "BOOL" for boolean; "NULL" type, "L" for list type, values are ordered and don't have to be same type
// -> "M" for map type like key-value pairs/objects
// -> "SS" for string set type for collection of unique items of same type; "NS"; "BS"
const attributes = {
  "Name": { "S": "Alfred Lucero" },
  "Age": { "N": "23" },
  "Roles": { "L": ["Admin", "User"] }
};
// Sample response from GetItem API
const returnedGetItem = { 
  "Item": {
    "Name": {
      "S": "Alfred Lucero"
    },
    "Age": {
      "N": "23"
    },
    "Roles": {
      "L": ["Admin", "User"]
    }
  }
};

// Inserting and Retrieving Items
// - two basic API calls for PutItem and GetItem
// - need AttributeDefinitions for each attribute you need to define which includes name and type of attribute
// - need to provide KeySchema of table where you define primary key with HASH key and optional RANGE key
// -> need to specify TableNaem and ProvisionedThroughput for your table
// i.e. locally
/*
aws dynamodb create-table \
--table-name UsersTable \
--attribute-definitions '[
  {
      "AttributeName": "Username",
      "AttributeType": "S"
  }
]' \
--key-schema '[
  {
      "AttributeName": "Username",
      "KeyType": "HASH"
  }
]' \
--provisioned-throughput '{
  "ReadCapacityUnits": 1,
  "WriteCapacityUnits": 1
}' \
$LOCAL
*/
// - aws dynamodb list-tables $LOCAL; describe-table
// - PutItem will create a new Item if no Item with given primary key exists or overwrites existing Item if an 
// Item with that primary key already exists (or use condition expressions or use UpdateItem API)
/*
aws dynamodb put-item \
    --table-name UsersTable \
    --item '{
      "Username": {"S": "alexdebrie"}
    }' \
    $LOCAL
*/
// - GetItem API call requires table name and primary key of Items you want to retrieve
// -> can use --projection-expression to return only particular elements from Item or grab particular nested
// elements in List attribute or Map attribute
/*
aws dynamodb get-item \
    --table-name UsersTable \
    --key '{
      "Username": {"S": "alexdebrie"}
    }' \
    $LOCAL
*/

// Expression Basics
// - Condition expressions used when manipulating individual items to only change an item when certain conditions are true
// - Projection expressions used to specify a subset of attributes you want to receive when reading Items
// - Update expressions used to update a particual attribute in an existing Item
// - Key condition expressions used when querying table with composite primary key to limit the items selected
// - Filter expressions to filter results of queries and scans to allow for more efficient responses
// - Expressions are strings that use DynamoDB's domain-specific expression logic to check for validity of
// a described statement and use comparator symbols like =, >, >=
// -> can also check whether particular attribute exists with attribute_exists() function or attribute_not_exists() or
// begins_with(), contains(), size()
// -> lets you use expression attribute names and values to get around syntax limitations
/*
  --expression-attribute-names '{
    "#a": "Age"
  }'
   --condition-expression "#a.#st = 'Nebraska' " \
    --expression-attribute-names '{
      "#a": "Address",
      "#st": "State"
    }'
  expression attribute values starting with :
  {":agelimit": {"N": 21} }
  checking first if user exists before doing PutItem
  aws dynamodb put-item \
    --table-name UsersTable \
    --item '{
      "Username": {"S": "yosemitesam"},
      "Name": {"S": "Yosemite Sam"},
      "Age": {"N": "73"}
    }' \
    --condition-expression "attribute_not_exists(#u)" \
    --expression-attribute-names '{
      "#u": "Username"
    }' \
    $LOCAL
*/

// Updating and Deleting Items
// - UpdateItem API but need to specify update expression
// -> SET, REMOVE, ADD, DELETE
/*
aws dynamodb update-item \
    --table-name UsersTable \
    --key '{
      "Username": {"S": "daffyduck"}
    }' \
    --update-expression 'SET #dob = :dob' \
    --expression-attribute-names '{
      "#dob": "DateOfBirth"
    }' \
    --expression-attribute-values '{
      ":dob": {"S": "1937-04-17"}
    }' \
    $LOCAL
*/
// - DeleteItem API
/*
    aws dynamodb delete-item \
    --table-name UsersTable \
    --key '{
      "Username": {"S": "daffyduck"}
    }' \
    $LOCAL
*/

// Multi-Item Actions
// Working with Multiple Items
// - composite primary key useful to work with a group of related items with single query
// -> HASH key is how data is partitioned, RANGE key is how data is sorted within a particular HASH key
// -> allows for one-to-many like structure, for a single HASH key can be multiple RANGE keys
// "Give me all of the <RANGE KEY> from a particular <HASH KEY>"
// - BatchWriteItem API call: make multiple (up to 25) PutItem and/or DeleteItem requests in single call rather
// than making separate calls and even make requests to different tables in single call
// -> cannot use UpdateItem API as updates must be done individually, cannot specify conditions for Put and Delete operations
// -> two different failure modes:
// 1. entire request could fail due to error in request like writing to table that doesn't exist
// 2. individual write requests that fail within the batch like exceeding write throughput for a given table/server-side errors
// -> anything not finished will show up under UnprocessedItems

// Querying
// - to select multiple Items that have same partition key but different sort keys
// i.e. retrieving all items with given partition key with --key-condition-expression option
/*
    aws dynamodb query \
    --table-name UserOrdersTable \
    --key-condition-expression "Username = :username" \
    --expression-attribute-values '{
        ":username": { "S": "daffyduck" }
    }' \
    $LOCAL
*/
// -> use Key Expressions to query data allowing DynamoDB to quickly find Items that satisfy our Query
// -> filtering based on non-key attributes
// i.e. all Orders for a username between certain dates
/*
aws dynamodb query \
    --table-name UserOrdersTable \
    --key-condition-expression "Username = :username AND OrderId BETWEEN :startdate AND :enddate" \
    --expression-attribute-values '{
        ":username": { "S": "daffyduck" },
        ":startdate": { "S": "20170101" },
        ":enddate": { "S": "20180101" }
    }' \
    $LOCAL
*/
// - can also have --projection-expression to limit Items to return just attributes you care about, returns "Count" key
// -> can also do --select COUNT to return number of results

// Scans
// - like payloader, grabbing everything in its path, never use this unless you know what you're doing
// - operates on your entire table and can quickly use up all your Read Capacity, can be slow
// - only makes sense with small table, exporting all table's data to another storage system, using global
// secondary indexes to set up a work queue
/* returns all items in table up to 1MB in single request and need to paginate through results
aws dynamodb scan \
    --table-name UserOrdersTable \
    $LOCAL
*/
// -> returns "NextToken" key in response and use --starting-token option to continue scanning from location you
// previously ended, also set --max-items
// - can export data into cold storage or for data analysis
// - can do parallel scans for large amounts of data with notion of Segments to spin up multiple threads or
// processes to scan the data in parallel
/*
aws dynamodb scan \
    --table-name UserOrdersTable \
    --total-segments 3 \
    --segment 1 \
    $LOCAL
*/

// Filtering
// - for server-side filters on Item attributes before they are returned to the client making the call
// - 3 steps for query and scan operations
// 1. Retrieve requested data, looks at Starting Token and Key Expression in Query operation
// 2. Filter data with filters/projection expressions
// 3. Return data to client
// - filter expressions like key expressions on Queries, can specify an attribute to operate on and expression to apply
/*
aws dynamodb query \
    --table-name UserOrdersTable \
    --key-condition-expression "Username = :username" \
    --filter-expression "Amount > :amount" \
    --expression-attribute-values '{
        ":username": { "S": "daffyduck" },
        ":amount": { "N": "100" }
    }' \
    $LOCAL
*/
// -> ScannedCount refers to number of Items retrieved in Step 1, Count refers to number of Items returned to client
// - filter expressions may not be used on primary key elements in a Query operation though you can use filter expressions
//  on primary key elements with Scan

// Secondary Indexes
// - most read operations used a table's primary key directly through GetItem or Query call
// as using table's primary key is most efficient way to retrieve items and avoids using slow Scan
// - if using a RANGE key it's fast and easy but say if you go by a non-key attribute like 
// Amount we need to use filter which is applied after all results retrieved
// - secondary indexes: allow you to specify alternate key structures to be used in Query or Scan operations
// but not GetItem operations
// 1. local secondary index: can be used on table with composite primary key to specify an index with same HASH
// key but a different RANGE key for a table i.e. by Username and say Amount
// 2. global secondary index: specify completely different key structure for table like copmletely different HASH key and RANGE key
// - no uniqueness requirement, secondary index attributes aren't required when writing an Item - sparse index pattern
// - index limits per table - may create 5 global secondary indexes and 5 local secondary indexes per table
// - can have projected attributes like KEYS_ONLY, ALL, INCLUDE -> charges based on amount of data indexed

// Local Secondary Indexes
// - can only add this on tables with composite primary keys, maintaining the same HASH key but allowing different RANGE key
// - must be specified at table creation, 10GB limit per HASH key, consistency options between strong/eventual, shares throughput with underlying table
// - since only at time of creation we need to delete table and create again
/*
aws dynamodb create-table \
    --table-name UserOrdersTable \
    --attribute-definitions '[
      {
          "AttributeName": "Username",
          "AttributeType": "S"
      },
      {
          "AttributeName": "OrderId",
          "AttributeType": "S"
      },
      {
          "AttributeName": "Amount",
          "AttributeType": "N"
      }
    ]' \
    --key-schema '[
      {
          "AttributeName": "Username",
          "KeyType": "HASH"
      },
      {
          "AttributeName": "OrderId",
          "KeyType": "RANGE"
      }
    ]' \
    --local-secondary-indexes '[
      {
          "IndexName": "UserAmountIndex",
          "KeySchema": [
              {
                  "AttributeName": "Username",
                  "KeyType": "HASH"
              },
              {
                  "AttributeName": "Amount",
                  "KeyType": "RANGE"
              }
          ],
          "Projection": {
              "ProjectionType": "KEYS_ONLY"
          }
      }
    ]' \
    --provisioned-throughput '{
      "ReadCapacityUnits": 1,
      "WriteCapacityUnits": 1
    }' \
    $LOCAL

  querying for local secondary index without filter-expression but key-condition-expression
  aws dynamodb query \
    --table-name UserOrdersTable \
    --index-name UserAmountIndex \
    --key-condition-expression "Username = :username AND Amount > :amount" \
    --expression-attribute-values '{
        ":username": { "S": "daffyduck" },
        ":amount": { "N": "100" }
    }' \
    $LOCAL
*/
// - can reduce the ScannedCount and increase query speed and reduce complexity

// Global Secondary Indexes
// - can add to tables with simple primary key or composite primary keys and create either a composite or
// simple key schema
// - separate throughput as you provision RCU/WCU separate from underlying table - adds complexity and cost but flexibility
// - eventual consistency: when writing Item to table, asynchronously replicated to global secondary indexes and may get different results
// when querying a table and global secondary index at same time
// - no partition key size limits, use on any table regardless of primary key schema, use with any key schema for the secondary index you're creating
// - will backfill global secondary index based on existing data in table and can be created after table is already created
// - sparse index: not every Item contains attributes you're indexing; only Items with attributes matching key schema for index copied
/*
aws dynamodb update-table \
    --table-name UserOrdersTable \
    --attribute-definitions '[
      {
          "AttributeName": "ReturnDate",
          "AttributeType": "S"
      }
    ]' \
    --global-secondary-index-updates '[
        {
            "Create": {
                "IndexName": "ReturnDateOrderIdIndex",
                "KeySchema": [
                    {
                        "AttributeName": "ReturnDate",
                        "KeyType": "HASH"
                    },
                    {
                        "AttributeName": "OrderId",
                        "KeyType": "RANGE"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            }
        }
    ]' \
    $LOCAL
*/
