Docker and Containers
- more like a process, CRUD, networking, shelling into containers
- image basics, Docker Hub, Dockerfiles, push custom images, build images
- container lifetime and handling persistent data, docker volumes, bind mounts
- docker compose (multi-container automation), docker-compose.yml, docker-compose up
- docker swarm to build a cluster of nodes, overlay networks, routing mesh, swarm services for high availability containers
- stacks, secrets for config, app deploy lifecycle, local dev, CI testing, etc.

- Docker on Windows: 
Linux Containers (default) and Windows Containers

- Docker for Mac Tips:
bash command completion, code paths enabled for bind mounts (/users by default)
run more nodes: docker-machine create --driver
Dockerfile/Compose file editor with Visual Studio code
iTerm2 + oh-my-zsh

Docker Context:

- Physical server with Host operating system installed, bins/libs, apps
  - Problem: 
    - Huge cost
    - Slow deployment
    - Hard to migrate to different vendors i.e. from IBM to Dell servers and lots of configurations required
- Better: hypervisor-based virtualization
  - Can install multiple virtual machines on a single physical server
  - Can have operating system per guest OS i.e. Ubuntu and Debian 
  - Hypervisor on top of the host operating system
  - Multiple applications per physical server
  - Providers such as VMWare and Virtual Box; can set up VMs in AWS, Microsoft Azure
  - Benefits:
    - Cost-efficient, paying for compute power/storage you use
    - Easy to scale with VMs in cloud
  - Cons:
    - Kernel resource duplication (can have multiple guest operating systems and replicating a lot)
    - Application portability issue
- Even better: container-based virtualization
  - Infrastructure with operating system; installed container engine
  - Have containers on top with app and bin/libs
  - Only one operating system/kernel and running separate containers through container engine; virtualization at operating system level; sharing the host operating system as more efficient and lightweight
  - Runtime isolation: how to run two different Java applications with two different JREs on the same VM? tough to do with VMs but we can isolate two runtime environments in containers; one container with JRE 8 and one container with JRE 7
  - Benefits:
    - Cost-efficient - can have more containers running on one physical machine than VMs
    - Fast deployment - several times faster to boost than VM
    - Great portability - independent, self-sufficient application bundles run across machines without compatibility issues

Docker Client-Service Architecture:

- Client = primary user interface to docker accepting commands and communicates with Docker daemon/server; i.e. command-line and kitematic UI
- Docker Daemon/Engine/Server - persistent process responsible for building, running, and distributing
  - Containers run on same docker host but can connect to remote docker daemon
  - Can't run on non-Linux platforms natively because it uses Linux specific kernel features i.e. Windows/OS X need to have Linux VM for Docker daemon to run inside

Docker Concepts:

- Images: read only templates used to create containers
  - Created with docker build command either by us or other docker users
  - Composed of layers of other images
  - Stored in Docker registry such as Docker Hub
- Containers: if image is class, container is an instance of a class - a runtime object
  - lightweight and portable encapsulations of an environment in which to run applications; created from images
  - has all binaries and dependencies needed to run the application
- Registries: where we store our images
  - can host your own registry or use Docker's public registry called Docker Hub
  - images are stored in repositories
  - Docker repository is a collection of different Docker images with the same name that have different tags, each tag usually represents a different version of the image (default is latest tag)
- Docker Hub = public Docker registry with images we can use
  - Using official images for clear docs, security updates, dedicated team for reviewing image content
  - username/repository vs. official mysql

Helloworld Container:

- busybox official image for hello world
- Docker will first look for the image in the local box; otherwise Docker will download the image from remote Docker registry
- `docker images` to check images in local box
- `docker run` will create container using image we specified, spin it up and run it
  - `docker run busybox:1.24` - `repository:tag` => `docker run repository:tag command [arguments]`
  - `docker run busybox:1.24 echo "hello world"` and `docker images` shows the downloaded busybox image with a unique ID
  - `docker run` again uses the local image instead and runs faster
  - `docker run -i -t` => -i for interactive container, -t creates pseudo-TTY that attaches stdin and stdout => allows you to go inside the container and do like `ls` to see the root level contents and add files inside; `exit` to exit the container and container shuts down
    - Redoing the same command starts up a new container and the created file is gone
    
