---
title: HBase 部署
categories:
  - ai
tags:
  - 大数据
date: 2018-04-02 11:36:18
---
完成之前的章节，我们已经将Hadoop集群与Spark计算引擎成功部署在4个节点中了。你可以使用Java或者Scala语言（这里推荐Scala）进行开发，并可以用Spark正常进行数据挖掘了。这章我们讲HBase的部署，基本与数据存储有关。

# Quick Start

## <font color=#c00>下载安装</font>

按照之前的规划表，我们会在node3中启动HBase的主进程，在node2中启动备用进程，所以在这篇文章我们选择在node3中进行配置。

登陆node3节点，并下载HBase安装包，版本1.3.1，下载完成后解压（文件目录还是统一放在/opt路径下）并进入该文件夹。

<!--more-->

## <font color=#c00>基础配置</font>

打开conf/hbase-site.xml文件，在configuration标签中添加如下配置项：

### 启动集群模式

``` xml
<property>
   <name>hbase.cluster.distributed</name>
   <value>true</value>
</property>
```

### HDFS中设置HBase主目录

``` xml
<property>
   <name>hbase.rootdir</name>
   <value>hdfs://mycluster/hbase</value>
</property>
```

### ZooKeeper集群地址

``` xml
<property>
   <name>hbase.zookeeper.quorum</name>
   <value>node0的IP, node2的IP, node3的IP</value>
</property>
```

### ZooKeeper快照存储位置

<font color=#c00>注：此项与zoo.conf中dataDir路径相同。</font>

``` xml
<property>
   <name>hbase.zookeeper.property.dataDir</name>
   <value>/opt/zookeeper-3.4.10/zk_data</value>
</property>
```

## <font color=#c00>配置元数据存储节点</font>

HBase中的数据分为元数据（文件索引）与文件本身数据，文件数据由DataNode负责存取，元数据则由HRegionServer负责。按照规划表，我们会把元数据分布在4台节点中，所以我们需要在所有节点中部署HRegionServer，配置方法如下：

在conf文件夹中打开regionservers文件（如果未找到，新建即可）。添加如下内容：

``` base
node0的IP
node1的IP
node2的IP
node3的IP
```

## <font color=#c00>配置环境变量</font>

``` base
# Java环境变量是必不可少的。
export JAVA_HOME=/opt/jdk1.8.0_65

# 因为HBase自身就带有一个ZooKeeper，非集群模式时，我们可以用它自己带的就好，集群模式下关闭它，防止启动多个ZooKeeper
export HBASE_MANAGES_ZK=false

# 让HBase可以找到Hadoop的配置文件hdfs-site.xml，这里配置目录路径就好。
export HBASE_CLASSPATH=/opt/hadoop-2.7.4/etc/hadoop

# HBase工作目录路径（tmp文件夹是我自己创建的，你也可以指定到别的路径下）
export HBASE_PID_DIR=/opt/hbase-1.3.1/tmp
```

## <font color=#c00>分发安装包</font>

将配置好的HBase文件夹拷贝到所有节点中

``` base
scp -r /opt/hbase-1.3.1 root@node0:/opt
scp -r /opt/hbase-1.3.1 root@node1:/opt
scp -r /opt/hbase-1.3.1 root@node2:/opt
```

## <font color=#c00>启动服务</font>

在node3上执行如下命令：

``` base
bin/start-hbase.sh
```

执行完成后使用jps命令进行查看，node3中会有HMaster和HRegionServer服务

## <font color=#c00>HA</font>

为了达到高可用，我们需要启动一个备用进程，按照规划图，在node2中运行如下命令：

``` base
bin/hbase-daemon.sh start master
```

## <font color=#c00>Web 访问</font>

在浏览其中输入地址可以访问HMaster

``` base
node3的IP:16010
```

访问HRegionServer

``` base
node3的IP:16030
```

## <font color=#c00>测试</font>

### SHELL

在命令行中输入如下命令，进入hbase shell界面后，可执行一些基础操作。

``` base
bin/hbase shell
```

<font color=#c00>注：HBase的命令与其它数据库（例如：MySql）不同，命令行结束后不能加分号，名称（表名）要加引号（双引号或单引号）</font>

### 创建表

``` base
create '表名', '列族'
```

### 查看所有表

``` base
list
```

### 查看表属性

``` base
describe '表名'
```

### 插入数据

``` base
put '表名', 'rowkey', '列族:列', '值'
```

### 查看表中所有数据

``` base
scan '表名'
```

以上是一些基础命令的测试，如果你对HBase的shell操作有更多的兴趣，请点击下方官方文档进行查阅。

## <font color=#c00>官方文档</font>

如果需要了解更详细的内容，请访问[官方文档](http://hbase.apache.org/book.html)

## <font color=#c00>小结</font>

完成上述配置后，HBase可以正常访问了，基础的存储与计算都配置完成。下篇文件我们开始[《Jupyter 部署》](/ai/hadoop-jpt/)

本系列文章[《目录》](/ai/hadoop-start/)
