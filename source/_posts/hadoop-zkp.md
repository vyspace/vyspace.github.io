---
title: ZooKeeper 部署
categories:
  - hadoop
tags:
  - 大数据
date: 2018-03-19 18:01:58
---
[ZooKeeper](https://baike.baidu.com/item/zookeeper/4836397?fr=aladdin)是分布式应用程序协调服务，在分布式系统中必不可少。它是为分布式应用提供一致性服务的软件，所以我们首先来安装配置它。

安装前，我们需要先准备好安装包，点击[官方下载地址](http://zookeeper.apache.org/releases.html)，本文所使用的版本是3.4.10

# Quick Start

## <font color=#c00>创建目录</font>

1. 在解压后的文件夹中创建一个名为tmp文件夹，作为其工作目录。
2. 再创建一个名为zk_data文件夹，作为其数据存储目录。

<!--more-->

## <font color=#c00>配置</font>

1. 拷贝conf/zoo_sample.cfg文件，并重命名zoo.cfg <font color=#c00>（这里必须命名为zoo.cfg）</font>

2. 修改zoo.cfg文件，内容如下：
	``` bash
	tickTime=2000
	dataDir=/opt/zookeeper-3.4.10/zk_data
	clientPort=2181
	initLimit=5
	syncLimit=2
	server.1=node0的IP:2888:3888
	server.2=node2的IP:2888:3888
	server.3=node3的IP:2888:3888
	```

3. 将此配置分别配置到 node0， node2， node3中

4. 按照规划ZooKeeper会被部署在node0，node2，node3上，所以需要在这三台服务器中都拷贝一份。
	``` bash
	scp -r /opt/zookeeper-3.4.10 root@node2:/opt
	scp -r /opt/zookeeper-3.4.10 root@node3:/opt
	```

5. 分别在这三个节点的dataDir指向的目录下创建myid文件，值分别为1，2，3

6. 在node0，node2，node3中依次启动服务，命令如下：
	``` bash
	bin/zkServer.sh start
	```

7. 查看服务是否已经启动
	``` bash
	zkserver.sh status
	```

	如果遇到Error contacting service. It is probably not running 此错误，请查看对应版本的官方文档重新配置zoo.cfg。
	如果是java.net.BindException: Address already in use 通过netstat -nltp | grep 2181检查是否该端口已被占用。
	如果，遇到防火墙原因，请继续往下看。

## <font color=#c00>关闭防火墙​</font>

关闭所有服务器的防火墙<font color=#c00>（重点）</font>

- firewall

	查看防火墙状态
	``` bash
	firewall-cmd --state
	```

	关闭防火墙
	``` bash
	systemctl stop firewalld.service
	```

	禁止开机启动
	``` bash
	systemctl disable firewalld.service
	```

- 关闭iptables

	``` bash
	service iptables stop
	```


## <font color=#c00>官方文档</font>

如果需要了解更详细的内容，请访问[官方文档](http://zookeeper.apache.org/doc/r3.4.10/)，文档版本3.4.10

## <font color=#c00>小结</font>

完成上述配置后，ZooKeeper应该可以正常启动了，下篇文件我们开始[《部署 HDFS》](/hadoop/hadoop-dfs/)

本系列文章[《目录》](/hadoop/hadoop-start/)

