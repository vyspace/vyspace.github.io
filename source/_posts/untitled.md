

## Quick Start

## 安装FTP服务







## 安装[PXE](https://baike.baidu.com/item/PXE/6107945?fr=aladdin)并生成pxelinux.0启动文件

#### 安装syslinux服务：

``` bash 
yum install -y syslinux
```
#### 查询文件所在目录：

``` bash
rpm -ql syslinux | grep "pxelinux.0"
```

## 安装TFTP服务

##### 安装tftp服务：

``` bash
yum -y install tftp-server
```
##### 打开/etc/xinetd.d/tftp文件，修改disable=no

##### 启动tftp服务：

``` bash
systemctl start xinetd.service
```
##### 查看server_args的值找到tftpboot文件夹路径（通常为/var/lib/tftpboot）

``` bash
systemctl start xinetd.service
```
##### 拷贝文件
在tftpboot文件夹下，新建文件夹pxelinux.cfg，并执行如下命令：
``` bash
cp /usr/share/syslinux/pxelinux.0 .
cp /var/ftp/pub/isolinux/isolinux.cfg ./pxelinux.cfg/default
cp /var/ftp/pbu/isolinux/vmlinuz .
cp /var/ftp/pbu/isolinux/initrd.img .
```
##### 设置./pxelinux.cfg/default的权限为644：

``` bash
chmod 644 default
```

## 安装DHCP服务

##### 安装服务： 

``` bash
yum -y install dhcp
```
##### 配置/etc/dhcp/dhcpd.conf：

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
##### 启动HDCP： 

``` bash
systemctl start dhcpd.service
```

## 安装Kickstart工具

##### 安装工具

``` bash
yum -y install system-config-kickstart
```
##### 运行Kickstart，启动视窗界面

``` bash
system-config-kickstart
```
##### 配置选项页Basic Configuration：

1. Time Zone设置为Asia/Shanghai
2. 勾选 Use UTC clock
3. 设置Root Password与Confirm Password
4. 勾选Reboot system after installation
![Basic Configuration](/images/post/hadoop/hdp1.png)

##### 配置选项页Installation Method：

1. 在Installation source选框中 点选 FTP
2. 填写FTP Server <font color=#999>192.168.0.1</font>
3. 填写FTP Directory <font color=#999>pub</font>
![Basic Configuration](/images/post/hadoop/hdp2.png)

##### 配置选项页Boot Loader Options：

1. 勾选 Install new boot loader

​

​