---
title:Dockerfile 
---

### Dockerfile 的作用

镜像的定制实际上就是定制每一层所添加的配置、文件。如果我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，那么之前提及的无法重复的问题、镜像构建透明性的问题、体积的问题就都会解决。这个脚本就是 Dockerfile。

### 2 Dockerfile的作用

Dockerfile 是一个文本文件，其内包含了一条条的 **指令(Instruction)**，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。

假设我们有个 `Dockerfile`文件

```
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

在该文件所在目录，我们可以通过以下命令，构建一个新的镜像

```
docker build -t nginx:v1 .
```

这个命令表示我们新建了一个 image,此时在执行 `docker iamge ls `

```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               v1                  f6374b97ebf2        8 seconds ago       126MB
```

可以发现我们定制化的 镜像生成了；

### 3 Dockerfile 文件中各个指令的作用

#### FROM

所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。就像我们之前运行了一个 `nginx` 镜像的容器，再进行修改一样，基础镜像是必须指定的。而 `FROM` 就是指定 **基础镜像**，因此一个 `Dockerfile` 中 `FROM` 是必备的指令，并且必须是第一条指令。

#### RUN

 指令是用来执行命令行命令的。由于命令行的强大能力，`RUN` 指令在定制镜像时是最常用的指令之一。其格式有两种：

- *shell* 格式：`RUN <命令>`，就像直接在命令行中输入的命令一样。刚才写的 Dockerfile 中的 `RUN` 指令就是这种格式。

```docker
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

- *exec* 格式：`RUN ["可执行文件", "参数1", "参数2"]`，这更像是函数调用中的格式。

[RUN](https://docs.docker.com/engine/reference/builder/#run) is an image build step, the state of the container after a `RUN` command will be committed to the docker image. A Dockerfile can have many `RUN` steps that layer on top of one another to build the image.

[CMD](https://docs.docker.com/engine/reference/builder/#cmd) is the command the container executes by default when you launch the built image. A Dockerfile can only have one `CMD`. The `CMD` can be overridden when starting a container with `docker run $image $other_command

注意，指定了`CMD`命令以后，`docker container run`命令就不能附加命令了（比如前面的`/bin/bash`），否则它会覆盖`CMD`命令。现在，启动容器可以使用下面的命令。



[ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint) is also closely related to `CMD` and can modify the way a container starts an imag

#### WORKDIR

使用 `WORKDIR` 指令可以来指定工作目录（或者称为当前目录），**以后各层的当前目录就被改为指定的目录**，如该目录不存在，`WORKDIR` 会帮你建立目录。

Dockerfile 中每一个指令都会建立一层，`RUN` 也不例外。每一个 `RUN` 的行为，就和刚才我们手工建立镜像的过程一样：新建立一层，在其上执行这些命令，执行结束后，`commit` 这一层的修改，构成新的镜像。

```docker
RUN cd /app
RUN echo "hello" > world.txt
```

如果将这个 `Dockerfile` 进行构建镜像运行后，会发现找不到 `/app/world.txt` 文件，或者其内容不是 `hello`。原因其实很简单，在 Shell 中，连续两行是同一个进程执行环境，因此前一个命令修改的内存状态，会直接影响后一个命令；而在 `Dockerfile` 中，这两行 `RUN` 命令的执行环境根本不同，是两个完全不同的容器。这就是对 `Dockerfile` 构建分层存储的概念不了解所导致的错误。