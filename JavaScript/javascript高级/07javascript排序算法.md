---
title: javascript排序
date: 2018-05-12
categories: javascript
---

### 1 冒泡排序

```javascript
let arr = [3,6,11,0,-1,45];
function BubbleSort(arr){
    // 入参的判断
    if(!Array.isArray(arr)){
        throw new Error()
    }
    let i,j;
    for(i = 1 ; i < arr.length; i ++) {
        let done = true; // 标记排序是否完毕
        for(j = 0 ; j < arr.length - i; j++) {
            if(arr[j] > arr[j+1]) {
                // 交换两个元素的位置
                [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
                done = false; // 如果标记为false,表示排序还没有完成；
            }
        }
        if(done) { // 如果排序完成，结束排序算法
            break;
        }
    }
    return arr;
}
console.log(BubbleSort(arr));
```

### 2 选择排序

```javascript
function selectSort(arr) {
    if(!Array.isArray(arr)) {
        throw new Error();
    }
    let i,j;
    for(i = 1 ;i < arr.length; i++ ) {
        let maxIndex = 0 ;
        for(j = 0;j < arr.length - i; j++) {
            if(arr[maxIndex] < arr[j]) {
                maxIndex = j;//记录数组中最大值的索引
            }
        }
        // 将找到的最大值与数组的最后一位进行位置互换
        [arr[arr.length - i],arr[maxIndex]] = [arr[maxIndex],arr[arr.length - i ]] 
    }
    return arr;
}
console.log(selectSort(arr))
```

### 3 插入排序（对于大规模数组，插入排序会很慢）

```javascript
function insertSort(arr) {
  let i ,j ;
  for( i = 1 ; i < arr.length ; i++) {
    for( j = i - 1 ; j > 0 && arr[j] < arr[j-1] ; j--) {
      [arr[j],arr[j-1]] = [arr[j-1],arr[j]]
    }
  }
  return arr;
}
console.log(insertSort(arr)
```

插入排序的复杂度取决于数组的初始顺序，如果数组已经部分有序了，逆序较少，那么插入排序会很快。

- 平均情况下插入排序需要 ~N2/4 比较以及 ~N2/4 次交换；
- 最坏的情况下需要 ~N2/2 比较以及 ~N2/2 次交换，最坏的情况是数组是倒序的；
- 最好的情况下需要 N-1 次比较和 0 次交换，最好的情况就是数组已经有序了。

### 对应各个排序的时间复杂度和空间复杂度

|                  |      |          |                              |            |                          |
| ---------------- | ---- | -------- | ---------------------------- | ---------- | ------------------------ |
| 算法             | 稳定 | 原地排序 | 时间复杂度                   | 空间复杂度 | 备注                     |
| 选择排序         | no   | yes      | N2                           | 1          |                          |
| 冒泡排序         | no   | yes      | N2                           | 1          |                          |
| 插入排序         | yes  | yes      | N ~ N2                       | 1          | 时间复杂度和初始顺序有关 |
| 希尔排序         | no   | yes      | N 的若干倍乘于递增序列的长度 | 1          |                          |
| 快速排序         | no   | yes      | NlogN                        | logN       |                          |
| 三向切分快速排序 | no   | yes      | N ~ NlogN                    | logN       | 适用于有大量重复主键     |
| 归并排序         | yes  | no       | NlogN                        | N          |                          |
| 堆排序           | no   | yes      | NlogN                        | 1          |                          |

 

