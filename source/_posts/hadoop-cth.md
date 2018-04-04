---
title: CSV导入HBase
categories:
  - ai
tags:
  - 大数据
date: 2018-04-04 13:19:50
---
大数据分析中，都会用到csv数据文件，这篇文章我们讲讲如何将csv中的数据导入到hbase中，方便数据的查看，计算。也方便在后续的程序中可以直接从数据库中读取数据。

下面的程序实现了如下功能：

1. 将csv文件从本地上传到hdfs文件系统中。
2. 在hbase中创建表。
3. 把hdfs中的csv数据导入新建的表中。 
4. 执行每一步，打印出提示信息。

<!--more-->

``` python
import os
import sys
import subprocess
from thrift import Thrift
from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol
from hbase import Hbase
from hbase.ttypes import *

# 环境变量获取
hadoop_home = os.environ.get('HADOOP_HOME')
# jupyter_notebook 工作区根目录
jn_home = os.environ.get('JN_HOME')
hbase_home = os.environ.get('HBASE_HOME')

# ============用户参数设置开始============
file_name = 'csv文件名'
table_name = '要新建的表名'

# hdfs中csv已存在选项
# 1: 跳过此处，不再上传文件，但继续执行后面的代码。
# 2: 停止执行后面的代码。
# 3: 删除已存在的文件，重新上传后，继续执行后面的代码。
hdfs_exist_flag = 3 

# 表存在选项
# True: 删除已有表，创建新表。
# False: 程序停止。用户自己决定是否手动删处理。
hbase_exist_flag = True
# ===============设置完成================

# 参数设置检测
if file_name == '' or table_name== '':
    print '参数设置不能为空'
    sys.exit(1)

# 检测本地文件是否存在
# 可以指定任意本地路径，这里我把所有数据文件放在jupyter工作根目录的Local_Data下，方便管理及多人共享。
local_file_path = '%s/Local_Data/%s' % (jn_home, file_name)
if os.path.exists(local_file_path):
    print '本地文件存在, 正在检测HBase'
else: 
    print '本地文件不存在'
    sys.exit(1)

# 检测HBase中表是否存在
hm_ip = 'node3的IP'
hm_port = 9090
transport = TSocket.TSocket(hm_ip, hm_port)
transport = TTransport.TBufferedTransport(transport)
protocol = TBinaryProtocol.TBinaryProtocol(transport)
client = Hbase.Client(protocol)
transport.open()

# 试图创建表，如果已存在，则会跳入异常
try:
    print "试图创建表"

    # 创建表时，把cf列族的版本数设为1
    contents = ColumnDescriptor(name='cf:', maxVersions=1)
    client.createTable(table_name, [contents])
except:
    if hbase_exist_flag:
        print "表[%s]已存在，正在删除表" % table_name

        # hbase中的表，停用后才能删除
        client.disableTable(table_name)
        client.deleteTable(table_name)
        contents = ColumnDescriptor(name='cf:', maxVersions=1)
        client.createTable(table_name, [contents])

        # 创建成功后，打印出所有表名
        print "表创建成功，列表如下："
        table_name_list = client.getTableNames()
        for line in table_name_list:
            print line.strip()
        transport.close()
    else:
        print '表[%s]已经存在，请重新命名' % table_name
        sys.exit(1)
else:
    print "表创建成功，列表如下："
    table_name_list = client.getTableNames()
    for line in table_name_list:
        print line.strip()
    transport.close()

hdfs_file_path = '/hfile/data/%s' % file_name

# 导入hbase
def hbaseImport():
    print "开始导入数据"

    # 按照csv中的字段定义导入表带规则
    # 此时字段1将被用做HBASE_ROW_KEY
    rule = 'HBASE_ROW_KEY,cf:字段2,cf:字段3, ...'

    # 这里需要使用到hadoop提供的ImportTsv类，帮助我们进行导入。
    cmd = '%s/bin/hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.separator="," -Dimporttsv.columns=%s %s %s && echo $?' % (hbase_home, rule, table_name, hdfs_file_path)
    p = subprocess.Popen(cmd, shell=True, stdout = subprocess.PIPE )
    out = p.stdout.readlines()

    # 导入成功后，打印第一条纪录
    if len(out) > 0:
        print "导入成功, 第一条内容如下："
        transport.open()
        id = client.scannerOpen(table_name, '1', None)
        result = client.scannerGetList(id, 1)
        client.scannerClose(id)
        transport.close()
        for line in result:
            print line
    else:
        print "导入失败"
        sys.exit(1)

# 上传csv
def uploadHDFS():
    print "开始文件上传"
    cmd = '%s/bin/hadoop fs -put %s /hfile/data' % (hadoop_home, local_file_path)
    p = subprocess.Popen(cmd, shell=True, stderr = subprocess.PIPE )
    out = p.stderr.readlines()
    if len(out) > 0:
        for line in out:
            print line.strip()
        sys.exit(1)
    else:
        print "上传成功, 试图导入数据"
        hbaseImport()

# 删除hdfs中的文件
def deleteHDFS():
    print "文件已存在，开始删除文件[%s]" % file_name
    cmd = '%s/bin/hadoop fs -rm -f %s && echo $?' % (hadoop_home, hdfs_file_path)
    p = subprocess.Popen(cmd, shell=True, stdout = subprocess.PIPE )
    out = p.stdout.readlines()
    if len(out) > 0:
        print "删除成功, 试图上传文件"
        uploadHDFS()  
    else:
        print "删除失败"
        sys.exit(1)

# 测试hdfs中指定的文件是否存在        
def testHDFS():
    cmd = '%s/bin/hadoop fs -test -e %s && echo $?' % (hadoop_home, hdfs_file_path)
    p = subprocess.Popen(cmd, shell=True, stdout = subprocess.PIPE )
    out = p.stdout.readlines()
    if len(out) > 0:
        if hdfs_exist_flag == 1:
            print "文件已存在, 试图导入数据"
            hbaseImport()
        elif hdfs_exist_flag == 2:
            print "文件已存在，请删除HDFS文件或重命名后，重新执行"
            sys.exit(1) 
        elif hdfs_exist_flag == 3:
            deleteHDFS()
        else:
            print "hdfs_exist_flag参数设置有误"
            sys.exit(1) 
    else:
        uploadHDFS()
 
testHDFS()
sys.exit(0)
```

执行完成后，会在Jupyter中打印如下信息：

![rowc](/images/post/ai/hdp24.png)

本系列文章[《目录》](/ai/hadoop-use/)
