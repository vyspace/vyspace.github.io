---
title: Word Count
categories:
  - ai
tags:
  - 大数据
date: 2018-04-03 15:49:39
---
Word Count程序就像初学每种语言时要写的Hello World一样。他可以用来统计大段文章（可能是一本朗文字典那么厚的书）中相同单词出现的次数。当然除了统计相同词数量外，我们经常拿它来统计网站中大量的PV，UV。

所有的Spark程序可以在local模式下运行，也可以在cluster模式下运行。因为是第一次应用，我们会分别讲解这两种模式。以后的程序基本都是运行在集群模式。

Spark程序可以使用Python，Scala，Java，R编写，推荐程度Python最高，R最低。按道理说整个Spark都是Scala开发的，使用Scala是最好的选择，的确是这样的。但是由于Python在整个机器学习领域的热度越来越热，为了方便大家之后开发其他程序（比如模式识别，语音识别等等），这里推荐使用Python，当然其他语言版本我们会大概讲下，本文我们看看Python，Scala，Java三种语言分别是如何实现World Count程序的，废话不多说，下面上主菜...

# Quick Start

## <font color=#c00>Python</font>

<font color=#c00>注：本文使用的语言是Python2.7</font>

### 本地模式

``` python
import os
from pyspark import SparkConf, SparkContext

# 准备好的数据本地路径
input_file = "file:///home/test/jupyter_notebook/wordcount/data_wc_py"

# 计算完成后统计结果存放路径
out_dir = "file:///home/test/jupyter_notebook/wordcount/wjh"

# 判断spark上下文是否已释放
try:  
    sc.stop()  
except:  
    pass 

# 设置spark运行模式以及任务名称
conf = SparkConf().setMaster("local").setAppName("word_count_local")

# 按照设置，获取sprak上下文
sc = SparkContext(conf=conf)

# 按行读取数据，生成类数组
lines = sc.textFile(input_file)

# 这里使用了lambda表达式
# 第一个表达式，将每行按空格把行转换成单词
# 第二个把每一个单词转换成元组（单词，1）
# 最后一个将单词相同的元组做累加
# 最后把（单词，累加值）返回给counts数组
counts = lines.flatMap(lambda line: line.split(" ")).map(lambda word: (word, 1)).reduceByKey(lambda a, b: a + b)

# 把最后的结果集保存在文件中
counts.saveAsTextFile(out_dir) 

# 释放spark上下文
sc.stop()
```

<font color=#c00>注：只有本地模式才能在计算后，直接访问到存储结果集文件。</font>

### 集群模式

在讲这段程序前，讲点其他有的没的。首先，Jupyter是一个网页程序，尤其团队使用时，它被不同的人同时使用，所以为了代码管理需要，每个人可以在Jupyter的根目录建立自己的工作文件目录，自己编写的程序都放在自己工作目录下，这样可以有效管理自己的代码。

第二，集群模式下运行时，我们可以在用8088端口访问浏览器，查看我们提交的计算任务进度，计算日志等。如下图，我们只要提交任务，都可以在这里看到，蓝框中是你为本次任务设置任务名，我不推荐这样命名，之前说过了因为同时间会有不止一人提交任务，如果大家都按程序目的命名，你很难分辨哪个才是你自己提交的。所以我推荐使用自己的名字命名，当然你可以用（姓名＋目的名＋时间戳）命名也不错，为什么要加时间戳，因为同一个任务可能程序问题，会提交不止一个版本。

![jobname](/images/post/ai/hdp20.png)

<font color=#c00>注：集群模式下提交任务后，无法停止，要么等运行结束，要么报错结束。所以小规模测试时可以使用本地模式，等程序调试基本完成，可以提交集群模式，运行大规模数据版本。</font>

``` python
import os
import time
from os import path 
from pyspark import SparkConf, SparkContext

# 生成当前时间戳
time_now = int(time.time())

# 获取程序所在的父目录路径
dir_path = os.getcwd()

# 获取父目录名，因为个人的工作目录以自己的名字命名（英文或拼音）
dir_name = path.basename(dir_path)

# 获取数据文件在HDFS中的路径
server_input_file = '/hfile/data/data_wc_py'

# 运行集群模式，所以资源调度交给yarn
master = 'yarn'

# 之前提到过的任务名设置
job_name = '%s_%s' % (dir_name, time_now)

try:  
    sc.stop()  
except:  
    pass 

conf = SparkConf().setMaster(master).setAppName(job_name)
sc = SparkContext(conf=conf)
lines = sc.textFile(server_input_file)
counts = lines.flatMap(lambda line: line.split(" ")).map(lambda word: (word, 1)).reduceByKey(lambda a, b: a + b)

# 这次我们选择将结果直接打印出来
# 因为Spark程序计算后依然是RDD，我们需要用collect将其转化为类数组
result = counts.collect()

# 打印前100个结果
print result[:100]

sc.stop()
```