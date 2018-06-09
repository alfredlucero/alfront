# Containers Notes

---

## Docker Notes

---

### Overview:

* Docker: helpful tool for packing, shipping, and running applications within "containers"
* Goals of VMs and containers: isolate an application and its dependencies into a self-contained unit that can run anywhere; remove need for physical hardware

#### About Linux Containers:

* Docker leverages LXC on the backend as a lightweight alternative to full machine virtualization such as "traditional" hypervisors like KVM, Xen, or ESXi
* VM: emulation of a real computer that executes programs like real computer, runs on top of a physical machine using a "hypervisor" that runs on either host machine or on "bare-metal"
  ** hypervisor: piece of software, firmware or hardware that VMs run on top of; run on physical computers referred to as "host machine" that provides resources like RAM and CPU and divided between VMs and can be distributed
  ** VM running on host machine is often called "guest machine" that contains both the application and whatever it needs to run application like libraries and system binaries
  \*\* "guest machine" carries an entire virtualized hardware stack i.e. virtualized network adapters, storage, and CPU -> its own OS and behaves as its own unit with its own dedicated resources and from outside it's sharing resources provided by the host machine
  ** guest machine can run on either hosted hypervisor or a bare-metal hypervisor
  ** hosted virtualization hypervisor runs on operating system of host machine i.e. computer running OSX can have a VM like VirtualBox/VMWare installed on top of that OS and VM doesn't have direct access to hardware so it goes through host operating system
  \*\* bare metal hypervisor environment tackles performance issue of installing on and running from host machine's hardware, interfaces directly with underlying hardware and doesn't need host OS to run on; has its own device drivers and interacts with each component directly for any I/O, processing, etc. -> better performance, scalability and stability but hardware compatibility is limited because hypervisor has limited device drivers
* VM (Apps, Bins/Libs, Guest OS) -> Hypervisor -> Host OS -> Server; VMs package up the virtual hardware, a kernel i.e. OS, and user space for each new VM
* Container: operating-system-level virtualization by abstracting the "user space"; has private space for processing, can execute commands as root, have private network interface and IP address, allow custom routes and iptable rules, can mount file systems, etc.
  ** containers share the host system's kernel with other containers
  ** containers (app and bins/libs) -> Docker engine -> Host OS -> Server; containers package up the user space and not the kernel/virtual hardware like a VM does; each container gets its own isolated user space to allow multiple containers to run on a single host machine; lightweight because operating system level architecture shared across containers
* Pros and Cons of Full Machine Virtualization vs. Containers
  ** Full Machine Virtualization - greater isolation at cost of greater overhead as each VM runs its own full kernel and and operating system instance
  ** Containers - less isolation but lower overhead through sharing certain portions of host kernel and operating system instance
* Docker - open-source project based on Linux containers; uses Linux Kernel features like namespaces and control groups to create containers on top of an OS
  ** ease of use to build and test portable applications, anyone can package an app that can run unmodified on any public/private cloud or bare metal
  ** lightweight and fast, sandboxed environments running on kernel and take up fewer resources vs. VM that boots up a full virtual OS everytime
  ** Docker Hub: app store for Docker images, public images ready to pull down from community
  ** modularity and scalability: break out your application's functionality into individual containers; update components independently in the future

### Fundamentals:

---

#### Docker Engine

* Docker engine = layer on which Docker runs, lightweight runtime and tooling that manages containers, images, builds, etc.; runs natively on Linux systems
* made up of a Docker Daemon that runs in host computer
* made up of a Docker Client that then communicates with the Docker Daemon to execute commands
* REST API for interacting with the Docker Daemon remotely

#### Docker Client

* Docker Client = what you as the end user of Docker communicate with; the UI for Docker
* i.e. running command like `docker build ...some image...` communicates with Docker Client and then communicates instructions to Docker Daemon

#### Docker Daemon

* Docker Daemon = actually executes commands sent to the Docker Client like building, running, distributing your containers
* runs on host machine but user never communicates directly with Daemon

