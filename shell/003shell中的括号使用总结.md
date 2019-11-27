---

---

### 1 shell 中的 ( ) 的使用总结

（）:开启子shell 外层不受影响；数组的定义

```sh
pwd
(cd ./pkg;pwd)
pwd
```

输出

```sh
/Users/didi/learn/learnSPace/08node/08sh-learn
/Users/didi/learn/learnSPace/08node/08sh-learn/pkg
/Users/didi/learn/learnSPace/08node/08sh-learn
```

数组的定义

```sh
AGE=(1 2 3)
echo "First Age Index${AGE[0]}"
echo "Second Age Index${AGE[1]}"
val=`expr 2 + 2`;
```

`$()` 等同于 `    ``  `

```sh
pwd
ret=`cd ./pkg;pwd`
pwd
echo "${ret}"
```

```sh
pwd
ret="$(cd ./pkg;pwd)"
pwd
echo "${ret}"
```

输出

```sh
/Users/didi/learn/learnSPace/08node/08sh-learn
/Users/didi/learn/learnSPace/08node/08sh-learn
/Users/didi/learn/learnSPace/08node/08sh-learn/pkg
```







[参考](https://juejin.im/post/5d46b2c1e51d4561e721de85)

[参考1](https://blog.csdn.net/tttyd/article/details/11742241)

[linux命令查找](https://wangchujiang.com/linux-command/c/type.html)