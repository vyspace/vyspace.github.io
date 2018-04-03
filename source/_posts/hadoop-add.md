---
title: Hadoop 附录
categories:
  - ai
tags:
  - 大数据
date: 2018-04-03 12:56:20
---

# Quick Start

## <font color=#c00>环境变量</font>

以下是各个节点的环境变量配置（/etc/profile）

### 节点node0

``` bash
export JAVA_HOME=/opt/jdk1.8.0_65
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$JAVA_HOME/bin:$PATH
export ANACONDA2_HOME=/opt/anaconda2
export PATH=$ANACONDA2_HOME/bin:$PATH
export SPARK_HOME=/opt/spark-2.2.0-bin-hadoop2.7
export PYTHONPATH=$SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.4-src.zip:$PYTHONPATH
export XDG_RUNTIME_DIR="/home/test/.jupyter"
export HBASE_HOME=/opt/hbase-1.3.1
export HADOOP_HOME=/opt/hadoop-2.7.4
export JN_HOME=/home/test/jupyter_notebook
export LD_LIBRARY_PATH=/opt/xgboost_packages/libhdfs
```

<!--more-->

### 其他节点

``` bash
export JAVA_HOME=/opt/jdk1.8.0_65
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$JAVA_HOME/bin:$PATH
export ANACONDA2_HOME=/opt/anaconda2
export PATH=$ANACONDA2_HOME/bin:$PATH
export SPARK_HOME=/opt/spark-2.2.0-bin-hadoop2.7
export PYTHONPATH=$SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.4-src.zip:$PYTHONPATH
export XDG_RUNTIME_DIR="/home/test/.jupyter"
```