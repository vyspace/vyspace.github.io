---
title: Linux 使用监控
categories:
  - other
tags:
  - Linux
date: 2017-04-27 18:56:09
---
知道程序在服务器中运行时，对硬件的使用率有多少，尤其是长时间，大规模的运算任务，还是一件很重要的事。这篇文章简单介绍几个性能分析工具。

# Quick Start

## <font color=#c00>CPU及内存监控</font>

top命令是Linux下常用的性能分析工具，能够实时显示CPU的使用率及系统中各个进程的资源占用状况。以每秒更新的方式显示实时情况。

### 基础信息
 
``` bash
top
```

<!--more-->

### 基础操纵

点击下面的健会显示相应信息，点击ESC返回主界面

h: 帮助
1: 显示CPU详细信息，每行代表一个线程
f: 查看列信息
n: 按下n键后，再按相应的数字，表示现实进程前几行
z: 颜色模式
q: 退出。或Ctrl+C

### 显示与隐藏

l: 第一行负载信息
t: CPU线程信息
m: 内存信息

## <font color=#c00>显卡监控</font>

如下命令主要适用于NVIDIA产品

``` bash
nvidia-msi
```

## <font color=#c00>IO监控</font>

### 基础方法

每隔1秒采样一次，以KB的方式显示。

``` bash
iostat -d -x -k 1
```

如果显示有限次数，则在命令最后增加一个次数，下面命令显示5次

``` bash
iostat -d -x -k 1 5
```

### 参数说明

d: 采样
x: 详细信息，使用率
c: CPU状态
