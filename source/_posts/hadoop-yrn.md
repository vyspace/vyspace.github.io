---
title: YARN 部署
categories:
  - ai
tags:
  - 大数据
date: 2018-03-20 10:18:18
---
上一篇文章我们已经完成了HDFS系统的部署，接下来我们开始YARN的配置，它是资源调度很重要的部分。依然选择在node0节点上进行配置。

# Quick Start

## <font color=#c00>MapReduce 资源调度配置</font>

Hadoop中计算引擎的运行方式有很多，在企业级应用中我们选择yarn作为资源调度的方式。

### 配置MapReduce的资源调度方式

复制etc/hadoop/mapred-site.xml.template为mapred-site.xml，并添加如下配置项：

<!--more-->

``` xml
<property>
   <name>mapreduce.framework.name</name>
   <value>yarn</value>
</property>
```

## <font color=#c00>YARN 配置</font>

在etc/hadoop/yarn-site.xml文件中，添加如下配置项：

### 资源申请的主机

``` xml
<property>
   <name>yarn.resourcemanager.hostname</name>
   <value>node0的IP</value>
</property>
```

### NodeManager 附属服务

``` xml
<property>
   <name>yarn.nodemanager.aux-services</name>
   <value>mapreduce_shuffle</value>
</property>
```

### 服务类（固定配置）

``` xml
<property>
   <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
   <value>org.apache.hadoop.mapred.ShuffleHandler</value>
</property>
```

<font color=#c00>注：下面打问号的6个配置项，需要计算，才能得出（依据自己机器的节点数，每个节点的具体硬件配置，以及各自的任务需要）。这也是yarn配置的重点。如果想了解YARN在不同数量及配置的服务器中该如何计算，请[点击此处](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.1.1/bk_installing_manually_book/content/rpm-chap1-11.html)，进行查看。</font>

### 内存总量

``` xml
<property>
   <name>yarn.nodemanager.resource.memory-mb</name>
   <value>?</value>
</property>
```

### 最小可申请内存量

``` xml
<property>
   <name>yarn.scheduler.minimum-allocation-mb</name>
   <value>?</value>
</property>
```

### yarn启动时分配给AppMaster的默认内存大小

``` xml
<property>
   <name>yarn.app.mapreduce.am.resource.mb</name>
   <value>?</value>
</property>
```

### JVM参数

``` xml
<property>
   <name>yarn.app.mapreduce.am.command-opts</name>
   <value>?</value>
</property>
```

### 可供调用的CPU线程数

<font color=#999>这个配置项指你分配多少个CPU线程供yarn调度，可以全部，也可以分配一部分，主要看这个节点的想如何使用。</font>

``` xml
<property>
   <name>yarn.nodemanager.resource.cpu-vcores</name>
   <value>?</value>
</property>
```

### 单个任务可申请的最多CPU线程数

``` xml
<property>
   <name>yarn.scheduler.maximum-allocation-vcores</name>
   <value>?</value>
</property>
```

计算好数值，将问号处填写好后，yarn的配置就完成了。

## <font color=#c00>启动服务</font>

如果你之前已经启动了HDFS服务，这里只需系统yarn服务就可以了。

``` bash
sbin/start-yarn.sh 
```

如果未启动，可以使用如下命令，启动Hadoop全部服务。

``` bash
sbin/start-all.sh 
```

## <font color=#c00>测试</font>

可以安装如下命令格式，提交编写好的jar包，及数据提交给MapReduce进行计算。

bin/hadoop jar  [x.jar]  [hdfs://数据所在目录]  [hdfs://结果导出目录]

结果返回到指定hdfs目录。结果集可以使用hdfs命令行查看，也可取回本地查看。

## <font color=#c00>官方文档</font>

如果需要了解更详细的内容，请访问[官方文档](http://zookeeper.apache.org/doc/r3.4.10/)，文档版本3.4.10

## <font color=#c00>小结</font>

配置好YARN之后，我们就可以编写代码利用MapReduce完成基本的数据挖掘工作了，但MapReduce作为离线计算框架，在速度方面并不能让我们满意，我们需要更快速更灵活的计算框架。下篇文件我们开始[《Spark 部署》](/ai/hadoop-yrn/)

本系列文章[《目录》](/ai/hadoop-start/)