Deep Dive into Docker Containers:

- Running containers in foreground with docker run as it attaches console to process's standard input, output, and error (default mode); can't use console for other commands after container is started up
- Running containers in background aka started in detached mode and exit when the root process used to the run the container exists with the -d option; console can be used for other commands after the container is started up
- Running containers in detached/background mode
  - `docker run -d busybox:1.24 sleep 1000` -> returns us the long id of the Docker container
  - `docker ps` to see all the running containers in our local box
    - `docker ps -a` to see all the containers that we previously ran
    - `docker run --rm busybox:1.24 sleep 1` to remove the container after exiting - `docker ps -a` doesn't list this container as it is removed after running
  - `docker run --name hello_world busybox:1.24` and `docker ps -a` shows container with hello_world name; Docker automatically generates name if we don't include the name
  - `docker inspect` displays low level information about a container or image
    - `docker run -d busybox:1.24 sleep 100` and `docker inspect [containerId]` and gives us JSON including IP and MAC address of contianer
    - Tells us image id, log path, and other information

Docker Port Mapping and Docker Logs Command

- tomcat web server - can map port to another port with -p
  - `-p host_port:container_port`
- `docker run -it -p 8888:8080 tomcat:8.0` to expose tomcat's 8080 port to our host 8888 port
  - Can access tomcat webserver through the web browser; copy the Docker machine host IP i.e. localhost:8888 should open up the tomcat console page
- `docker run -it -d -p 8888:8080 tomcat:8.0` and returns the container id since in detached mode
  - `docker logs [containerId]`

Working with Docker Images

- Images made up of image read only layers, stacked on top of each other and built on top of base
- `docker history busybox:1.24` to see the layers for the image
- All changes made into the running containers will be written into the writable layer
- When the container is deleted, the writable layer is also deleted but the underlying image remains unchanged
- Multiple containers can share access to the same underlying image
- Ways to build Docker image
  - Commit changes made in a Docker container
    - Spin up a container from a base image i.e. debian
      - `docker run -it debian:jessie` to pull from docker hub
    - Install Git package in container
      - `apt-get update && apt-get install -y git`
    - Commit changes in container - save the changes we made to the Docker container's file system to a new image
      - `docker ps -a` to get container id
      - `docker commit [containerId] [repositoryName]:[tag]` and returns back image id
      - `docker images` to see the new image id - has larger size because extended base debian image
      - `docker run -it new/debian:1.0` and you can do `git` inside
  - Write a Dockerfile
    - Text document containing all instructions users provide to assemble an image
    - Each instruction will create a new image layer to the image
    - Instructions specify what to do when building an image
      - `FROM debian:jessie` to specify the base image
      - `RUN apt-get update` and `RUN apt-get install -y git` and `RUN apt-get install -y vim` to execute commands in Linux terminal
    - `docker build -t alfredlucero/debian .`
      - Docker build commands takes the path to the build context as an argument - if you want to use some files locally
      - When build starts, the Docker client would pack all the files in the build context into a tarball then transfer the tarball file to the daemon
      - By default, Docker would search for the Dockerfile in the build context path
      - Goes through each step in the Dockerfile and has ephemeral intermediate containers to commit image for each layer and goes onto the next instruction
      - Each RUN command will execute the command on the top writable layer of the container, then commit the container as a new image
      - The new image is used for the next step in the Dockerfile so each RUN instruction will create a new image layer
      - Recommended to chain RUN instructions in the Dockerfile to reduce the number of image layers it creates
        - `RUN apt-get update && apt-get install -y git vim`
    - `docker images` to see image tagged with latest by default
    - Sort multi-line arguments alphanumerically to avoid duplication of packages and make it easier to update
    - `CMD` instructions specifies what command you want to run when the container starts up
      - If we don't specify `CMD` instruction in the Dockerfile, Docker will use the default command defined in the base image
      - Doesn't run when building the image but only when the container starts up
      - Can specify command in exec or shell form
      - `CMD ["echo", "hello world"]`
      - Can override the CMD instruction like `docker run [containerId] echo "hello world"`
    - Docker cache
      - Each time Docker executes an instruction it builds a new image layer
      - The next time if the instruction doesn't change, Docker will simply reuse the existing layer
      - Aggressive caching - should chain update and install commands to make sure versions are aligned for the packages
      - Can also invalidate cache with `--no-cache=true`
    - `COPY` instruction to copy new files/directores from build context and adds them to the file system in the container
      - `COPY abc.txt /src/abc.txt`
    - `ADD` instruction cannot only copy files but also allow you to download a file from internet and copy to container
      - Ability to automatically unpack compressed files
      - Use COPY for sake of transparency unless you need ADD
    - Push images to Docker Hub
      - Need to create Docker Hub account in hub.docker.com
      - Link image to Docker Hub account i.e. docker_hub_id/repository_name
      - `docker images` to see images to push
      - `docker tag [imageId] [repositoryName]:1.01`
      - Latest Tag
        - Docker uses latest as default when no tag is provided
        - A lot of repositories use it to tag the most up to date stable image; only convention but not enforced
        - Images tagged latest will not be updated automatically when a newer version of the image is pushed to the repository
        - Avoid using latest tag and version it well instead
      - `docker login --username=[username]` to log into Docker Hub account 
      - `docker push [repositoryname]:1.01` and can check repository and image details to see what happened with tags

