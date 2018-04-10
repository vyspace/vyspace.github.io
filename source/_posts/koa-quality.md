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

### 例子

1. 第一个栗子：

    ``` bash
    npm install 模块A@1.0.1 -g
    ```

    在全局仓库中会安装1.0.1版本的模块A，以及它所用到的依赖模块。

    ``` bash
    npm install 模块A@2.0.0 -g
    ```

    此时，原来1.0.1版本的模块A将被2.0.0版本覆盖，相关依赖也会发生版本变化。

    通过上面的栗子我们发现，npm仓库并不像maven仓库那样会保存每个模块的不同版本，这样一来我们无法把全局仓库作为一个本地中央仓库，供不同的项目进行不同版本的调用。

2. 第二个栗子：

    ``` bash
    npm install -g 模块B --save
    ```

    当你在全局仓库中安装了模块B，发现全局仓库中并没有生成package.json，在项目根目录的package.json中也未记录模块的版本信息，同样package-lock.json中也同样不会记录准确的依赖信息。

    这样会导致一个很麻烦的问题，当你在本地开发完成后，将其放在服务器中时，无法使用npm install命令进行项目依赖的安装。

### 结论

1. 尽量不要将依赖包安装在全局仓库，除非必须。

2. 在每个项目的根目录，进行依赖包的安装，方便下面的子项目统一调用，方便管理，尽量减少依赖副本。

3. 如果子项目中有依赖版本冲突，可在子项目中安装依赖。

4. package.json中的版本控制，尽量使用精准版本或者~，不要使用^或＊。以免改变环境时，造成依赖错误。

5. 每个模块使用手动精准更新，不要一次性全部更新。

npm的依赖包版本问题一直是一个诟病的问题，尤其在项目越大时，越会凸显出来，建议不要开发过大的项目。

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