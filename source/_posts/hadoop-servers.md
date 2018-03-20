---
title: 服务器批量安装
categories:
  - hadoop
tags:
  - 大数据
date: 2018-03-16 13:11:05
---
在安装Hadoop分布式系统之前，我们需要准备好服务器资源，如果采用云服务器，可以跳过此篇文章。批量无人值守安装操作系统，此次示例系统为<font color=#c00>CentOS7.x</font>且推荐安装<font color=#c00>X window用户界面</font>，后面会用到，服务器数量为<font color=#c00>4</font>台，当然你可以使用大于等于3台以上数量的机器。

在4台机器中，随意选择1台安装服务。<font color=#c00>注：推荐直接使用实体机进行安装，或者非VMware的虚拟机，否则无人值守批量安装系统时可能会出错。</font>

<!--more-->
# Quick Start
## <font color=#c00>安装FTP服务</font>

### 安装[vsftp服务](https://baike.baidu.com/item/vsftpd/5254770?fr=aladdin)：

``` bash
yum -y install vsftpd 
```

### 启动vsftp服务：

``` bash
systemctl start vsftpd.service
```

### 将准备好的系统iso文件加载到光驱

如果使用虚拟机，则加载iso文件，如果是实体机可使用光盘或U盘加载系统文件。

### 将光驱文件挂在到ftp目录下：

``` bash
mount /dev/cdrom /var/ftp/pub
```

### 测试FTP服务是否可以匿名登录，命令如下：

1. 如果系统提示[lftp服务](http://man.linuxde.net/lftp)未安装，安装lftp

	``` bash
	yum -y install lftp
	```

2. 进入lftp模式后会看到pub文件夹，如果没有，请关闭防火墙和selinux

   关闭防火墙：<font color=#999>systemctl stop firewalld.service</font>
   查看selinux：<font color=#999>getenforce</font>
   暂时关闭selinux：<font color=#999>setenforce 0</font>
   永久关闭selinux：<font color=#999>修改/etc/selinux/config文件SELINUX=enforcing改为SELINUX=disabled，重启即可</font>

3. 进入pub文件夹，如果有文件，测试正常


## <font color=#c00>安装[PXE](https://baike.baidu.com/item/PXE/6107945?fr=aladdin)并生成pxelinux.0启动文件</font>

### 安装syslinux服务：

``` bash 
yum install -y syslinux
```

### 查询文件所在目录：

``` bash
rpm -ql syslinux | grep "pxelinux.0"
```

## <font color=#c00>安装TFTP服务</font>

### 安装[tftp服务](https://baike.baidu.com/item/tftp/455170?fr=aladdin)：

``` bash
yum -y install tftp-server
```

### 修改配置文件：

打开/etc/xinetd.d/tftp文件，修改disable=no

### 启动tftp服务：

``` bash
systemctl start xinetd.service
```

### 查看server_args的值找到tftpboot文件夹路径（通常为/var/lib/tftpboot）

``` bash
systemctl start xinetd.service
```

### 拷贝文件

在tftpboot文件夹下，新建文件夹pxelinux.cfg，并执行如下命令：
``` bash
cp /usr/share/syslinux/pxelinux.0 .
cp /var/ftp/pub/isolinux/isolinux.cfg ./pxelinux.cfg/default
cp /var/ftp/pbu/isolinux/vmlinuz .
cp /var/ftp/pbu/isolinux/initrd.img .
```

### 设置权限
设置./pxelinux.cfg/default的权限为644：

``` bash
chmod 644 default
```

## <font color=#c00>安装DHCP服务</font>

### 安装[dhcp服务](https://baike.baidu.com/item/DHCP/218195?fr=aladdin) 

``` bash
yum -y install dhcp
```

### 配置/etc/dhcp/dhcpd.conf：

``` bash
ddns-update-style interim;
allow booting;
allow booting;
next-server 192.168.0.1;
filename "pxelinux.0";
default-lease-time 1800;
max-lease-time 7200;
ping-check true;
option domain-name-servers 192.168.0.1;
subnet 192.168.0.0 netmask 255.255.255.0
{
  range 192.168.0.100 192.168.0.220;
  option routers 192.168.0.1;
  option broadcast-address 192.168.0.255;
}
```

### 启动HDCP： 

``` bash
systemctl start dhcpd.service
```

## <font color=#c00>安装Kickstart工具</font>

### 安装:

``` bash
yum -y install system-config-kickstart
```

### 运行Kickstart并配置选项

启动Kickstart Configurator界面<font color=#c00>（该软件需要系统安装X window）</font>
``` bash
system-config-kickstart
```

### 配置选项页Basic Configuration：

1. Time Zone设置为Asia/Shanghai
2. 勾选 Use UTC clock
3. 设置Root Password与Confirm Password
4. 勾选Reboot system after installation
![Basic Configuration](/images/post/hadoop/hdp1.png)

### 配置选项页Installation Method：

1. 在Installation source选框中 点选 FTP
2. 填写FTP Server： <font color=#999>192.168.0.1</font>
3. 填写FTP Directory： <font color=#999>pub</font>
![Basic Configuration](/images/post/hadoop/hdp2.png)

### 配置选项页Boot Loader Options：

1. 点选 Install new boot loader
![Basic Configuration](/images/post/hadoop/hdp3.png)

### 配置选项页Partition Information

1. 勾选 Clear Master Boot Record
2. 勾选 Remove all existing partitions
3. 勾选 Initialize the disk label
4. 点击Add 自定义分区
![part](/images/post/hadoop/hdp4.png)

### 创建分区

1. 新增 /boot分区 文件系统类型xfs或者ext4 Fixed size: 200MB  
![boot](/images/post/hadoop/hdp5.png)
2. 新增 /swap分区(在File System Type中选择) Fixed size: 2048MB
![swap](/images/post/hadoop/hdp6.png)
3. 新增 / 分区 点选Fill all unused space on disk
  ![other](/images/post/hadoop/hdp7.png)
4. 创建完成后点击OK

### 配置选项页Network COnfiguration：

点击Add Network Device, 下拉菜单中选择DHCP, 如果Network Device为空，请填写自己的网卡设备
![dhcp](/images/post/hadoop/hdp8.png)

### 配置选项页Fireswall Configuration：

1. SELinux下拉选项：<font color=#999>Disabled</font>
2. Security level下拉选项：<font color=#999>Disable firewall</font>
![selinux](/images/post/hadoop/hdp9.png)

### 保存选项到文件

完成配置并保存到/var/ftp/ks/ks.cfg
![save](/images/post/hadoop/hdp10.png)

### 修改启动引导文件

文件路径为/var/lib/tftpboot/pxelinux.cfg/default

``` bash
timeout 60 //暂定时间
label ks //选项
kernel vmlinuz
append ks=ftp://192.168.0.1/ks/ks.cfg initrd=initrd.img
```
类似如下图：
![cfg](/images/post/hadoop/hdp11.png)

## <font color=#c00>小结</font>

到此，无人值守服务已全部配置完成，分别开启其他3台机器后，可自动进入系统安装。下篇开始搭建Hadoop服务。