Create Containerized Web Applications

- Dockerizing Python Flask server app
- `docker run -d -p 5000:5000 [imageId]`
- `docker-machine ls` and copy IP address to browser URL with port 5000 (or put localhost)
- `docker exec` allows you to run a command in a running container
  - `docker exec it [containerId] bash` -> can do `pwd` and `cd` around
  - `ps axu` to see all the running processes in container

```
FROM python:3.5
RUN pip install Flask==0.11.1
RUN useradd -ms /bin/bash admin
USER admin
WORKDIR /app
COPY app /app
CMD ["python", "app.py"]
```

- Implement a simple key-value lookup service with Redis for an in-memory data structure such as database, cache, message broker; built-in replication and different levels of on-disk persistence
- `docker ps` command to find name of running container
- `docker stop [containerName]` to stop running container
- Use a python redis client to interact with redis
- Using Docker Container links
  - Recipient container (app) can access select data about the source container (redis); uses container names
  - `docker run -d --name redis redis:3.2.0`
  - `docker ps` to verify redis is up and running
  - `docker build -t dockerapp:v0.3 .` and `docker run -d -p 5000:5000 --link redis dockerapp:v0.3`
  - How container links work?
    - `docker exec it [containerId] bash`
    - `more /etc/hosts` to see entry for redis container name and container id and associated IP address
    - `docker inspect [containerId] | grep IP` to confirm IPs match
    - `docker exec -it [containerId] bash` and `ping redis` to see where the requests are hitting for IP address
  - Benefits
    - Able to run many independent components in different containers
    - Creates a secure tunnel between the containers that doesn't need to expose any ports externally on the container (don't need the -p flag)

```
FROM python:3.5
RUN pip install Flask==0.11.1 redis==2.10.5
RUN useradd -ms /bin/bash admin
USER admin
WORKDIR /app
COPY app /app
CMD ["python", "app.py"]
```

- Docker Compose
  - Manual linking containers and configuring services becomes impractical when the number of containers grow
  - Set up a `docker-compose.yml` file with configuration
  - `docker-compose version` to display current version
  - `docker stop [containerId]`
  - `docker-compose up` to build images for all services defined in the yml file and runs containers
  - `docker-compose ps` to see all containers managed by compose
  - `docker-compose logs -f` to see colored logs for host managed containers or `docker-compose logs [containerName]`
  - `docker-compose stop` to stop all running containers without removing them and can be restarted with `docker-compose up` command
  - `docker-compose rm` to remove containers
  - Upon making changes to the code i.e. Dockerfile, we need to rebuild the Docker image; `docker-compose up -d` will only rebuild the image if the image doesn't exist and `docker exec -it [containerId] bash`
  - `docker-compose build` command to rebuild and update the image and `docker-compose up -d` to recreate the container since it found a new image (see created information)

