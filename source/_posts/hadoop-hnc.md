---
title: 统计HBase表纪录数
categories:
  - ai
tags:
  - 大数据
date: 2018-04-04 11:36:27
---

我们知道所有HBase中的表数据，都存放在分布式文件系统上，所以要获得到一张表中到底有多少条记录，跟传统关系型数据库是不一样的，这篇文章我们来说说如何获得。

我们依然使用Jupyter Notebook，用程序的方式获取结果。

``` python
import os
import subprocess
hbase_home = os.environ.get('HBASE_HOME')
# 你想查看的表名
table_name = '表名'

if table_name != '':
    cmd = '%s/bin/hbase org.apache.hadoop.hbase.mapreduce.RowCounter %s' % (hbase_home, table_name)
    p = subprocess.Popen(cmd, shell=True, stderr = subprocess.PIPE )
    out = p.stderr.readlines()
    for line in out:
        print line.strip()
else:
    print '定义表名'
```

<!--more-->

我们将结果直接打印在Jupyter中，如下图：

![rowc](/images/post/ai/hdp23.png)

红框中便是我们所得到的结果。

在这段程序中，我们使用了HBase提供的MapReduce计算类RowCounter，所以当执行这段程序时，其实是提交一个MapReduce计算任务。在Hadoop相关的软件中，会大量使用MapReduce做一些统计任务。

当然你也可以在命令行中，执行这条命令：

``` bash
bin/hbase org.apache.hadoop.hbase.mapreduce.RowCounter 表名
```

本系列文章[《目录》](/ai/hadoop-use/)