# Kubernetes Notes

## Overview

Why do you need containers?

- Dealing with compatibility issues with OS, libraries/dependencies, hardware infrastructure; matrix from hell
- Long setup time for devs
- Different dev/test/prod environments

What can it do?

- Regardless of OS, only need Docker installed in their systems
- Containerize applications
- Run each service with its own dependencies in separate containers

What are containers?

- Isolated environments with own processes, networks, mounts like virtual machine except sharing same OS kernel

Operating System

- Ubuntu, Linux, Debian, Fedora, etc.
- Contains OS Kernel + software; interacts with underlying hardware
- Custom Software can have different tools, file managers, etc.
- Won't be able to run Windows on Linux OS; need Docker on Windows server
- Docker shares the OS kernel; not meant to run different OS in same hardware but to containerize applications, ship them, and run them

Virtual Machine

- Hardware, OS, Hypervisor, virtual machine with its own OS, libs/deps, and application -> higher utilization and disk space size (often GB), can take minutes to boot up for entire OS; complete isolation from each other and don't rely on underlying OS kernel
- Docker has less utilization and smaller size (often MB), boots up faster within seconds, has less isolation

How is it done?

- `docker run mongodb` `docker run redis` `docker run nodejs`
- Container vs. image
  - Image = package/template/plan similar to VM template
  - Container = running instances of images that are isolated with their own environment and processes
- Provide a Dockerfile guide and Docker image for the application to run on any container platform and guaranteed to run the same way everywhere; deploy image

Container Orchestration

- Need to orchestrate connectivity between containers and scale up/down based on load; manage deployment of many containers in clustered environment
- Kubernetes (difficult to setup but many options for deployments of complex architectures, supported in GCP, Azure, AWS) i.e. similar to Docker Swarm (lacks advanced features for complex applications) or Mesos (difficult to setup/get started)
- Highly available to hardware failures due to multiple instances of application, load balanced, can scale up/down at a service level without taking down application; object configuration files

Kubernetes Architecture

- Nodes = physical/virtual machine where Kubernetes is installed, worker machines/minions can start up containers
- Cluster = set of nodes grouped together; if one node fails, application still accessible from other nodes, sharing load
- Master = node with K8s installed, monitoring nodes that failed, watches over nodes, orchestrates containers on worker nodes
- Components = API server (frontend for k8s, CLI), etcd (key-value store to manage data about the cluster, multiple nodes/masters managed here with logs), kubelet (agent that runs on each node in cluster, makes sure containers running on nodes as expected), container runtime (software used to run containers i.e. Docker), controller (brains behind orchestration, responding when containers/endpoints go down, can bring up new containers), scheduler (scheduling work across nodes)

Master vs. Worker Nodes

- Worker/Minion - where Docker containers hosted with Docker container runtime (alternatives include rkt or cri-o), kubelet to talk with master and carry out actions
- Master - kube-apiserver to talk to minions, etcd key-value store, controller, scheduler

kubectl (CLI)

- `kubectl run hello-minikube`; used to deploy and manage applications in cluster
- `kubectl cluster-info`
- `kubectl get nodes`

## Setup Kubernetes

Minikube, MicroK8s, Kubeadm (multi-node K8s cluster) for local environment

Cloud Services like Google Cloud Platform, AWS, Microsoft Azure to deploy k8s cluster

kodecloud.com for labs related to kubernetes

Minikube

- Bundles all the master/worker components into a single image and can set up a k8s cluser
- Single node k8s cluster we can install into like VirtualBox or KVM
- Need kubectl command line tool installed in your machine
- `kubectl get nodes`
- `minikube start` or `minikube start --driver=<driver_name>`
- `minikube status`
- `kubectl create deployment hello-minikube --image=k8s.gcr.io/...`
- `kubectl get deployments`
- `kubectl expose deployment hello-minikube --type=NodePort --port=8080`
- `kubectl get pods`
- `minikube service hello-minikube --url http://192.168.99.100:31391`
- `kubectl delete services hello-minikube`
- `kubectl delete deployment hello-minikube`
