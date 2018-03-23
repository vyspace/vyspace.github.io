---
title: Linux 硬件信息查询
categories:
  - other
tags:
  - Linux
date: 2017-04-25 08:36:53
---
最近在做一些与服务器硬件相关的事情，总是需要查询服务器的硬件信息<font color=#999>（Linux上查询这些信息的确没有Windows上简单直观，且很多命令对我来说并不常用，完全记不住啊... - -!）</font>

这文章，帮助自己下次查询，有用的上的朋友也可以look look ：）

# Quick Start

## <font color=#c00>CPU 信息</font>

### 基础信息

``` bash
cat /proc/cpuinfo
```

![cpuinfo](/images/post/other/oth1.png)

### 物理CPU个数

``` bash
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l
```

### 单个物理CPU的核数

``` bash
cat /proc/cpuinfo| grep "cpu cores"| uniq
```

### 单个物理CPU的线程数<font color=#999>（逻辑CPU）</font>

``` bash
cat /proc/cpuinfo| grep "processor"| wc -l
```

### 是否开启超线程

- 逻辑CPU  >  物理CPU  x   CPU核数 <font color=#999>（已开启超线程）</font>

- 逻辑CPU  =  物理CPU  x   CPU核数 <font color=#999>（未开启超线程或不支持超线程）</font>