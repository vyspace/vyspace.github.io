---
title: 分布式平台前期规划
categories:
  - ai
tags:
  - 大数据
date: 2018-03-17 11:08:12
---
完成上一篇文章[《服务器批量安装》](/ai/hadoop-servers/)的内容后，我们已经拥有了4台Linux服务器，且相互之间网络可以互通，并且正常运行[SHH服务](https://baike.baidu.com/item/ssh/10407?fr=aladdin)。硬件环境已经准备完成，这篇文章我们将开始讲述<font color=#c00>Hadoop前期规划</font>的准备工作。[Hadoop](https://baike.baidu.com/item/Hadoop/3526507?fr=aladdin)是一系列工具的集合，如何合理的规划这些工具以及分配服务器资源，<font color=#c00>是一个非常重要的工作</font>。

# Quick Start

## <font color=#c00>主机名配置</font>

我将分别修改主机名为node0，node1，node2，node3。方便教程的讲述，也方便ssh中的操作。选择其中一台服务器，<font color=#c00>root用户</font>登陆。

<!--more-->

### 查看主机名

``` bash
hostname
```

### 修改主机名

- 方法一：修改network文件，将HOSTNAME后面的值改为node0，重启后生效。


``` bash
vim /etc/sysconfig/network
```

- 方法二：修改当前的主机名，立即生效。


``` bash
hostname node0
```

### 配置hosts文件

修改/etc/hosts文件，<font color=#c00>ip0为你自己机器的ip地址</font>

``` bash
ip0 node0
ip1 node1
ip2 node2
ip3 node3 
```

### 分发hosts文件

将hosts文件分发到其他3台机器中，以保证所有服务器识别主机名。

``` bash
scp /etc/hosts root@node1:/etc/
scp /etc/hosts root@node2:/etc/
scp /etc/hosts root@node3:/etc/
```

## <font color=#c00>批量管理工具推荐</font>

如果你想更快，更省力的完成批量操作，有兴趣的童鞋可以安装[Linux集群批量管理工具parallel-ssh(PSSH)](http://www.theether.org/pssh/)，该工具需要<font color=#c00>Python环境</font>，[安装及操作点击此处链接](http://man.linuxde.net/pssh)，该教程中还是采用普通命令进行讲述。

## <font color=#c00>配置免密码登录</font>

之后的服务器命令都需要免密码才能正常操作，这是一个必须而重要的步骤。我以node0批量操作其他服务器为例。此步骤需要在所有服务器中完成一边，以方便任意两台机器可以互相登陆。

### 创建本机的公钥与私钥

``` bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 0600 ~/.ssh/authorized_keys
```

### 分发公钥到其他3台服务器

我以node1为例

``` bash
scp ~/.ssh/id_rsa.pub root@node1:~/
```

### 公钥追加

进入node1的root账户的home目录下，运行如下命令。完成后，就可以从node0免密码登录到node1了。

``` bash
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

## <font color=#c00>安装Java环境</font>

hadoop整套工具都以Java环境为基础，所以4台机器都需要安装。我们以node0为例。

### 查看是否安装

``` bash
syum list installed | grep java
```

### 查看yum库中的Java安装包

``` bash
yum -y list java*
```

### 安装Java

我们以版本1.8.0为例

``` bash
yum -y install java-1.8.0-openjdk*
```

### 配置环境变量

1. 将jdk文件夹移动到opt文件夹下
2. 在/etc/profile文件中追加如下内容：

``` bash
export JAVA_HOME=/opt/jdk1.8.0_65
export PATH=$JAVA_HOME/bin:$PATH
```

## <font color=#c00>JSP进程集</font>

### 工具集介绍

在此篇基础工具集的规划中，我们主要安装Hadoop, ZooKeeper, HBase, Spark, Jupiter, Thrift。之后的教程中还会讲到Hive，MySQL等。每种工具都对应着一些Java进程，我们将规划这些进程分别部署到哪个服务器上。（话说，分布式应用，总不能把所有的进程都安装在一台服务器中吧。。。 - -!）

<font color=#c00>注：如果你对上述工具还不熟悉，请跳转到[《Hadoop 基础教程》](/ai/hadoop-tutorial/)</font>

### JSP进程

[JSP](https://www.cnblogs.com/wzyxidian/p/5314148.html)是Java Virtual Machine Process Status Tool的缩写，在[JVM](https://baike.baidu.com/item/JVM/2902369?fr=aladdin)中所有具有访问权限的Java进程的具体状态, 包括进程ID，进程启动的路径及启动参数等等，与Linux上的ps命令类似，只不过jps是用来显示java进程，可以把jps理解为ps的一个子集。

| 工具             | JPS进程                              |
| ---------------- | ------------------------------------ |
| ZooKeeper        | QuorumPeerMain |
| HDFS             | NameNode, DataNode, JournalNode, ZKFailoverController      |
| MapReduce, Spark | ResourceManager, NodeManager         |
| HBase            | HMaster,  HRegionServer              |
| Thrift           | ThriftServer                         |

### 系统进程

| 工具 | 系统进程 |
| ---- | -------- |
| Jupiter     | jupiter-notebook |

## <font color=#c00>进程规划</font>

### 规划图

根据上一篇的教程，我们准备了4台服务器，我们将把上面介绍的进程部署在这4台服务器中，方案如下：
![planning](/images/post/ai/hdp12.jpg)

图中勾选的位置对应着进程将部署在哪台服务器。

### 缩写对照表


| 缩写 | 进程全称             |
| ---- | -------------------- |
| NN   | NameNode             |
| DN   | DataNode             |
| ZK   | QuorumPeerMain       |
| ZKFC | ZKFailoverController |
| JN   | JournalNode          |
| RM   | ResourceManager      |
| NM   | NodeManager          |
| HM   | HMaster              |
| HR   | HRegionServer        |
| TS   | ThriftServer         |

## <font color=#c00>小结</font>

此篇主要介绍平台安装前的准备工作，以及要部署的工具集与JSP进程的规划方案，当然这个规划方案是以4台服务器为基础，如果你的服务器数量超过4台（无论怎样要大于等于3台，原因可以在[《Hadoop 基础教程》](/ai/hadoop-tutorial/)中了解，此处不在赘述！）规划方案可以相应调整，下篇[《ZooKeeper 部署》](/ai/hadoop-zkp/)。

本系列文章[《目录》](/ai/hadoop-start/)