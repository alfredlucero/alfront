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
