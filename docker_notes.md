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