```
version: '3' # won't need linking anymore if you are using Docker compose version 2 or above, only need to refer to other services by name due to Docker network
services:
  # client of redis
  dockerapp:
    build: . # Defines path to Dockerfile used to build dockerapp image (sitting in same directory as yml file)
    ports: # to expose to external network
      - "5000:5000" # host port: container port
    depends_on: # starts redis container first before dockerapp
      - redis
  redis:
    image: redis:3.2.0
```

Docker Networking

- Bridge network interface docker0 provisioned on host to bridge traffic from outside network to internal containers hosted on host machine
- Containers can connect to each other and the outside world through bridge
- Network Types
  - Closed/None
    - No access to outside world
    - Adds container to container specific network stack and lacks container interface; isolated/closed
    - `docker run -d --net none busybox sleep 1000`
    - `docker exec -it <containerId> /bin/ash` to log in container
      - `ping 8.8.8.8` inside closed container shouldn't be able to reach google's public dns
      - `ifconfig` to list network interfaces and you should see only one called loopback 127.0.0.1
    - Provides maximum level of network protection; not good choice if network or Internet connection is required
  - Bridge
    - `docker network inspect bridge` 
    - `docker run -d --name container_1 busybox sleep 1000`
    - Default network with access to outside world; 172.17.0.0 - 172.17.255.255; can access containers in the same bridge network
    - `docker exec -it container_1 ifconfig`
    - `docker run -d --name container_2 busybox sleep 1000` -> IP Address 172.17.0.3
    - Can ping outside world from within
    - Containers within one bridge network can access containers in another bridge network
    - `docker network create --drive bridge my_bridge_network`
      - `docker network ls` shows newly created docker network and `docker network inspect my_bridge_network`
      - `docker run -d --name container_3 --net my_bridge_network busybox sleep 1000` to use the created bridge network and IP will fall under that network
    - `docker network connect bridge container_3` to connect container to another bridge
    - `docker network disconnect bridge container_3` to disconnect from bridge network
    - Containers have access to two network interfaces
      - loopback interface without network access to outside
      - private interface connected to bridge network of host
      - All containers within same bridge network can communicate with each other; those from other networks can't connect with each other by default
      - Reduces level of network isolation in favor of better outside connectivity
      - Most suitable where you want to set up a relatively small network on a single host
  - Host
    - The least protected network model as it adds a container on the host's network stack
    - Containers deployed on the host stack have full access to the host's interface
    - Commonly called open containers
    - `docker run -d --name container_4 --net host busybox sleep 100`
    - `docker exec -it container_4 ifconfig` - see host ips
    - minimum network security level; no isolation and containers widely unprotected
    - Containers running in host network stack should see higher level of performance than those traversing docker0 bridge and iptables port mappings
  - Overlay
    - Supports multi-host networking out of the box; common in multi-host production types
    - Requires pre-existing conditions before it can be created
      - Running Docker engine in Swarm mode
      - Require a key-value store such as consul
- `docker network ls` - should show bridge, host, none
- Define container networks with Docker Compose
  - `docker-compose up -d` -> network driver bridge i.e. "dockerapp_default"; verify with `docker network ls`
  - `docker-compose down` and network shouldn't be there anymore
  - Sample below creates "dockerapp_my_net" as "bridge"
  - Can have multiple networks i.e. for frontend and backend with different custom drivers; popular for multi-tier services

```yml
version: '3'
services:
  dockerapp:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - redis
    networks:
      - my_net
  redis:
    image: redis:3.2.0
    networks:
      - my_net
networks:
  my_net:
    driver: bridge
```

Create a Continuous Integration Pipeline

- Running unit tests in containers and spin up in seconds; using unittest framework; great to incorporate unit test into docker images
- `docker-compose run dockerapp python test.py`
- Single image used through development, testing, and production to ensure reliability of tests
  - Cons: increases size of image
