##### 方法一：利用grep查找



```bash
strA="long string"
strB="string"
result=$(echo $strA | grep "${strB}")
if [[ "$result" != "" ]]
then
    echo "包含"
else
    echo "不包含"
fi
```

> 先打印长字符串，然后在长字符串中 grep 查找要搜索的字符串，用变量result记录结果
>  如果结果不为空，说明strA包含strB。如果结果为空，说明不包含。
>  这个方法充分利用了grep 的特性，最为简洁。

##### 方法二：利用字符串运算符



```bash
strA="helloworld"
strB="low"
if [[ $strA =~ $strB ]]
then
    echo "包含"
else
    echo "不包含"
fi
```

##### 方法三：利用通配符



```bash
A="helloworld"
B="low"
if [[ $A == *$B* ]]
then
    echo "包含"
else
    echo "不包含"
fi
```

##### 方法四：利用case in 语句



```bash
thisString="1 2 3 4 5" # 源字符串
searchString="1 2" # 搜索字符串
case $thisString in 
    *"$searchString"*) echo Enemy Spot ;;
    *) echo nope ;;
esa
```

##### 方法五：利用替换



```bash
STRING_A="hello word"
STRING_B="llo"
if [[ ${STRING_A/${STRING_B}//} == $STRING_A ]]
then
    echo N
else
    echo Y
fi
```

##### 其他方法



```bash
#! /bin/bash

var1="hello"
var2="he"
#方法1
if [ ${var1:0:2} = $var2 ]
then
    echo "1:include"
fi
#方法2
echo "$var1" |grep -q "$var2"
if [ $? -eq 0 ]
then
    echo "2:include"
fi
#方法3
echo "$var1" |grep -q "$var2" && echo "include" || echo "not"
#方法4
[[ "${var1/$var2/}" != "$var2" ]] && echo "include" || echo "not"
```