#### Dockerfile

* Dockerfile = where you write the instructions to build a Docker image
* `RUN apt-get -y install som-package`: install a software package
* `EXPOSE 8000`: expose a port
* `ENV ANT_HOME /usr/local/apache-ant` to pass an environment variable
* once you have the Dockerfile set up you can use `docker build`

#### Docker Image

* Images are read-only templates that you build from a set of instructions written in your Dockerfile
* define what you want your packaged application and its dependencies to look like and what processes to run when it's launched
* each instruction in Dockerfile adds a new "layer" to the image with layers representing a portion of the images file system that either adds to or replaces the layer below
  ** uses Union File System to achieve layers
  ** Docker uses Union File Systems to build up an image; stackable file system meaning files and directories of separate file systems known as branches can be transparently overlaid to form a single file system
  ** the contents of directories which have the same path within the overlaid branches are seen as a single merged directory to avoid the need to create separate copies of each layer but rather be given pointers to the same resource
  ** benefits: duplication-free (no need to duplicate set of files every time you use an image to create and run a new container), layer segregation (changes to image => propagate updates to layer that changed)

#### Volumes

* "data" part of a container, initialized when a container is created; volumes allow you to persist and share a container's data; separate from the Union File System and exist as normal directories and files on the host filesystem
* when you destroy, update, or rebuild your container, the data volumes will remain untouched
* data volumes can be shared and reused among multiple containers and need to make changes to it directly

#### Docker Containers

* wraps an application's software into an invisible box with everything the application needs to run like the OS, application code, runtime, system tools/libraries, etc.
* built off Docker images that are read-only; adds a read-write file system over the read-only file system of the image to create a container
* creates a network interface that the container can talk to the local host, attaches an available IP address to the container and executes the process that you specified to run your application when defining the image
* namespaces provide containers with their own view of the underlying Linux system, limiting what the container can see and access; when you run a container, Docker creates namespaces that the specific container will use
  ** NET: network stack of system like network devices, IP addresses, IP routing tables, port numbers, etc.
  ** PID: process ID, scoped view of processes they can view and interact with, including an independent init (PID 1) which is the "ancestor of all processes"
  ** MNT: view of the "mounts" on the system; processes in different mount namespaces have different views of the filesystem hierarchy
  ** UTS: UNIX Timesharing System, allows a process to identify system identifiers (i.e. hostname, domainname, etc.), allows containers to have their own hostname and NIS domain name that is independent of other containers and the host system
  ** IPC: InterProcess Communication, responsible for isolating IPC resources between processes running inside each container
  ** USER: isolate users within each container, allows containers to have a different view of the uid (user ID) and gid (group ID) ranges as compared with the host system -> allows a process to have unprivileged user outside a container without sacrificing root privilege inside a container
* control groups (cgroups) isolate, prioritize, and account for resource usage (CPU, memory, disk I/O, network, etc.) of a set of processes; makes sure that Docker containers only use the resources they need and set limits to what resources a container can use
  \*\* ensure single container doesn't exhaust one of those resources and brings system down
* isolated union file system
* issues with security as container can make syscalls to host kernel so VMs can only issue hypercalls to host hypervisor
* great to break up app into functional discrete parts but can be unwieldy to manage large number of them vs. running multiple applications on multiple servers with VMs

### Docker Curriculum Tutorials

#### Docker Curriculum: Intro

* `docker pull <image>` pulls an image from the Docker registry and saves it to your system
* `docker images` to see list of all images on your system
* `docker run <image>` to run a Docker container based on an image; it finds image, loads up container and runs command in that container i.e. `docker run busybox echo "hello from busybox"`
  \*\*`docker run -it <image> sh` allows you to attach many commands in container
  \*\* `docker run --help` to see list of all flags
