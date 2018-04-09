---
title: XGBoost Yarn
categories:
  - ai
tags:
  - 大数据
date: 2018-04-09 14:05:15
---
XGBoost是不支持分布式计算的，所以为了让我们的代码可以运行在Spark的集群中，这里我们引入了XGBoost4J，这是一个Java版本。下面我们就来看看如何安装并使用XGBoost4J。

<font color=#c00>注：XGBoost4J是我们编译后产生的一个jar包，我们会使用这个jar包中的API进行开发。编译此jar包坑很多，这里有几点需要注意。使用Maven在Linux环境（与Spark环境相同的操作系统）下进行编译，切记不要用IDE在MacOS或Windows环境中编译jar包，编译后因为jni的问题，在Spark的集群模式下无法运行，或运行中断。</font>

# Quick Start

## <font color=#c00>Maven</font>

<!--more-->

### 下载

这里我依然选择node0节点，进行编译。[下载Naven的安装包](http://maven.apache.org/download.cgi)(注意不要下载源码包)，并解压在/opt目录下。本文所使用的版本是3.5.2

### 环境变量

``` bash
export MAVEN_HOME=/opt/apache-maven-3.5.2
export PATH=$MAVEN_HOME/bin:$PATH
```

### 国内镜像

打开conf/settings.xml的mirrirs标签中，添加如下配置：

``` xml
<mirror>
   <id>nexus-aliyun</id>
   <mirrorOf>*</mirrorOf>
   <name>Nexus Aliyun</name>
   <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>
```

### 本地仓库位置

conf/settings.xml

``` xml
<localRepository>/home/test/.m2/repository</localRepository>
```

本文未设置，所以仓库默认位置为/root/.m2/repository。

<font color=#c00>注：推荐大家设置此参数，默认存放位置是/当前用户/.m2/repository，所以当你使用不同的用户时，本地仓库也会发生变化，这样导致副本数增多，所以指定一个任意用户都可访问的路径作为本地仓库。</font>

### 测试

``` bash
mvn -v
```

打印出版本信息后，说明安装成功。

## <font color=#c00>打包XGBoost4J</font>

``` bash
cd /opt/xgboost-packages/xgboost/jvm-packages
```

进入该文件夹，执行编译命令：

``` bash
mvn package
```

编译过程会等上一段时间，它会一边编译一边测试。这段时间可以看场电影...

编译结束后，在jvm-packages/xgboost4j-spark/target中生成两个jar包，这里我们使用<font color=#c00>xgboost4j-spark-0.7-jar-with-dependencies.jar</font>。也许你编译出的版本会有不同，但没有关系。

## <font color=#c00>本地仓库安装</font>

将刚才编译好的jar包，安装在本地仓库，方便调用。

``` bash
mvn -DskipTests install
```

## <font color=#c00>Scala</font>

### 创建工程

手动创建一个简单的Maven工程，groupId，artifactId可自行定义，本文定义：

``` bash
groupId = org.test.mvn
artifactId = xgb4j
```

工程结构如下：

xgb4j_scala
&emsp;|--- pom.xml
&emsp;|--- target
&emsp;|--- src
&emsp;&emsp;&emsp;|--- test
&emsp;&emsp;&emsp;|--- main
&emsp;&emsp;&emsp;&emsp;&emsp;|--- resources
&emsp;&emsp;&emsp;&emsp;&emsp;|--- scala
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|--- org.test.mvn
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|--- App.scala

### 编写对象类

在org.test.mvn包中创建App对象类，代码如下：

``` scala
package org.test.mvn

import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.mllib.util.MLUtils
import org.apache.spark.ml.feature.{LabeledPoint => MLLabeledPoint}
import org.apache.spark.ml.linalg.{DenseVector => MLDenseVector}
import ml.dmlc.xgboost4j.scala.spark.XGBoost

object App {
    def main(args: Array[String]): Unit = {
        val sparkConf = new SparkConf().setAppName("xgb4j-spark").set("spark.hadoop.validateOutputSpecs", "false")
        val sc = new SparkContext(sparkConf)
        val dataPath = "hdfs中数据存放路径，例如：/hfile/data"
        val outPath = "hdfs中结果存放路径，例如：/hfile/out/xgb4j"
        val trainFile = dataPath + "/agaricus.txt.train"
        val testFile = dataPath + "/agaricus.txt.test"
        val trainRDD = MLUtils.loadLibSVMFile(sc, trainFile).map(lp => MLLabeledPoint(lp.label, new MLDenseVector(lp.features.toArray)))
        val testSet = MLUtils.loadLibSVMFile(sc, testFile).map(lp => new MLDenseVector(lp.features.toArray))
        val paramMap = List(
            "eta" -> 0.1f,
            "max_depth" -> 2,
            "silent" -> 1,
            "objective" -> "binary:logistic"
        ).toMap
        println("start train")
        val xgbModel = XGBoost.trainWithRDD(trainRDD, paramMap, 3, 2, useExternalMemory = true)
        println("train success")
        val result = xgbModel.predict(testSet, missingValue = Float.NaN)
        xgbModel.save(outPath + "/xgbmodel")
        result.saveAsTextFile(outPath + "/result")
        sc.stop()
    }
}
```

### 配置pom

``` xml
<?xml version="1.0" encoding="utf-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.test.mvn</groupId>
  <artifactId>xgb4j</artifactId>
  <version>0.0.1</version>
  <packaging>jar</packaging>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <scala.version>2.11.12</scala.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.scala-lang</groupId>
      <artifactId>scala-library</artifactId>
      <version>${scala.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.spark</groupId>
      <artifactId>spark-core_2.11</artifactId>
      <version>2.1.1</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>org.apache.spark</groupId>
      <artifactId>spark-mllib_2.11</artifactId>
      <version>2.2.0</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>ml.dmlc</groupId>
      <artifactId>xgboost4j-spark</artifactId>
      <version>0.7</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.scala-tools</groupId>
        <artifactId>maven-scala-plugin</artifactId>
        <version>2.11</version>
        <executions>
          <execution>
            <goals>
              <goal>compile</goal>
              <goal>testCompile</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.0.0</version>
        <configuration>
          <archive>
            <manifest>
              <addClasspath>true</addClasspath>
              <mainClass>org.test.mvn.App</mainClass>
            </manifest>
          </archive>
        </configuration>
      </plugin>
      <plugin>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>3.0.0</version>
        <configuration>
          <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
          </descriptorRefs>
        </configuration>
        <executions>
          <execution>
            <id>make-assembly</id> <!-- this is used for inheritance merges -->
            <phase>package</phase> <!-- bind to the packaging phase -->
            <goals>
              <goal>single</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```

使用<font color=#c00>mvn package</font>，打包项目。

完成后，在target文件夹中生成<font color=#c00>xgb4j-0.0.1-jar-with-dependencies.jar</font>

## <font color=#c00>集群测试</font>

### 命令行提交
1. 删除输出文件夹

	``` bash
	$HADOOP_HOME/bin/hadoop fs -rm -R /hfile/out/xgb4j
	```

2. 运行spark job

	``` bash
	$SPARK_HOME/bin/spark-submit --master yarn --deploy-mode cluster --class org.vys.mvn.App $JN_HOME/Lib/xgb4j-0.0.1-jar-with-dependencies.jar
	```

3. 将结果取回本地

	``` bash
	$HADOOP_HOME/bin/hadoop fs -get /hfile/out/xgb4j $JN_HOME/Lib
	```

### Jupyter Notebook

``` bash
import os
import subprocess
dir_path = os.getcwd()
hadoop_home = os.environ.get('HADOOP_HOME')
spark_home = os.environ.get('SPARK_HOME')
jn_home = os.environ.get('JN_HOME')
# 这里你可以把xgb4j包放在任意位置，这里我放在jupyter_notebook的工作目录中，方便大家调用。
jar_name = '%s/Lib/xgb4j-0.0.1-jar-with-dependencies.jar' % jn_home
mode = 'cluster'
cmd_del = '%s/bin/hadoop fs -rm -R /hfile/out/xgb4j' % hadoop_home
cmd_train = '%s/bin/spark-submit --master yarn --deploy-mode %s --class org.vys.mvn.App %s' % (spark_home, mode, jar_name)
cmd_get = '%s/bin/hadoop fs -get /hfile/out/xgb4j %s' % (hadoop_home, dir_path)
print 'start train'
# 开始训练前，删除上一次生成的结果文件夹，否侧会报错。
subprocess.Popen(cmd_del, shell=True, stderr = subprocess.PIPE )
p = subprocess.Popen(cmd_train, shell=True, stderr = subprocess.PIPE )
out = p.stderr.readlines()
for line in out:
    print line.strip()
subprocess.Popen(cmd_get, shell=True, stderr = subprocess.PIPE )
```

本系列文章[《目录》](/ai/hadoop-use/)
