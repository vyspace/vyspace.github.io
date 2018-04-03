---
title: Thrift 部署
categories:
  - ai
tags:
  - 大数据
date: 2018-04-03 11:15:16
---
Thrift服务是帮助Jupyter Notebook访问HBase，安装后我们就可以在程序中直接访问HBase了。

# Quick Start

## <font color=#c00>下载安装</font>

按照之前的规划表，我们会在node3中启动Thrift服务，所以在这篇文章我们选择在node3中进行配置安装。

登陆[官方网站](http://thrift.apache.org/)下载Thrift安装包，版本0.10.0，下载完成后解压并进入该文件夹。

运行如下命令进行安装：

<!--more-->

``` bash
# 配置
./configure --with-cpp --with-boost --with-python --without-csharp --with-java --without-erlang --without-perl --with-php --without-php_extension --without-ruby --without-haskell  --without-go

# 编译
make

# 安装
make install
```

## <font color=#c00>启动服务</font>

安装完成后，进入/opt/hbase-1.3.1，启动thrift服务

``` bash
bin/hbase-daemon.sh start thrift
```

## <font color=#c00>安装依赖包</font>

``` bash
sudo pip install thrift

sudo pip install hbase-thrift
```

到此Thrift已安装完成，是不是很简单 : ）

## <font color=#c00>测试</font>

下面我们来写段简单的Python(2.7)程序，测试HBase是否联通。这段程序获取HBase下的所有表名，结果会以类数组的方式打印出来。

``` python
from thrift import Thrift
from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol
from hbase import Hbase
from hbase.ttypes import * 

# 参数配置
hm_ip = 'node3的IP地址'
# 这里的9090是HBase的RPC协议端口
hm_port = 9090

transport = TSocket.TSocket(hm_ip, hm_port)
transport = TTransport.TBufferedTransport(transport)
protocol = TBinaryProtocol.TBinaryProtocol(transport)
client = Hbase.Client(protocol)
transport.open()
tableName = client.getTableNames()
print tableName
transport.close()
```

## <font color=#c00>官方文档</font>

如果需要了解更详细的内容，请访问[官方文档](http://thrift.apache.org/docs/)

## <font color=#c00>小结</font>

完成上述配置后，我们可以通过Python程序访问HBase了。下篇[《Hadoop 附录》](/ai/hadoop-add/)

本系列文章[《目录》](/ai/hadoop-start/)