* `docker ps` shows you all containers currently running; `docker ps -a` shows list of all containers that we ran
* best to clean up stray containers eating up disk space after doing `docker run` many times with the `docker rm` command
  ** i.e. `docker rm 305297d7a235 ff0a5c3750b9` (copy container IDs)
  ** can delete multiple without copy-pasting IDs like `docker rm $(docker ps -a -q -f status=exited)` (-q returns back numeric IDs, -f filters based on conditions, gets status exited for containers, can pass --rm flag after running to automatically delete container once exited)
  \*\* can also delete images that you no longer need by running `docker rmi`
* Docker Daemon - background service running on host that manages building, running and distributing Docker containers; process that runs in operating system to which client talks to
* Docker Client - command line tool that allows user to interact with daemon
* Docker Hub - registry of Docker images; directory of all available Docker images; one can host their own Docker registries and can use them for pulling images

#### Docker Curriculum: Webapps

* need to pull image of webserver and publish ports to expose it for the client; can also run in detached mode so you can close your terminal and keep container running
  \*\* `docker run -d -P --name static-site <image-for-site>` (-P publish all exposed ports to random ports, --name is name of container)
  \*\* `docker port <containername>` tells us the ports running for the container so you can access later like http://localhost:<port>
  \*\* can specify a custom port to which client will forward connections to container `docker run -p 8888:80 <image-for-site>`
  \*\* to stop a detached container you can run `docker stop` and give container ID
* images are the basis for containers and Docker client runs a container based on that image
  \*\* `docker images` to see list of images available locally
  \*\* `TAG` refers to a particular snapshot of the image; `IMAGE ID` is unique identifier for that image
  \*\* images can be committed with changes and have multiple versions; if you don't provide a specific version number, the client defaults to `latest`
  \*\* to get a new Docker image, you can get it from registry like Docker Hub or create your own; `docker search`
  \*\* base images = images with no parent image, usually images with an OS like ubuntu, busybox or debian
  \*\* child images = images built on base images and add additional functionality
  \*\* official images = maintained by Docker i.e. python, ubuntu, busybox, hello-world
  \*\* user images = created and shared by users that build on base images i.e. user/image-name
* Dockerfile = text file that contains a list of commands that Docker client calls while creating an image
  ** automate the image creation process, identical to Linux commands
  ** `FROM` to specify a base image
  \*\* usually write commands to copy files and install dependencies
  \*\* `EXPOSE` to expose a port for the app running in Docker
  \*\* `CMD` to execute a command in container when it is started
  \*\* `docker build` with optional `-t` and a location of the directory containing Dockerfile
  \*\* i.e. `docker run -p 8888:5000 user/image` to expose port 8888 where the app lives vs. 5000 for server inside container
* Docker on AWS i.e. Elastic Beanstalk
  \*\* need to publish our image on a registry (Docker Hub or your own personal/hosted one) which can be accessed by AWS; `docker push user/image` (you may need to do `docker login` first)
  \*\* Elastic Beanstalk can run single-container Docker deployments, platform as a service like Heroku
* Multi-container environments
  * we'll need a database/persistent storage like Redis/Memcached for web apps; keep containers for each of the services separate as each tier needs different resources and may grow at different rates -> microservices
  * sample backend: Python (Flask) and Elasticsearch for search -> two containers plus Node to install packages
  * can use `apt-get` to install dependencies
  * Docker network creates three networks automatically: bridge, host, null
    * bridge = network in which containers are run by default i.e. `docker network inspect bridge` to see container's IP address and `docker ps` to see which port it is running on
      * bridge is shared by every container by default so method is not secure
      * can create our own bridge network using `network create` and launch our containers inside this network using `--net`
      * Docker makes the correct host file entry in /etc/hosts so it resolves to the IP address of the specific container
      ```bash
        docker build -t user/image
        docker network create <bridge_network>
        docker run -d --net <bridge_network> -p 9200:9200 -p 9300:9300 --name <some_container_name> <image>
        docker run -d --net <bridge_network> -p 5000:5000 --name <some_container_name> user/image
      ```
      * before 1.9 you would have to use `link` to bridge containers -> to be deprecated in future