- Continuous Integration - isolated changes are immediately tested and reported when they are added to a larger code base; provide rapid feedback so that if a defect is introduced into codebase it can be identified and corrected as soon as possible
- Continuous integration server such as Circle CI checks out source code, builds, runs unit tests, packages, archives
- Builds docker image, pushes image to Docker registry, pull Docker image, and run application within container i.e. staging/production

```yml
version: 2
jobs:
  build:
    working_directory: /dockerapp
    docker:
      - image: docker:17.0.5.0-ce-git
    steps:
      - checkout
      - setup_remote_docker
      - run:
          name: Install dependencies
          command: |
            apk add --no-cache py-pip=9.0.0-r1
            pip install docker-comopse=1.15.0
      - run:
          name: Run tests
          command: |
            docker-compose up -d
            docker-compose run dockerapp python test.py
      - deploy:
          name: Push application Docker image
          command: |
            docker login -e $DOCKER_HUB_EMAIL -u $DOCKER_HUB_USER_ID -p $DOCKER_HUB_PWD
            docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
            docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:latest
            docker push dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
            docker push dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:latest
```

Deploy Docker containers in production

- Many believe it's good for distributed applications in production
- Some missing pieces about Docker around data persistence, networking, security, identity management
- Ecosystem of supporting Dockerized applications in production such as tools for monitoring and logging are still not fully ready yet
- Why running Docker containers in VMs?
  - To address security concerns
  - Hardware level isolation 
  - Google Container Enginer or AWS EC2 use VMs internally
  - Use Docker Machine to provision new VMs, install Docker Enginer, configure Docker client -> VirtualBox to provision Linux VMs; various Docker Machine drivers for AWS, DigitalOcean, Google App Engine, VirtualBox
- Deploy Docker app to cloud using Docker Machine
  - `docker-machine ls`
  - `docker-machine create --driver digitalocean --digitalocean-access-token <token> docker-app-machine`
  - `docker info`
- Introduction to Docker Swarm and set up Swarm cluster
  - `docker swarm`; Docker swarm manager, can group multiple hosts into a cluster and distribute Docker containers
  - Multiple users can share same swarm cluster
  - Worker node, Manager node
  - TO deploy your application to a swarm, you submit your service to a manager node
  - Manager node dispatches units of work called tasks to worker nodes
  - Manager nodes also perform orchestration and cluster management functions required to maintain the desired state of the swam
  - Worker nodes receive and execute tasks dispatched from manager nodes
  - Agent runs on each worker node and reports on tasks assigned to it. The worker node notifies the manager node of the current state of its assigned tasks so that the manager can maintain the desired state of each worker
  - Step 1: Deploy two VMs, one for Swarm manager node and other will be used as worker node `docker-machine create` both nodes
  - Step 2: Appoint the first VM as Swarm manager node and initialize a Swarm cluster `docker swarm init --advertise-addr <IP>`
  - Step 3: Let second VM join the Swarm cluster as worker node `docker swarm join --token <token> IP` (may need to `docker-machine ssh swarm-node`)
  - `docker swarm leave`
  - For Docker-compose 3.x, you can set `deploy` key with replicas: X
    - Options can be used to load balance and optimize performance for each service
  - Can connect to nginx service through a node which does not have nginx replicas
  - Ingress load balancing
    - All nodes listen for connections to published service ports
    - When that service is called by the external systems, the receiving node will accept the traffic and internally load balance it using an internal DNS service that Docker maintains
  - Docker stack
    - Group of interrelated services that share dependencies and can be orchestrated and scaled together
    - Live collection of all the services defined in your Docker compose file
    - `docker stack deploy`
    - In Swarm mode, Docker compose files can be used for service definitions
    - Commands can't be reused and can only schedule containers to a single node

```yml
version: "3.3"
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    deploy:
      replicas: 3 # Swarm manager and 3 nginx replicas
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
        restart_policy:
          condition: on-failure
```
