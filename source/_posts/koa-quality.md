---
title: 代码质量控制
categories:
  - koa
tags:
  - 全栈
  - NodeJS
date: 2018-04-08 11:36:21
---
所有项目开始前，我都习惯先设置ESLint，帮助我们的代码在整个团队中有一个统一的编写格式，方便查看，减少错误。

# Quick Start

## <font color=#c00>创建项目</font>

### 项目结构

在自己的工作目录创建项目文件夹，这里叫做test，目录结构如下：

test
&emsp;|--- 服务端
&emsp;|--- 移动端
&emsp;|--- 爬虫
&emsp;|--- 小程序
&emsp;|--- 其他

<!--more-->

### 初始化

在test根目录下初始化项目：

``` bash
npm init
```

<font color=#999>如果你使用git作为版本管理工具，可以在项目初始化时，填写仓库地址。</font>

## <font color=#c00>安装 ESLint</font>

代码质量控制的工具有很多，JSLint，JSHint等等，这里我习惯使用ESLint。

### 标准选择

官方提供了3种预安装包：

1. Google标准

	``` bash
	npm install eslint eslint-config-google -g
	```

2. Airbnb标准

	它依赖eslint, eslint-plugin-import, eslint-plugin-react, eslint-plugin-jsx-a11y插件，并且对各个插件的版本有所要求。你可以执行以下命令查看所依赖的各个版本：

	``` bash
	npm info "eslint-config-airbnb@latest" peerDependencies
	```

	输出信息，包含了每个plugin的版本要求

	``` bash
	{ eslint: '^4.9.0',
	  'eslint-plugin-import': '^2.7.0',
	  'eslint-plugin-jsx-a11y': '^6.0.2',
	  'eslint-plugin-react': '^7.4.0' }
	```

	用如下命令执行安装：

	``` bash
	npm install eslint-config-airbnb eslint@^#.#.# eslint-plugin-jsx-a11y@^#.#.# eslint-plugin-import@^#.#.# eslint-plugin-react@^#.#.# -g
	```

3. Standard标准

	``` bash
	npm install eslint-config-standard eslint-plugin-standard eslint-plugin-promise -g
	```

这里我推荐把eslint相关的包都安装在全局目录中。因为后面我们会用到React相关的东东，所以这里选择Airbnb标准。

## <font color=#c00>NPM包安装建议</font>

这里我想说明下npm包的安装建议，本文推荐大部分包都安装在全局npm仓库中，将全局仓库作为本地公用仓库，类似Maven的本地仓。自己开发的包也可以安装在本地公共仓库中，方便其他项目调用，也减少副本量。如果专门为本项目开发的包或者必须在项目内调用，又或者你对某着第三方包做了一些修改，那么可以将其放在项目内仓库。

## <font color=#c00>eslintrc 配置</font>

这里配置你的习惯用法，下面是我习惯使用的配置项。

``` json
{
  "extends": "airbnb",
  "rules": {
    "comma-dangle": ["error", "never"],
    "strict": 0,
    "indent": ["error", 4, { "SwitchCase": 1 }],
    "no-useless-constructor": 0,
    "no-undef": 0,
    "react/prefer-stateless-function": 0,
    "one-var": 0,
    "keyword-spacing": 0,
    "brace-style": ["error", "stroustrup"],
    "no-else-return": 0,
    "wrap-iife": [2, "inside", { "functionPrototypeMethods": true }],
    "import/newline-after-import": 0,
    "class-methods-use-this": 0,
    "no-underscore-dangle": 0,
    "no-restricted-syntax": [0, "BinaryExpression[operator='of']"],
    "global-require": 0,
    "no-param-reassign": 0,
    "no-new-func": 0,
    "max-len": 0,
    "consistent-return": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/no-dynamic-require": 0,
    "react/jsx-indent": 0,
    "react/forbid-prop-types": 0
  }
}
```

配置好后，保存为eslintrc.json文件并将其放在项目的根目录。

## <font color=#c00>WebStorm 配置</font>

因为本项目使用WebStorm进行开发，所以需要配置下WebStorm的ESLint。

我这里使用的是macos版，依次选择如下菜单：

菜单栏WebStorm > Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint

![eslint](/images/post/koa/koa1.png)

<font color=#c00>注：ESLint的Enable勾选，该项目下的其他质量工具取消Enable选项。</font>

## <font color=#c00>小结</font>

这节我们讲了下如何引入代码质量检测工具，帮助我们规范代码，检测编写错误。下节我们开始[《》](/koa/)

本系列文章[《目录》](/koa/koa-start/)