* Docker Machine - create Docker hosts on your computer, cloud providers or inside your own datacenter
* Docker Compose - tool for defining and running multi-container Docker applications

  * provides configuration file called `docker-compose.yml` to bring up app and suite of services it depends on with one command
  * written in Python so can install with `pip install docker-compose`

  ```bash
    version: "2"
    services:
      es:
        image: elasticsearch
      web:
        image: user/image
        command: python app.py
        ports:
          - "5000:5000"
        volumes:
          - .:/code
  ```

  * `volumes` parameter specifies a mount point where code will reside in container
  * `docker stop $(docker ps -q)` to stop running containers
  * `docker-compose up` to run the Docker containers running successfully
  * `docker-compose stop` to stop the services from running
  * docker-compose handles creating a new network for us and attaches the services in the network so each of these are discoverable to the other; each container for a service joins the default network and is both reachable by other containers on that network and discoverable by them at hostname identical to container name (check /etc/hosts to verify)
  * service discovery using DNS server to ping different hostnames

* Elastic Container Service (ECS) by AWS - scalable and flexible container management service that supports Docker containers

  * can operate Docker cluster on top of EC2 instances via an API; CLI tool to get started

* Docker Swarm - native clustering solution for Docker

### Docker Compose

#### Overview

Docker Compose: use a YAML file to configure your application's services and with a single command, create and start all the services from your configuration; allows you to define and run multi-container applications with Docker

1.  Define app's environment with a `Dockerfile` so it can be reproduced anywhere
    i.e. Building an image with Python 3.4 image, adding current directory into /code in image, setting working directory to /code, installing Python dependencies, and setting default command for container to `python app.py`

    ```docker
      FROM python:3.4-alpine
      ADD . /code
      WORKDIR /code
      RUN pip install -r requirements.txt
      CMD ["python", "app.py"]
    ```

2.  Define the services that make up your app in `docker-compose.yml` so they can run together in an isolated environment
    i.e. use an image built from Dockerfile in the current directory, forwards the exposed port 5000 on the container to port 5000 on the host machine, `volumes` key bind mounts the project directory (current directory) on the host to /code inside the container, allowing you to modify the code on the fly without having to rebuild the image

```docker
  version: '3'
  services:
    web:
      build: .
      ports:
        - "5000:5000"
      volumes:
        - .:/code
    redis:
      image: "redis:alpine"
```

3.  Run `docker-compose up` and Compose starts and runs your entire app; run `docker-compose down` to stop the application

* if you want to run your services in the background, you can pass the `-d` flag for "detached" mode
* `docker-compose ps` to see what services are running
* `docker-compose run` to run one-off commands for services i.e. `docker-compose run web env` to check what environment variables are available to the web service
* if started Compose with `docker-compose up -d`, stop your services once you finished them `docker-compose stop`
* can bring everything down, removing containers entirely with down command, pass `--volumes` to remove the data volume used by the container i.e. `docker-compose down --volumes`
* `-f` to specify which compose files
* `-p` to specify a project name
* variables starting with DOCKER\_ are same as those used to configure Docker CLI

### Sources:

* [Scott Lowe's Quick Introduction to Docker](https://blog.scottlowe.org/2014/03/11/a-quick-introduction-to-docker/)
* [A Brief Introduction to Linux Containers with LXC](https://blog.scottlowe.org/2013/11/25/a-brief-introduction-to-linux-containers-with-lxc/)
* [A Beginner-Friendly Introduction to Containers, VMs, and Docker](https://medium.freecodecamp.org/a-beginner-friendly-introduction-to-containers-vms-and-docker-79a9e3e119b)
* [A Docker Tutorial for Beginners](https://docker-curriculum.com/)
* [Docker Compose Docs](https://docs.docker.com/compose/overview/)

---

## Kubernetes Notes

---

### Kubernetes Sources

* [Digital Ocean's An Introduction to Kubernetes](https://www.digitalocean.com/community/tutorials/an-introduction-to-kubernetes)
* [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
