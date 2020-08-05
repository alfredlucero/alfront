# Elasticsearch

## Common Use Cases

- Text based search

- Application performance management

- Send events to elasticsearch for aggregations and analysis

- Abnormality detection

- Forecasting for capacity planning

## How does it work?

Data is stored as documents, similar to rows in relational database

- data is separated into fields, similar to columns

```json
{
  "firstName": "Alfred",
  "lastName": "Lucero"
}
```

- querying elasticsearch through REST API

- written in Java, built on Apache Lucene

- easy to use, highly scalable since distributed by nature

Overview of Elastic Stack

- X-Pack: adds additional features to elasticsearch and kibana

  - security authentication and authorization, integrate with auth providers

  - control permissions with fine-grained authorization

  - monitor performance of elastic stack i.e. CPU, memory usage, disk space; get notified if something goes wrong

  - alerting if CPU/memory usage exceeds a threshold or spike in application errors; notified by email/Slack/etc.

  - reporting aka exporting kibana visualizations, reports generated on demand or scheduled or based on conditions fulfilled; export data as CSV

  - enables machine learning for elasticsearch and kibana

  - graph: analyzes relationships in your data i.e. related products or suggested songs; looking for relevance in addition to popularity; integrate into applications with an API; visualize relationships with Kibana

  - elasticsearch SQL: query with Query DSL similar to SQL; flexible but verbose; send SQL over HTTP or through a JDBC driver; translates SQL internally; translate API returns corresponding query dsl

- Kibana: analytics and visualization platform for data, elasticsearch dashboard with line charts, pie charts, etc.

  - Can set up machine learning

- Beats: collection of data shippers that send data to elasticsearch or logstash, collects data and serves different purposes

  - filebeat for log files

  - metricbeat for system and service metrics i.e. memory/cpu usage

  - packetbeat collects network data

- Logstash: data processing pipeline, receives events such as log file entries, processed, and shipped off to other areas

  - inputs, filters, outputs; each step can use plugins

  - filters can parse csv, xml, and json; resolve ip address

  - output plugins (stashes) - going out to places

  - horizontally scalable

```
input {
  file {
    path => "apache_access.log"
  }
}

filter {
  if [request] in ["sample.txt"] {
    drop {

    }
  }
}

output {
  file {
    path => "sample.log"
  }
}

```

Data ingestion with beats/logstash/elasticsearch api
=>
Search, analyze and store data (elastic search)
=>
visualize your data (kibana)

add features to elastic stack with x-pack

ELK stack: elasticsearch, logstash, and kibana
Elastic Stack: elasticsearch, logstash, kibana, beats, x-pack

## Common Architectures

Data stored in relational database
Databases not so great at full-text search
Application communicates with Elasticsearch with any HTTP library i.e. official client libraries

How does data get into Elasticsearch?
Web app should keep the data updated
Data stored both in the DB and Elasticsearch
Can write a script that imports data with some tool and then web app keeps it up to date

Given task to implement a dashboard

- use Kibana; Kibana can be run on any machine i.e. virtual machine or dedicated machine

- Use Metricbeat to monitor CPU/memory usage and can be installed on web server as traffic increases; configured to send data to Elasticsearch; ships with default Kibana dashboards

  - Kibana configuration stored within Elasticsearch

  - Can set up alerting

  - Monitor access and error log; response times for each endpoint; identify bad deployments i.e. increased response times or 4xx/5xx HTTP status codes

- Filebeat to have logs processed and stored within Elasticsearch and can be visualized with Kibana

  - Ships with modules for common log file formats

- Logstash to centralize event processing; what about data from Metricbeat or Filebeat? we can optionally send the data to Logstash

Basic Architecture

- Separate nodes/instances of Elasticsearch (could be on the same machine) to hold large amounts of data

- Each node belongs to a cluster, containing portion of the data; can have multiple clusters for different purposes

- Documents aka JSON objects to hold data in \_source and metadata

  - Documents stored within an index to group them and with options for availability and scalability; index = way to group logically related documents

- Nodes store the data we add to Elasticsearch; cluster is a collection of nodes

Sharding and Scalability

- Sharding: way to divide indices into smaller pieces where each piece is called a shard

  - shard is done at the index level

  - main purpose is to horizontally scale the data volume

  - i.e. index of 600gb spread out into node A with max 500GB and node B with max 500GB -> 300GB per node

  - each shard is an Apache Lucene index; elasticsearch index consists of one or more Lucene indices

  - shard has no predefined size; may store up to about 2 billion documents

  - want to store more documents; to fix large indices onto nodes; improved performance; parallelization of queries increases throughput of an index

  - an index contains a single shard by default

  - want to avoid over-sharding for small amounts of data

  - increase number of shards with Split API; reduce number of shards with Shrink API

  - how many shards are optimal? depends on number of nodes, capacity of nodes, number of indices an their sizes, number of queries

    - anticipating millions of documents? consider adding couple of shards i.e. 5; thousands of documents can stick to default 1 shard

- Replication: what happens if a node's hard drive fails? data may be lost if there is no copy of it

  - For fault tolerance, enabled by default

  - Configured at the index level

  - Creating copies of shards aka replica shards

  - A shard that has been replicated is known as a primary shard

  - Primary shard and replica shards (complete copy of shard) known as replication group

  - Replica shard can serve search requests, exactly like its primary shard

  - number of shards can be configured at index creation

  - i.e. Node A has primary shard A, replica B1, replica B2; Node B has primary shard B, replica A1, replica A2

  - Only makes sense to have replication for clusters with multiple nodes

  - Typically 1/2 replicas are okay if 1/2 nodes go down; is data okay to be unavailable while you restore it? is data store elsewhere like rdbms?

  - Replicate shards once if data loss is not a disaster; for critical systems, data should be replicated at least twice

  - Increase throughput of a given index with more replicas on another node cause both replica shards can be queried at the same time and help to prevent data loss

    - routes requests to the best shard, cpu parallelization improves performance if multiple replica shards are stored on the same nodes

  - increase availability and throughput

  - replica shard is never stored on the same node as its primary shard

- Snapshots:

  - use for backups to restore to a given point in time; can be taken at index level or for entire cluster

  - use snapshots for backups/rollbacks before applying changes to data in case something goes wrong and replication for high availability and performance

Node Roles:

- master node responsible for creating/deleting indices; master-eligible role; useful for large clusters i.e. node.master: true | false

- data role; enables a node to store data; performing queries related to data such as search i.e. node.data: true | false

- ingest role to run ingest pipelines -> series of steps/processors performend when indexing documents; may manipulate documents i.e. node.ingest; simplified Logstash directly within Elasticsearch

- machine learning roles like node.ml; xpack.ml.enabled

- coordination referring to distribution of queries and aggregation of results; node.master, node.data, node.ingest, node.ml, etc. all false; for coordination only nodes for large clusters and disable all other roles -> for load balancer

- voting-only role i.e. node.voting_only; rarely used; participates in voting for a new master node and cannot be elected as master node itself and only for large clusters

- changing roles when optimizing the cluster to scale number of requests but that is done after changing number of nodes, shards, replica shards, etc.
