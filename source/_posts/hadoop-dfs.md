---
title: HDFS 部署
categories:
  - ai
tags:
  - 大数据
date: 2018-03-20 10:18:18
---
这篇文章我们将按照规划方案配置HDFS，从4台中任一选择一台进行配置，本文选择node0。

# Quick Start

## <font color=#c00>下载及Java配置</font>

登陆[官方网站](http://hadoop.apache.org/releases.html)，下载hadoop.tar.gz文件，本文所使用的版本为2.7.4，下载完成后解压并进入该文件夹，修改etc/hadoop/hadoop-env.sh文件

``` bash
JAVA_HOME=/opt/jdk1.8.0_65
```

<!--more-->

<font color=#c00>注：因为Hadoop相关的工具比较多，可以把所有工具统一放在相同文件路径下，即使在不同服务器中也可以方便查找，本文将统一放在/opt路径下</font>

![path](/images/post/ai/hdp13.png)

## HDFS配置

配置etc/hadoop/hdfs-site.xml，将下面的XML标签项添加在&lt;configuration&gt;标签内。

<font color=#c00>注：配置项中需要填写IP地址的地方，强烈推荐填写IP地址，不要使用主机名。（在访问页面时，方便大家在不做hosts文件修改时，正常跳转）</font>

### 服务名

``` xml
<property>
  <name>dfs.nameservices</name>
  <value>mycluster</value>
</property>
```

### NameNode服务的名字

``` xml
<property>
  <name>dfs.ha.namenodes.mycluster</name>
  <value>nn1,nn2</value>
</property>
```

### NameNode的RPC协议与端口

配置该项后，可以通过程序调用8020接口，RPC协议主要用于系统内部通信以及用户编程访问。

``` xml
<property>
  <name>dfs.namenode.rpc-address.mycluster.nn1</name>
  <value>node0的IP:8020</value>
</property>
<property>
  <name>dfs.namenode.rpc-address.mycluster.nn2</name>
  <value>node1的IP:8020</value>
</property>
```

### NameNode的HTTP协议与端口

配置该项后，可以通过浏览器访问50070接口

``` xml
<property>
  <name>dfs.namenode.http-address.mycluster.nn1</name>
  <value>node0的IP:50070</value>
</property>
<property>
  <name>dfs.namenode.http-address.mycluster.nn2</name>
  <value>node1的IP:50070</value>
</property>
```

### 固定配置，客户端通过该类找到active的NameNode

``` xml
<property>
  <name>dfs.client.failover.proxy.provider.mycluster</name>
  <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
</property>
```

### SSH安全

``` xml
<property>
  <name>dfs.ha.fencing.methods</name>
  <value>sshfence</value>
</property>
<property>
  <name>dfs.ha.fencing.ssh.private-key-files</name>
  <value>/home/.ssh/id_rsa</value>
</property>
```

### JournalNode的地址与端口

``` xml
<property>
  <name>dfs.namenode.shared.edits.dir</name>
  <value>qjournal://node1的IP:8485;node2的IP:8485;node3的IP:8485/mycluster</value>
</property>
```

### JournalNode的工作目录

``` xml
<property>
  <name>dfs.journalnode.edits.dir</name>
  <value>此处填写你希望保存的路径即可，本文放在 /opt/hadoop-2.7.4/journalnode.edits</value>
</property>
```

### ZKFC自动切换

``` xml
<property>
   <name>dfs.ha.automatic-failover.enabled</name>
   <value>true</value>
</property>
```

### 打开权限控制

``` xml
<property>
   <name>dfs.permissions</name>
   <value>false</value>
</property>
```

### slaves文件配置方式

配置datanode时，如果不是使用了主机名加DNS解析或者hosts文件解析的方式，而是直接使用ip地址去配置slaves文件

``` xml
<property>
   <name>dfs.namenode.datanode.registration.ip-hostname-check</name>
   <value>false</value>
</property>
```

## <font color=#c00>CORE配置</font>

配置etc/hadoop/core-site.xml，将下面的XML标签项添加在&lt;configuration&gt;标签内。

### NameNode入口

``` xml
<property>
  <name>fs.defaultFS</name>
  <value>hdfs://mycluster</value>
</property>
```

### ZooKeeper地址与端口

``` xml
<property>
  <name>ha.zookeeper.quorum</name>
  <value>node0:2181,node2:2181,node3:2181</value>
</property>
```

### NameNode原数据存储目录

``` xml
<property>
  <name>hadoop.tmp.dir</name>
  <value>可自定义设置，本文存储路径 /opt/hadoop-2.7.4/tmp</value>
</property>
```

## <font color=#c00>其他配置项</font>

### 指定DataNode地址

在etc/hadoop文件下，创建slaves文件，内容如下：

<font color=#c00>注：此处可以填写IP地址，也可填写主机名，推荐IP地址，保持配置一致性</font>

``` bash
node1的IP
node2的IP
node3的IP
```

### 分发工具

因为Hadoop会使用到所有的服务器，所以你必须将它分发到你所有的机器节点上，本教程一共4台服务器，所以将Hadoop文件夹分发到其他3台。

``` bash
scp -r /opt/hadoop-2.7.4 root@node1:/opt
scp -r /opt/hadoop-2.7.4 root@node2:/opt
scp -r /opt/hadoop-2.7.4 root@node3:/opt
```


### 启动JournalNode

按照规划我们并没有把JournalNode服务部署在所有服务器节点上，所以，这里需要分别启动node1，node2，node3上的JournalNode进程。

``` bash
sbin/hadoop-daemon.sh start journalnode
```

使用<font color=#c00>jps</font>命令查看是否启动成功，显示PID JournalNode则为成功。

### 格式化NameNode

就像我们新装windows操作系统一样，需要磁盘格式化，从而建立该系统的元数据。

在node0与node1之间，选择任一选择（这里选择node0），运行如下命令：

``` bash
bin/hdfs namenode -format
```

格式化成功后会在tmp/dfs/name/current/目录下生成fsimage元数据

### 启动NameNode服务

<font color=#c00>注：启动node0节点上的NameNode服务，目的是拷贝刚刚格式化好的元数据到node1中。</font>

``` bash
sbin/hadoop-daemon.sh start namenode
```

<font color=#c00>注：如果启动失败，可以删除之前生成的元数据，重新格式化。</font>

### 拷贝元数据

将node0中的NameNode服务正常启动后，就可以拷贝元数据到node1中了。

<font color=#c00>注：下面这条命令必须在node1中执行。</font>

``` bash
bin/hdfs namenode -bootstrapStandby
```

查看拷贝是否成功。可在node1中tmp/dfs/name/current/目录下查看是否生成fsimage元数据。

<font color=#c00>注：如果格式化NameNode与拷贝元数据这几步中依然出现莫名的错误，可以删除2个节点上的元数据，重新选择另一台机器（这里选择node1）从格式化NameNode步骤开始，再做一遍。（笔者之前就遇到过此类莫名其妙的问题- -!）</font>

### 格式化DFSZKFailoverController

1. 进行此步之前，需要关闭所有dfs服务：
  ``` bash
  sbin/stop-dfs.sh
  ```

2. 格式化ZKFC:
  ``` bash
  bin/hdfs zkfc -formatZK
  ```

### 启动HDFS服务

完成以上步骤后，就可以启动HDFS服务了：

``` bash
sbin/start-dfs.sh
```

## <font color=#c00>访问与测试</font>

正常启动HDFS服务后，再node1中使用jps命令看到NameNode，JournalNode，DFSZKFailoverController，DataNode服务。

### 访问HTTP服务

通过IP地址:50070接口，在浏览器中正常访问到HDFS。
![hdfsweb](/images/post/ai/hdp14.png)

<font color=#c00>注：node0与node1中，一台是active状态，一台是standby状态，由ZooKeeper服务投票决定。</font>

### 手动切换

如果启动HDFS时，两个NameNode都处于standby状态，我们也可以手动指定一台节点为激活状态。本文指定nn2<font color=#999>（这里使用配置项中的NameNode服务名）</font>

``` bash
bin/hdfs haadmin -transitionToActive --forcemanual nn2
```

<font color=#999>active状态：transitionToActive，standby状态：transitionToStandby</font>

### 测试

1. 创建test目录
  ``` bash
  bin/hdfs dfs -mkdir -p /test
  ```

2. 上传hello.txt文件到test目录
  ``` bash
  bin/hdfs dfs -put hello.txt /test/
  ```

3. 此时可以在web页面中，查看刚刚创建的文件夹
  在Utilities -> Browse the file system下查看

## <font color=#c00>官方文档</font>

如果需要了解更详细的内容，请访问[官方文档](http://zookeeper.apache.org/doc/r3.4.10/)，文档版本3.4.10

## <font color=#c00>小结</font>

完成上述配置后，HDFS可以正常访问了，下篇文件我们开始[《部署 MapReduce》](/ai/hadoop-mrd/)

本系列文章[《目录》](/ai/hadoop-start/)




