---
title: Spark 部署
categories:
  - ai
tags:
  - 大数据
date: 2018-03-28 10:24:07
---
Spark是内存式计算引擎，为了让我们的计算速度更快，计算更多复杂的模型。这篇文章我们部署它，之后我们编写的代码都将跑在Spark中。

# Quick Start

## <font color=#c00>下载安装</font>

登陆[官方网站](http://spark.apache.org/)，下载版本为2.2.1，下载完成后解压（文件目录还是统一放在/opt路径下）并进入该文件夹，运行如下命令：

<font color=#c00>注：从2.0版本开始，缺省支持Scala2.11版本，如果你习惯使用其他版本的Scala，请查看官网</font>

``` bash
cp conf/spark-env.sh.template conf/spark-env.sh
```

<!--more-->

## <font color=#c00>环境变量配置</font>

在conf/spark-env.sh文件中添加如下配置项：

### Java环境变量

``` bash
export JAVA_HOME=$JAVA_HOME
```

<font color=#999>如果未设置Java环境变量，请自行添加就好。</font>

### Client模式运行时，所需的参数环境变量

``` bash
# yarn集群中，最多能够同时启动的Executors的实例个数。
# yarn中实际能够启动的最大Executors的数量会小于等于该值。如果不能确定最大能够启动的Executors数量，建议将该值先设置的足够大。
export SPARK_ EXECUTOR_INSTANCES=9

# 该参数为设置每个Executor能够使用的CPU核数
# yarn集群能够最多并行的task数量为SPARK_EXECUTOR_INSTANCES ＊ SPARK_EXECUTOR_CORES
export SPARK_EXECUTOR_CORES=2

# 该参数设置的是每个Executor分配的内存的数量。
# 需要注意的是，该内存数量是SPARK_EXECUTOR_CORES中设置的内核数共用的内存数量。
export SPARK_EXECUTOR_MEMORY=8G

#该参数设置的是DRIVER分配的内存的大小。
#也就是执行start-thriftserver.sh机器上分配给thriftserver的内存大小。
export SPARK_DRIVER_MEMORY=8G
```


### ZooKeeper环境变量

``` bash
export SPARK_DAEMON_JAVA_OPTS="-Dspark.deploy.recoveryMode=ZOOKEEPER -Dspark.deploy.zookeeper.url=node0的IP:2181,node2的IP:2181,node3IP:2181"
```

### 其他环境变量

``` bash
export HADOOP_CONF_DIR=/opt/hadoop-2.7.4/etc/hadoop
export YARN_CONF_DIR=/opt/hadoop-2.7.4/etc/hadoop
export SPARK_HOME=/opt/spark-2.2.0-bin-hadoop2.7
export SPARK_JAR=$SPARK_HOME/jars/*.jar
export PATH=$SPARK_HOME/bin:$PATH
```

## <font color=#c00>从属节点配置</font>

### 复制文件

``` bash
cp conf/slaves.template conf/slaves
```

### 配置地址

打开slaves文件，填写如下内容：

``` bash
node1的IP
node2的IP
node3的IP
```

## <font color=#c00>测试</font>

我们用spark文件夹中自带的求Pi例子做测试

### 单机模式（本地模式）

``` bash
bin/spark-submit --master yarn-client --class org.apache.spark.examples.SparkPi examples/jars/spark-examples_2.11-2.2.0.jar
```

### 集群模式

``` bash
bin/spark-submit --master yarn-cluster --class org.apache.spark.examples.SparkPi  examples/jars/spark-examples_2.11-2.2.0.jar
```

## <font color=#c00>官方文档</font>

如果需要了解更详细的内容，请访问[官方文档](http://spark.apache.org/docs/2.2.1/)，文档版本2.2.1

## <font color=#c00>小结</font>

完成这篇的配置后，我们可以做大部分数据挖掘工作了，但数据只能使用csv文件，为了让我们可以使用数据库，快速查找，快速计算，快速存取。下篇文件我们开始[《HBase 部署》](/ai/hadoop-hba/)

本系列文章[《目录》](/ai/hadoop-start/)
