---
title: XGBoost 部署
categories:
  - ai
tags:
  - 大数据
date: 2018-04-09 10:10:35
---
"GBDT和XGBoost在竞赛和工业界使用都非常频繁，能有效的应用到分类、回归、排序问题，虽然使用起来不难，但是要能完整的理解还是有一点麻烦的。本文尝试一步一步梳理GB、GBDT、XGBoost，它们之间有非常紧密的联系，GBDT是以决策树（CART）为基学习器的GB算法，XGBoost扩展和改进了GDBT，XGBoost算法更快，准确率也相对高一些。"，上面这句话引用自[《一步一步理解GB、GBDT、XGBoost》](https://www.cnblogs.com/wxquare/p/5541414.html)，个人觉的很好的对比了几种算法的不同，更好的理解XGBoost，有兴趣的同学可以看看。

经测试用GBDT(Gradient Boosting Decision Tree)在Spark上需要10小时才能训练出的数据量，XGBoost仅仅只用了一半的集群资源，10分钟就搞定了。真实速度惊人，为了进一步发挥Spark的潜能，这篇文章我们讲讲如何把XGBoost部署在分布式环境中。

因为Jupyter安装在node0中，所以我们在node0节点上安装XGBoost。root用户登录此节点。

<!--more-->

# Quick Start

## <font color=#c00>安装 GCC</font>

下载gcc源码包，并解压，进入该目录

### 检测

``` bash
configure --enable-checking=release --enable-languages=c,c++ --disable-multilib
```

<font color=#999>你可以最后加–prefix=/自定义安装路径，执行文件最后安装在/自定义安装路径/bin下</font>

### 编译

``` bash
make -j10
```

<font color=#999>-j后面的数字指定CPU用多少个线程运行这次任务，线程数要小于等于实际线程数，如果-j后面不指定数字，将会使用全部线程运行次任务</font>

### 安装

``` bash
make install
```

本文使用的是 gcc version 4.8.5

## <font color=#c00>安装 CMake</font>

下载cmake的源码包，安装方法与gcc安装相同。本文使用的是cmake version 3.10.1

## <font color=#c00>编译 libhdfs</font>

libhdfs主要用于XGBoost访问HDFS文件系统。

在[hadoop-common](https://github.com/cloudera/hadoop-common)，下载最近发布版，下载完成后进入hadoop-hdfs-project/hadoop-hdfs/src，编辑：

``` bash
cmake -DGENERATED_JAVAH=/opt/jdk1.8.0_65 -DJAVA_HOME=/opt/jdk1.8.0_65
make
```

将编译完成的文件，拷贝到xgboost-packages中

``` bash
cp -r /usr/local/lib ／opt/xgboost-packages/libhdfs
```

## <font color=#c00>安装 XGBoost</font>

它支持Python，R，Julia，Scala 4种语言。本文介绍Python的安装和使用。

### 下载

root用户登录，下载[python-package](https://github.com/dmlc/xgboost/tree/master/python-package)，我们把文件包依然放在/opt目录下。下载完后进入/python-package/xgboost文件夹，拷贝配置文件：

``` bash
cp make/config.mk ./
```

### 修改配置

修改./config.mk文件配置

``` bash
# 使用HDFS文件系统
USE_HDFS = 1

# 指定hadoop环境变量
HADOOP_HOME = /opt/hadoop-2.7.4

# hadoop为C/C++访问分布式文件系统提供的JNI接口
HDFS_LIB_PATH = /opt/hadoop_suite/xgboost-packages/libhdfs
```

### 编译

``` bash
make -j10
```

## <font color=#c00>小结</font>

完成上述配置后，XGBoost就可以在Spark集群中运行了。你也可以参考[《官方文档》](http://xgboost.readthedocs.io/en/latest/build.html)，查看单机安装教程。下篇[《Hadoop 附录》](/ai/hadoop-add/)

本系列文章[《目录》](/ai/hadoop-start/)