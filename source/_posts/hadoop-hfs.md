---
title: Hadoop 部署
categories:
  - hadoop
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

![path](/images/post/hadoop/hdp13.png)

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

## <font color=#c00>HDFS其他配置</font>

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

## 指定DataNode地址

在etc/hadoop文件下，创建slaves文件，内容如下：

<font color=#c00>注：此处可以填写IP地址，也可填写主机名，推荐IP地址，保持配置一致性</font>

``` bash
node1的IP
node2的IP
node3的IP
```

