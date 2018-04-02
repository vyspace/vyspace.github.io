---
title: Jupyter 部署
categories:
  - ai
tags:
  - 大数据
date: 2018-04-02 16:56:20
---
Jupyter Notebook 是一个Python在线编辑器，在机器学习领域很流行，调试代码也很方便。当然你可以选择其他编辑器。因为后面的示例会有一部分使用Python完成，所以这篇我们来部署Jupyter。

# Quick Start

## <font color=#c00>Anaconda</font>

### 安装

Anaconda是Python的版本管理工具，登陆[官方网站](https://www.anaconda.com/)下载安装包，其安装文件分为Python3.x与Python2.7版本。

首先选择一个主要Python版本，这里选择2.7，所以我们下载Anaconda(py2)，下载可直接运行sh文件进行安装。安装完成后可运行如下指令查看conda的信息：

``` base
conda info
```

### 切换Python3

运行如下命令，安装Python3

``` base
conda create -n py3 python=3
```

### 版本切换

回到py2

``` base
source deactivate py3
```

进入py3

``` base
source activate py3
```

除了Anaconda，你也可以安装它的mini版，Miniconda。

Anaconda包内已经包含了Jupyter，在装完anaconda应该会自动安装了Jupyter，下面就可以直接启动Jupyter服务了。

## <font color=#c00>Jupyter</font>

<font color=#c00>注：启动Jupyter服务建议不要使用root账户，原因后面会说到，所以我们切换到其他账户，这里我切换到test账户：</font>

``` base
su test
```

### 生成配置文件

``` base
jupyter notebook --generate-config
```

生成后的文件会在~/.jupyter中

### 自动生成密钥

因为服务开放后，所有人都可以访问，所以需要配置密码（此步也是必须的）。

``` base
jupyter notebook password
```

运行此命令后，可输入两次密码，完成后会在~/.jupyter/upyter_notebook_config.json文件中生成一串token。

### 配置HTTP服务

打开~/.jupyter/jupyter_notebook_config.py文件，修改如下配置项：

``` base
# 容许所有IP可访问
c.NotebookApp.ip = '*'

# 初始化notebook工作区根目录，我在test帐户下，新建jupyter_notebook文件夹作为根目录
c.NotebookApp.notebook_dir = u'/home/test/jupyter_notebook'

＃ 是否打开浏览器立即启动
c.NotebookApp.open_browser = False

＃ 之前生成的token
c.NotebookApp.password ＝ u'sha1:xxx'

＃ 端口配置
c.NotebookApp.port = 8888
```

### 运行服务

``` base
jupyter notebook --config=~/.jupyter/jupyter_notebook_config.py
```

## <font color=#c00>测试</font>

启动完成后，浏览器访问8888端口，就可以正常打开Jupyter了，


未完待续...